import { Branch } from "./branch";
import { Role } from "./role";

export type User = {
    index: number;
    id: string;
    userName: string;
    email: string;
    password: string;
    phone: string;
    firstName: string;
    lastName: string;
    // createdTime:
    status: string;
    branch: Branch;
    role: Array<Role>;
};
