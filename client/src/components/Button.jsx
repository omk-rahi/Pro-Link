import PropTypes from "prop-types";

const variants = {
  primary: "bg-blue-600 text-white hover:bg-blue-700",
};

const sizes = {};

const Button = ({
  variant = "primary",
  size = "medium",
  isLoading = false,
  children,
  ...props
}) => {
  return (
    <button
      className={`flex items-center justify-center gap-2 rounded-md px-8 py-2 transition-all ${variants[variant]} ${sizes[size]}`}
      disabled={isLoading}
      {...props}
    >
      {children}
      {isLoading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
      )}
    </button>
  );
};

Button.propTypes = {
  variant: PropTypes.string,
  size: PropTypes.string,
  isLoading: PropTypes.bool,
  children: PropTypes.node,
};

export default Button;
