import React from "react";
import { Checkbox } from "antd";
import { useField } from "formik";

 export const CommonCheckbox = ({ label, ...props }) => {
  const [field] = useField({ ...props, type: 'checkbox' });
   return (
          <Checkbox  className='fw-bold mt-1' {...props} {...field}>{label}</Checkbox>
          
   );
 };