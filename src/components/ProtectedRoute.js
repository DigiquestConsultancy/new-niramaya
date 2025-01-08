import React from "react";
import { Route, Redirect } from "react-router-dom";

// ProtectedRoute component to handle login redirection
const ProtectedRoute = ({ component: Component, ...rest }) => {
  const userType = localStorage.getItem("userType"); // Check if user is logged in

  return (
    <Route
      {...rest}
      render={(props) =>
        userType ? (
          <Component {...props} /> // If logged in, render the component
        ) : (
          <Redirect to="/restricted" /> // Redirect to login or custom page
        )
      }
    />
  );
};

export default ProtectedRoute;