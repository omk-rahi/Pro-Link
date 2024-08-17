import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

import { useUser } from "../hooks/authHooks";
import FullPageLoader from "./FullPageLoader";

const ProtectedRoutes = ({ children }) => {
  const navigate = useNavigate();

  const { user, isLoading } = useUser();

  useEffect(() => {
    if (!user && !isLoading) return navigate("/login");
  }, [user, navigate, isLoading]);

  if (isLoading) return <FullPageLoader />;

  return children;
};

ProtectedRoutes.propTypes = {
  children: PropTypes.node,
};

export default ProtectedRoutes;
