import React, { useState } from "react";

type target = "value" | "checked";
const useControlled = <T>(initialState: T, target: target = "value") => {
  const [value, setValue] = useState<T>(initialState);
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target[target];
    setValue(val as T);
  };
  const reset = () => setValue(initialState);
  return {
    value,
    onChange,
    reset,
    setValue,
  };
};
export default useControlled;
