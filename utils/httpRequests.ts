import axios from "axios";

const httpRequest = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_ENDPOINT,
});

export const get = async (path: string, options = {}) => {
    const res = await httpRequest.get(path, options);

    return res.data;
};

export const post = async (path: string, body: object, options = {}) => {
    const res = await httpRequest.post(path, body, options);

    return res.data;
};

export default httpRequest;
