/* leny/enigjewo
 *
 * /src/components/form/base.js - Form Component: base
 *
 * coded by leny
 * started at 11/02/2021
 */

import PropTypes from "prop-types";
import classnames from "classnames";

const FormBase = ({id, label, className, style = {}, children}) => (
    <div className={classnames("field", className)} style={style}>
        {label && <label htmlFor={id}>{label}</label>}
        {children}
    </div>
);

FormBase.propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.node,
    style: PropTypes.object,
    children: PropTypes.node,
};

export default FormBase;
