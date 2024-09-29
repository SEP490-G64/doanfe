import { JwtPayload } from "jwt-decode";

export interface TokenDecoded extends JwtPayload {
    information?: {
        id: number;
        userName: string;
        email: string;
        phone: string;
        roles: {
            id: string;
            name: string;
            type: string;
        }[];
    };
}
