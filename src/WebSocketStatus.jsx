import React, { useEffect, useState } from "react";
import wsService from "./utils/webSocketService";

const WebSocketStatus = () => {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const handleConnect = () => setConnected(true);
    const handleClose = () => setConnected(false);

    wsService.onMessage((data) => {
      // WebSocket'ten gelen veriyi işleme
    });

    wsService.socket.addEventListener("open", handleConnect);
    wsService.socket.addEventListener("close", handleClose);

    return () => {
      wsService.socket.removeEventListener("open", handleConnect);
      wsService.socket.removeEventListener("close", handleClose);
    };
  }, []);

  return (
    <div>WebSocket Bağlantısı: {connected ? "Bağlı" : "Bağlantı Yok"}</div>
  );
};

export default WebSocketStatus;
