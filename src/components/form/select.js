/* leny/enigjewo
 *
 * /src/components/form/select.js - Form Component: select
 *
 * coded by leny@BeCode
 * started at 11/02/2021
 */

import PropTypes from "prop-types";
import FormBase from "components/form/base";

const FormSelect = ({
    id,
    name,
    label,
    value,
    choices,
    withGroups = false,
    onChange,
    className,
}) => {
    const optionMapper = ([key, option]) => (
        <option key={key} value={key}>
            {option}
        </option>
    );

    const groupMapper = ([key, {label: lbl, options}]) => (
        <optgroup key={key} label={lbl}>
            {Object.entries(options).map(optionMapper)}
        </optgroup>
    );

    return (
        <FormBase id={id} label={label} className={className}>
            <div className={"control"}>
                <div className={"select"}>
                    <select
                        id={id}
                        name={name}
                        value={value}
                        onChange={onChange}>
                        {Object.entries(choices).map(
                            withGroups ? groupMapper : optionMapper,
                        )}
                    </select>
                </div>
            </div>
        </FormBase>
    );
};

FormSelect.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    label: PropTypes.node.isRequired,
    type: PropTypes.string,
    value: PropTypes.string.isRequired,
    choices: PropTypes.object.isRequired,
    withGroups: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
};

export default FormSelect;
