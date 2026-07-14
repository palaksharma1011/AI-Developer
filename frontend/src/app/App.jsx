import "./App.css";
import AppRoutes from "../routes/AppRoutes";
import { UserProvider } from "../context/User.context.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <UserProvider>
      <AppRoutes />;
        <ToastContainer
        position="top-right"
        autoClose={3000}
      />
    </UserProvider>
  );
}

export default App;
