import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

    const [user, setUser] = useState(() => {
        const name = sessionStorage.getItem("name");
        const role = sessionStorage.getItem("role");
        const id = sessionStorage.getItem("id");
        return name ? { id, name, role } : null;
    });

    const navigate = useNavigate();

    const login = (token, id, name, role) => {
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("id", id);
        sessionStorage.setItem("name", name);
        sessionStorage.setItem("role", role);
        setUser({ id, name, role });
    };

    const logout = (redirectPath = "/login") => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("id");
        sessionStorage.removeItem("name");
        sessionStorage.removeItem("role");
        setUser(null);
        navigate(redirectPath, { replace: true });
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}