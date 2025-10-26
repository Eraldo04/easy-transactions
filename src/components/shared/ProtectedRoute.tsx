import { Navigate, Outlet } from "react-router-dom";
import Layout from "./Layout";
import { useContext } from "react";
import { UserContext } from "../Context";

export const ProtectedRoute = () => {
  const { user } = useContext(UserContext);

  return user || localStorage.getItem("user") !== null ? (
    <Layout>
      <Outlet />
    </Layout>
  ) : (
    <Navigate to="/auth" replace />
  );
};
