"use client";
import { createContext, useContext, useState } from "react";

const AppContext = createContext({
    sessionToken: "",
    setSessionToken: (sessionToken: string) => {},
});
export const useAppContext = () => {
    const context = useContext(AppContext);
    return context;
};
export default function AppProvider({
    children,
    initialSessionToken = "",
}: {
    children: React.ReactNode;
    initialSessionToken?: string;
}) {
    const [sessionToken, setSessionToken] = useState(initialSessionToken);

    return (
        <AppContext.Provider
            value={{
                sessionToken,
                setSessionToken,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}
