import React, { useEffect, useState } from "react";

const WebSocketContext = React.createContext();

export const WebSocketProvider = ({ children }) => {
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const socket = new WebSocket("ws://http://localhost:8080"); // Sunucu URL'si
    socket.onopen = () => console.log("WebSocket bağlantısı kuruldu");
    socket.onclose = () => console.log("WebSocket bağlantısı kapandı");
    socket.onerror = (error) => console.error("WebSocket hatası:", error);

    setWs(socket);

    return () => socket.close();
  }, []);

  return (
    <WebSocketContext.Provider value={ws}>{children}</WebSocketContext.Provider>
  );
};
