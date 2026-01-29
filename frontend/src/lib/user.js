import {jwtDecode} from 'jwt-decode';
import { parse } from 'cookie';
import api from '@/hooks/axios';

export const getUser = () => {
    const cookies = document.cookie;
    // console.log(cookies)
    let token = cookies.split('token=')[1]
    token = token.split(';')[0] 
    // console.log(token)
    if(!token){
        throw new Error("Not authenticated")
    }
    const jwtToken = token
    if(!jwtToken){
        throw new Error("Not authenticated")
    }
    const decodedToken = jwtDecode(jwtToken)
    if(!decodedToken){
        throw new Error("Not authenticated")
    }
    // console.log(decodedToken)
    const user = decodedToken.user

    return user
}

export const logOut = () => {
  const cookies = document.cookie.split(';');

  for (const cookie of cookies) {
    const eqPos = cookie.indexOf('=');
    const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
    document.cookie = `${name.trim()}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
  }
}

export async function updateUser (data){
    try {
        const res = await api.post("/api/v1/user/update-user", data);
        return res
    } catch (error) {
        throw error
    }
}

export async function changeUserPassword (currentPassword, newPassword) {
    try {
        const res = await api.post("/api/v1/user/change-user-password", {currentPassword: currentPassword, newPassword: newPassword});
        return res;
    } catch (error) {
        throw error;
    }
}

export async function createUser (name, email, password, role) {
    if(!name || !email || !password || !role){
        throw new Error("Name, email, password & role are required field for user creation.")
    } 
    try {
        const res = await api.post("/api/v1/user/create-user",{
            name: name, 
            email: email,
            password: password,
            role: role,
        });
        return res;
    } catch (error) {
        throw error;
    }
}

export async function getAllUsers() {
    try {
        const res = await api.get("/api/v1/user/get-all-users")
        return res;
    } catch (error) {
        throw error;
    }
}

export async function deleteUser(id) {
    try {
       const res = await api.post("/api/v1/user/delete-user", { id: id })
        return res;
    } catch (error) {
        throw error;
    }
}