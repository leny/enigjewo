/* leny/enigjewo
 *
 * /src/components/form/select.js - Form Component: select
 *
 * coded by leny@BeCode
 * started at 11/02/2021
 */

import PropTypes from "prop-types";
import FormBase from "components/form/base";

const FormSelect = ({id, name, label, value, choices, onChange, className}) => (
    <FormBase id={id} label={label} className={className}>
        <div className={"control"}>
            <div className={"select"}>
                <select id={id} name={name} value={value} onChange={onChange}>
                    {Object.entries(choices).map(([key, option]) => (
                        <option key={key} value={key}>
                            {option}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    </FormBase>
);

FormSelect.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    label: PropTypes.node.isRequired,
    type: PropTypes.string,
    value: PropTypes.string.isRequired,
    choices: PropTypes.objectOf(PropTypes.string).isRequired,
    onChange: PropTypes.func.isRequired,
};

export default FormSelect;
