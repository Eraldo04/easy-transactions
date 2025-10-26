import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import RoutersContainer from "./components/routes";
import UserProvider from "./components/Context";

const App = () => {
  return (
    <UserProvider>
      <BrowserRouter>
        <RoutersContainer />
        <Toaster />
      </BrowserRouter>
    </UserProvider>
  );
};

export default App;
