import { Outlet } from "react-router-dom";
import DashboardNavbar from "../components/DashboardNavbar";

function DashboardLayout() {

    return(
        <>
            <DashboardNavbar />

            <Outlet />
        </>
    )
}

export default DashboardLayout;