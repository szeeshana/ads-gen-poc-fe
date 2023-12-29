import React from "react";
import { Input } from "antd";
import { useField } from "formik";
const { TextArea } = Input;

export const CommonTextAreaInput = ({ label, fieldRequired, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <>

      <div className="mb-1">
      <b className='text-grey'><label htmlFor={props.id || props.name}>{label}</label></b>
      </div>
      <TextArea className="w-100" {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </>
  );
};
