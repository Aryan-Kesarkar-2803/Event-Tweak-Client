import React, { useEffect, useState } from "react";
import {
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  FormControl,
  InputLabel,
} from "@mui/material";

const SelectBox = ({
  value,
  onChange,
  options = [],
  multiple = false,
  disabled= false,
}) => {

const optionsArray = (options || []).map(opt => ({
  value: opt,
  label: opt
}));



  return (
    <FormControl fullWidth>
  <Select
  disabled={disabled}
    MenuProps={{
      PaperProps:{
        style:{
          maxHeight:'40vh'
        }
      }
    }}
    displayEmpty
    multiple={multiple}
    value={value}
    onChange={onChange}
    renderValue={(selected) => {
      if (multiple) {
        return selected?.length === 0 ? "Select" : selected?.join(", ");
      } else {
        return selected === "" ? "Select" : selected;
      }
    }}
  >
    {/* Placeholder */}
    {!multiple && (
      <MenuItem disabled value="">
        Select
      </MenuItem>
    )}

    {optionsArray.map((opt, idx) => (
      <MenuItem key={idx} value={opt.value || opt}>
        {/* <Checkbox checked={value.includes(opt.value || opt)} /> */}
        {/* {multiple && <Checkbox checked={Array.isArray(value) && value.includes(opt.value || opt)} />} */}

         <Checkbox
              checked={
                multiple
                  ? Array.isArray(value) && value.includes(opt.value)
                  : value === opt.value
              }
            />

        <ListItemText primary={opt.label || opt} />
      </MenuItem>
    ))}
  </Select>
</FormControl>

  );
};

export default SelectBox;
