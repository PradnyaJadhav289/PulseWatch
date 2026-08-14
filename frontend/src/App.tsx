import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import DashboardLayout from "./layouts/Dashboardlayout";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route element={<DashboardLayout />}>

          <Route
            path="/"
            element={<Dashboard />}
          />

        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default App;