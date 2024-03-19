import { RouterProvider, createBrowserRouter } from "react-router-dom"
import LoginScreen from "../screen/Login";

const routerAuth = createBrowserRouter([
    {
        path: "*",
        element: <LoginScreen />,
    }
]);

const RouterAuth = (props?: any) => {
    return <RouterProvider router={routerAuth} />
}

export default RouterAuth