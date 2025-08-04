import {Navigate} from 'react-router-dom';
import PropTypes from 'prop-types';

export const PrivateRoute = ({children, isAuthenticated, redirectPath}) => {
  return isAuthenticated ? children : <Navigate to={redirectPath} />;
}

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  redirectPath: PropTypes.string.isRequired,
};
