import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { Route, Routes } from "react-router-dom";
import DashboardScreen from "../screens/01_Dashboard";

const ProtectedRouteContainer = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path="/">
          <Route index element={<DashboardScreen />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default ProtectedRouteContainer;
