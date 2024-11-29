import React, { createContext } from "react";
import { io } from "socket.io-client";

// Create a context
const SocketContext = createContext();

// Initialize the socket
const socket = io("http://localhost:3001");

export const SocketProvider = ({ children }) => {
  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;
