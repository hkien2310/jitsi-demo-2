import {
    RouterProvider,
    createBrowserRouter
} from "react-router-dom";
import PageNotFound from "../screen/404";
import CallScreen from "../screen/Call";
import HomeScreen from "../screen/HomeScreen";
import LoginScreen from "../screen/Login";
import DashboardScreen from "../screen/dashboard";
import ManageRoleScreen from "../screen/manageRole";
import ManageAccountScreen from "../screen/manageAccount";

const router = createBrowserRouter([
    {
        path: "/",
        element: <HomeScreen />,
    },
    {
        path: "/call",
        element: <CallScreen />,
    },
    {
        path: "/dashboard",
        element: <DashboardScreen />,
    },
    {
        path: "/login",
        element: <LoginScreen />,
    },
    {
        path: "/role",
        element: <ManageRoleScreen />,
    },
    {
        path: "/account",
        element: <ManageAccountScreen />,
    },
    {
        path: "*",
        element: <PageNotFound />,
    }
]);





const RouterList = (props?: any) => {
    return <RouterProvider router={router} />
}


export default RouterList
