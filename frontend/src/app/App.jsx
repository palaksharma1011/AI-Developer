import "./App.css";
import AppRoutes from "../routes/AppRoutes";
import { UserProvider } from "../context/User.context.jsx";

function App() {
  return (
    <UserProvider>
      <AppRoutes />;
    </UserProvider>
  );
}

export default App;
