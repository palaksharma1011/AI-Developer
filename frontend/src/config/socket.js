import socket from 'socket.io-client';

let socketInstance=null;

export const initializeSocket=()=>{
    socketInstance=socket(import.meta.env.VITE_BASE_URL,{
        withCredentials:true
    });
    return socketInstance;
}