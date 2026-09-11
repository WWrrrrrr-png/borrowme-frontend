import { createContext,useContext,useState } from "react"; 

const AuthContext = createContext(null);  

export function AuthProvider({ children }) {

    const [user,setUser] = useState(() => {
        const name = localStorage.getItem("name"); 
        const role = localStorage.getItem("role"); 
        const id = localStorage.getItem("id"); 
        return name ? {id, name,role} : null; 
    });  

    const login = (token, id, name, role) => {
         
        localStorage.setItem("token",token); 
        localStorage.setItem("id", id); 
        localStorage.setItem("name",name); 
        localStorage.setItem("role",role);
        setUser({ id, name ,role});
    }; 

    const logout = () => {
        localStorage.removeItem("token"); 
         localStorage.removeItem("id"); 
         localStorage.removeItem("name"); 
         localStorage.removeItem("role");  
        setUser(null); 
    };
    
    return (
        <AuthContext.Provider value={{user, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
}  

export function useAuth(){
    return useContext(AuthContext);
}
