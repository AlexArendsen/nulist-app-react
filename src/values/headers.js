import { Storage } from "./storage";

export const MakeDefaultHeaders = () => ({
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem(Storage.UserTokenKey)}`
    })