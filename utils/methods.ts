import { jwtDecode } from "jwt-decode";

export const isTokenExpired = (token: string | undefined) => {
    if (!token) return true;

    try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp) return decodedToken.exp < currentTime;
        throw new Error();
    } catch (error) {
        console.error("Error decoding token:", error);
        return true;
    }
};
