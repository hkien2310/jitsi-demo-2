import {
    RouterProvider,
    createBrowserRouter
} from "react-router-dom";
import PageNotFound from "../screen/404";
import CallScreen from "../screen/Call";
import HomeScreen from "../screen/HomeScreen";
import LoginScreen from "../screen/Login";
import DashboardScreen from "../screen/dashboard";

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
        path: "*",
        element: <PageNotFound />,
    }
]);





const RouterList = (props?: any) => {
    return <RouterProvider router={router} />
}


export default RouterList
