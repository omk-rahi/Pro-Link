import { cloneElement } from "react";

import PropTypes from "prop-types";

const FormRow = ({ name, error, children, label }) => {
  const labelText = name.replace(name.charAt(0), name.charAt(0).toUpperCase());

  if (!label) label = labelText;

  return (
    <div>
      <label htmlFor={name} className="mb-2 block">
        {label}
      </label>

      {cloneElement(children, { id: name })}

      {error && <span className="mt-1 block text-red-600">{error}</span>}
    </div>
  );
};

FormRow.propTypes = {
  name: PropTypes.string,
  error: PropTypes.string,
  label: PropTypes.string,
  children: PropTypes.node,
};

export default FormRow;
