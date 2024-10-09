import React, { FC, useState, useEffect, useMemo, useCallback } from "react";
import "./MultiCheck.css";

export type Option = {
  label: string;
  value: string;
};

/**
 * Notice:
 * 1. There should be a special `Select All` option with checkbox to control all passing options
 * 2. All the options (including the "Select All") should be split into several columns, and the order is from top to bottom in each column
 */
type Props = {
  // the label text of the whole component
  label?: string;
  // Assume no duplicated labels or values
  // It may contain any values, so be careful for you "Select All" option
  options: Option[];
  // Always be non-negative integer.
  // The default value is 1
  // 0 is considered as 1
  // We only check [0, 1, 2, ... 10], but it should work for greater number
  columns?: number;
  // Which options should be selected.
  // - If `undefined`, makes the component in uncontrolled mode with no default options checked, but the component is still workable;
  // - if not undefined, it's considered as the default value to render the component. And when it changes, it will be considered as the NEW default value to render the component again
  // - Assume no duplicated values.
  // - It may contain values not in the options.
  values?: string[];
  // if not undefined, when checked options are changed, they should be passed to outside
  // if undefined, the options can still be selected, but won't notify the outside
  onChange?: (options: Option[]) => void;
};

export const MultiCheck: FC<Props> = ({
  label,
  options,
  columns,
  values,
  onChange,
}) => {
  const [checkedValues, setCheckedValues] = useState<string[]>([]);

  // Determine if 'Select All' should be checked
  const isSelectAllChecked = useMemo(
    () => checkedValues.length === options.length,
    [checkedValues, options.length]
  );

  // Sync with external `values` and `options` prop when it changes
  useEffect(() => {
    if (values) {
      const newValues = options
        .map((option) => {
          if (values.includes(option.value)) {
            return option.value;
          }
        })
        .filter((value): value is string => value !== undefined);

      setCheckedValues(newValues);
      onChange?.(options.filter((option) => newValues.includes(option.value)));
    }
  }, [values, options]);

  // Handle Select All checkbox change
  const handleSelectAll = useCallback(
    (checked: boolean) => {
      const newValues = checked ? options.map((option) => option.value) : [];
      setCheckedValues(newValues);
      onChange?.(checked ? options : []);
    },
    [options, isSelectAllChecked]
  );

  // Handle individual option checkbox change
  const handleOptionChange = (optionValue: string, checked: boolean) => {
    const newValues = checked
      ? [...checkedValues, optionValue]
      : checkedValues.filter((value) => value !== optionValue);
    setCheckedValues(newValues);
    onChange?.(options.filter((option) => newValues.includes(option.value)));
  };

  // Split options into columns (top-to-bottom layout)
  const columnsArray = useMemo(() => {
    const validColumns = columns || 1; // Ensure `columns` is always a number
    const columnItems = Math.ceil((options.length + 1) / validColumns);
    let fullColumns = Math.floor((options.length + 1) / columnItems);

    if (columnItems != 1) {
      fullColumns = Math.floor(
        (options.length + 1 - validColumns) / (columnItems - 1)
      );
    }

    let remainItems = options.length;
    let startIndex = 0;

    const columns_array = [];
    for (let i = 0; i < validColumns; i++) {
      let remainColumns = validColumns - i;
      let itemsCount =
        i < fullColumns ? columnItems : Math.ceil(remainItems / remainColumns);
      if (i == 0) itemsCount -= 1;
      columns_array.push(options.slice(startIndex, startIndex + itemsCount));
      startIndex += itemsCount;
      remainItems -= itemsCount;
    }

    return columns_array;
  }, [options, columns]);

  return (
    <div className="MultiCheck">
      {label && <label>{label}</label>}

      <div className="MultiCheck-columns">
        {columnsArray.map((column, columnIndex) => (
          <div key={columnIndex} className="MultiCheck-column">
            {!columnIndex && (
              <label>
                <input
                  type="checkbox"
                  checked={isSelectAllChecked}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
                Select All
              </label>
            )}
            {column.map((option) => (
              <label key={option.value}>
                <input
                  type="checkbox"
                  checked={checkedValues.includes(option.value)}
                  onChange={(e) =>
                    handleOptionChange(option.value, e.target.checked)
                  }
                />
                {option.label}
              </label>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
