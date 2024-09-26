import React, { FC } from "react";
import { MultiCheck } from "./MultiCheck";
import { Controller } from "./Controller";

const App: FC = (): JSX.Element => {
  return (
    <Controller
      render={(options, values, columns, onChange) => (
        <MultiCheck
          label="MultiCheck"
          options={options}
          onChange={onChange}
          values={values}
          columns={columns}
        />
      )}
    />
  );
};

export default App;
