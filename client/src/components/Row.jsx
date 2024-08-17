import PropTypes from "prop-types";

const directions = {
  vertical: "flex-col",
  horizontal: "flex-row",
};

const spaces = {
  small: "gap-2",
  medium: "gap-4",
  large: "gap-8",
};

const Row = ({ children, direction = "vertical", space = "medium" }) => {
  return (
    <div className={`flex ${directions[direction]} ${spaces[space]}`}>
      {children}
    </div>
  );
};

Row.propTypes = {
  children: PropTypes.node,
  direction: PropTypes.string,
  space: PropTypes.node,
};

export default Row;
