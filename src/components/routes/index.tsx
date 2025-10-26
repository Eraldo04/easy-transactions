import { Route, Routes } from "react-router-dom";
import ProtectedRouteContainer from "./ProtectedRouteContainer";
import LoginScreen from "../screens/00_Login";

const RoutersContainer = () => {
  return (
    <Routes>
      <Route path="/auth" element={<LoginScreen />} />
      <Route path="/*" element={<ProtectedRouteContainer />} />
    </Routes>
  );
};

export default RoutersContainer;
