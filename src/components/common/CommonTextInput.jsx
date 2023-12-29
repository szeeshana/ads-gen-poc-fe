import { Input } from 'antd'
import { useField } from 'formik'
import React from 'react'

function CommonTextInput({ label, ...props }) {
    const [field, meta] = useField(props)
    return (
        <div>
            <div>
            <b className='text-grey'><label htmlFor={props.id || props.name}>{label}</label></b>
            </div>
            <Input className="" {...field} {...props}  />
            {meta.touched && meta.error ? (
                <div className="error">{meta.error}</div>
            ) : null}
        </div>
    )
}

export default CommonTextInput