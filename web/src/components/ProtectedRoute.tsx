import { Navigate, Outlet } from "react-router";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ redirectTo = "/signin" }) {
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
        const { data } = await supabase.auth.getSession();
        setIsAuthenticated(!!data.session);
        setLoading(false);
        };
        checkAuth();
    }, []);

    if (loading) return <div>Loading...</div>;

    return isAuthenticated ? <Outlet /> : <Navigate to={redirectTo} />;
}