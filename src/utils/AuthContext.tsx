import React, { createContext, useState, useEffect, useContext } from "react";
import { account } from "../appwriteConfig";
import { useNavigate } from "react-router-dom";
import {ID, Models} from 'appwrite';

//* This is from appwrite/src/models
interface User {
    /**
     * User ID.
     */
    $id: string;
    /**
     * User creation date in ISO 8601 format.
     */
    $createdAt: string;
    /**
     * User update date in ISO 8601 format.
     */
    $updatedAt: string;
    /**
     * User name.
     */
    name: string;
    /**
     * Hashed user password.
     */
    password?: string;
    /**
     * Password hashing algorithm.
     */
    hash?: string;
    /**
     * Password hashing algorithm configuration.
     */
    hashOptions?: object;
    /**
     * User registration date in ISO 8601 format.
     */
    registration: string;
    /**
     * User status. Pass `true` for enabled and `false` for disabled.
     */
    status: boolean;
    /**
     * Password update time in ISO 8601 format.
     */
    passwordUpdate: string;
    /**
     * User email address.
     */
    email: string;
    /**
     * User phone number in E.164 format.
     */
    phone: string;
    /**
     * Email verification status.
     */
    emailVerification: boolean;
    /**
     * Phone verification status.
     */
    phoneVerification: boolean;
    /**
     * User preferences as a key-value object
     */
    prefs: Models.Preferences;
}


interface AuthContextType {
    user: User | null;
    loginUser: (userInfo: { email: string; password: string }) => Promise<void>;
    logoutUser: () => Promise<void>;
    registerUser: (userInfo: { email: string; password1: string; name: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState<boolean>(true);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        checkUserStatus();
    }, []);

    const loginUser = async (userInfo: { email: string; password: string }): Promise<void> => {
        setLoading(true);

        try {
            let response = await account.createEmailSession(userInfo.email, userInfo.password);
            let accountDetails = await account.get();
            setUser(accountDetails);
        } catch (error) {
            console.error(error);
        }

        setLoading(false);
    };

    const logoutUser = async (): Promise<void> => {
        await account.deleteSession('current');
        setUser(null);
    };

    const registerUser = async (userInfo: { email: string; password1: string; name: string }): Promise<void> => {
        setLoading(true);

        try {
            let response = await account.create(ID.unique(), userInfo.email, userInfo.password1, userInfo.name);

            await account.createEmailSession(userInfo.email, userInfo.password1);
            let accountDetails = await account.get();
            setUser(accountDetails);
            navigate('/');
        } catch (error) {
            console.error(error);
        }

        setLoading(false);
    };

    const checkUserStatus = async (): Promise<void> => {
        try {
            let accountDetails = await account.get();
            setUser(accountDetails);
        } catch (error) {
            // Handle error
        }
        setLoading(false);
    };

    const contextData: AuthContextType = {
        user,
        loginUser,
        logoutUser,
        registerUser
    };

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? <p>Loading...</p> : children}
        </AuthContext.Provider>
    );
};

// Custom Hook
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export default AuthContext;
