import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

const AdminProtectedRoute: React.FC = () => {
    const { isAdminLoggedIn } = useAdminAuth();

    if (!isAdminLoggedIn) {
        return <Navigate to="/admin/login" replace />;
    }

    return <Outlet />;
};

export default AdminProtectedRoute;
