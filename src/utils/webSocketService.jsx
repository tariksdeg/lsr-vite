class WebSocketService {
  constructor(url) {
    this.url = url;
    this.socket = null;
    this.connected = false;
    this.messageHandlers = [];
  }

  connect() {
    this.socket = new WebSocket(this.url);
    this.socket.addEventListener("open", () => {
      this.connected = true;
    });
    this.socket.addEventListener("message", (event) => {
      const data = event.data;
      if (data instanceof Blob) {
        // Blob mesajı işleme
      } else {
        this.messageHandlers.forEach((handler) => handler(data));
      }
    });
    this.socket.addEventListener("error", () => {
      console.error("WebSocket hatası.");
    });
    this.socket.addEventListener("close", () => {
      this.connected = false;
      console.log("WebSocket bağlantısı kapandı.");
    });
  }

  send(message) {
    if (this.connected) {
      this.socket.send(message);
    } else {
      console.error("WebSocket bağlantısı kurulamadı.");
    }
  }

  onMessage(handler) {
    this.messageHandlers.push(handler);
  }
}

const wsService = new WebSocketService("ws://your-websocket-url");
export default wsService;
