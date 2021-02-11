/* leny/enigjewo
 *
 * /src/components/form/input.js - Form Component: input
 *
 * coded by leny@BeCode
 * started at 11/02/2021
 */

import PropTypes from "prop-types";
import FormBase from "components/form/base";

const FormInput = ({
    id,
    name,
    label,
    value,
    onChange,
    type = "text",
    className,
    ...props
}) => (
    <FormBase id={id} label={label} className={className}>
        <div className={"control"}>
            <input
                type={type}
                id={id}
                name={name}
                className={"input"}
                value={value}
                onChange={onChange}
                {...props}
            />
        </div>
    </FormBase>
);

FormInput.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    label: PropTypes.node.isRequired,
    type: PropTypes.string,
    value: PropTypes.any.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default FormInput;
