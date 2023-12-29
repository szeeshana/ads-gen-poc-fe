import { Select } from "antd";
import { useField } from "formik";

function CommonSelect({ label, ...props }) {
    const [field, meta] = useField(props);
    return (
        <div>
            <b className="text-grey"><label htmlFor={props.id || props.name}>{label}</label></b><br/>
            <Select {...field} {...props} className="w-full mt-4"/>
            {meta.touched && meta.error ? (
                <div className="error">{meta.error}</div>
            ) : null}
        </div>
    );
};
export default CommonSelect