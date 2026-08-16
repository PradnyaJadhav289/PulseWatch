import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import DashboardLayout from "./layouts/Dashboardlayout";
import Applications from "./pages/Applications";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route element={<DashboardLayout />}>

          <Route
            path="/"
            element={<Dashboard />}
          />

          <Route
  path="/applications"
  element={<Applications />}
/>

        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default App;