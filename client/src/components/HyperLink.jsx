import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const HyperLink = ({ to, children }) => {
  return (
    <Link to={to} className="text-blue-600">
      {children}
    </Link>
  );
};

HyperLink.propTypes = {
  to: PropTypes.string,
  children: PropTypes.node,
};

export default HyperLink;
