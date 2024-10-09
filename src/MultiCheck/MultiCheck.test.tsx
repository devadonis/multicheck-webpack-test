import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MultiCheck, Option } from "./MultiCheck";

const options: Option[] = [
  { label: "Option 1", value: "1" },
  { label: "Option 2", value: "2" },
  { label: "Option 3", value: "3" },
  { label: "Option 4", value: "4" },
];

describe("MultiCheck Component", () => {
  test("renders the label correctly", () => {
    render(<MultiCheck label="Test Label" options={options} />);
    expect(screen.getByText("Test Label")).toBeInTheDocument();
  });

  test("renders checkboxes for all options", () => {
    render(<MultiCheck options={options} />);
    options.forEach((option) => {
      expect(screen.getByLabelText(option.label)).toBeInTheDocument();
    });
  });

  test("checks all options when 'Select All' is checked", () => {
    const handleChange = jest.fn();
    render(<MultiCheck options={options} onChange={handleChange} />);

    const selectAllCheckbox = screen.getByLabelText("Select All");
    fireEvent.click(selectAllCheckbox);

    expect(selectAllCheckbox).toBeChecked();
    options.forEach((option) => {
      expect(screen.getByLabelText(option.label)).toBeChecked();
    });
    expect(handleChange).toHaveBeenCalledWith(options);
  });

  test("unchecks all options when 'Select All' is unchecked", () => {
    const handleChange = jest.fn();
    render(
      <MultiCheck
        options={options}
        values={options.map((opt) => opt.value)}
        onChange={handleChange}
      />
    );

    const selectAllCheckbox = screen.getByLabelText("Select All");
    fireEvent.click(selectAllCheckbox); // Uncheck

    expect(selectAllCheckbox).not.toBeChecked();
    options.forEach((option) => {
      expect(screen.getByLabelText(option.label)).not.toBeChecked();
    });
    expect(handleChange).toHaveBeenCalledWith([]);
  });

  test("checks individual options correctly", () => {
    const handleChange = jest.fn();
    render(<MultiCheck options={options} onChange={handleChange} />);

    const option1 = screen.getByLabelText("Option 1");
    fireEvent.click(option1);

    expect(option1).toBeChecked();
    expect(handleChange).toHaveBeenCalledWith([
      { label: "Option 1", value: "1" },
    ]);
  });

  test("handles multiple columns", () => {
    render(<MultiCheck options={options} columns={2} />);

    const columns = screen.getAllByRole("checkbox");
    expect(columns.length).toBe(5); // 4 options + 1 "Select All"
  });

  test("syncs with external values", () => {
    const { rerender } = render(
      <MultiCheck options={options} values={["1", "2"]} />
    );
    expect(screen.getByLabelText("Option 1")).toBeChecked();
    expect(screen.getByLabelText("Option 2")).toBeChecked();

    // Update values
    rerender(<MultiCheck options={options} values={["3", "4"]} />);
    expect(screen.getByLabelText("Option 3")).toBeChecked();
    expect(screen.getByLabelText("Option 4")).toBeChecked();
  });
});
