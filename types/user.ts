import { Branch } from "./branch";
import { Role } from "./role";

export type User = {
    index: number;
    id: number;
    userName: string;
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    createdDate: string;
    status: string;
    roles: Role[];
    branch: Branch;
};
