import PropTypes from "prop-types";

const Input = ({ type, placeholder, ...props }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className="w-full rounded-md border px-6 py-2 outline-none ring-blue-600 invalid:ring-red-600 focus:ring-1"
      {...props}
    />
  );
};

Input.propTypes = {
  type: PropTypes.string,
  placeholder: PropTypes.string,
};

export default Input;
