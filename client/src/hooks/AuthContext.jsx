import { createContext, useContext, useState} from "react"
import PropTypes from 'prop-types';

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [authData, setAuthData] = useState(JSON.parse(localStorage.getItem("authData")) || {})

    const login = (userType) => {
        setAuthData({ loggedIn: true, userType })
        localStorage.setItem("authData", JSON.stringify({ loggedIn: true, userType }))
    }

    const logout = () => {
        setAuthData({ loggedIn: false, userType: null })
        localStorage.removeItem("authData");
    }

    return (
        <AuthContext.Provider value={{ authData, login, logout }} >
            { children }
        </AuthContext.Provider>
    )
}

AuthProvider.propTypes = {
  children: PropTypes.any,
}

export const useAuth = () => useContext(AuthContext)
