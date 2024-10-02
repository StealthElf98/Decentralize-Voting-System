import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../Pages/LoginPage/LoginPage";
import RegisterPage from "../Pages/RegisterPage/RegisterPage";
import AdminPage from "../Pages/AdminPage/AdminPage";
import VoterPage from "../Pages/VoterPage/VoterPage";

export const router = createBrowserRouter([
    { path: '/', element: <LoginPage/>, children: []},
    { path: '/register', element: <RegisterPage/> },
    {
        path: '/admin',
        element: <AdminPage />
      },
      {
        path: '/voter',
        element: <VoterPage />
      },
    { path: '/unauthorized', element: <h1>ERROR 404: Page not found</h1> }, // Unauthorized access page
])