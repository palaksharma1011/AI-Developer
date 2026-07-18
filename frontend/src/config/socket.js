import socket from "socket.io-client";

let socketInstance = null;

export const initializeSocket = (id) => {
  
  if (socketInstance) return socketInstance;

    socketInstance = socket(import.meta.env.VITE_BASE_URL, {
    withCredentials: true,
    query: {
      id,
    },
  });
  return socketInstance;
};

export const receiveMessage = (eventName, cb) => {
  socketInstance.on(eventName, cb);

  return () => socketInstance.off(eventName, cb);
};

export const sendMessage = (eventName, data) => {
  socketInstance.emit(eventName, data);
};
