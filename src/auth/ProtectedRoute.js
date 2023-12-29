import { Navigate } from "react-router-dom";
const ProtectedRoute = ({children }) => {
  const isLoggedIn = localStorage.getItem("token");
  if (!isLoggedIn) {
    return <Navigate to="/sign-in" />;
  }
  return children;
};
export default ProtectedRoute;