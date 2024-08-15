import React, { useState, useEffect, useRef } from "react";

function WebSocketComponent() {
  const [url, setUrl] = useState("http://10.0.30.5:3000/login");
  const ws = useRef(null);
  const iframeRef = useRef(null);

  useEffect(() => {
    // ws.current = new WebSocket("ws://localhost:8080");

    // ws.current.onopen = () => {
    //   console.log("WebSocket connected");
    // };

    // ws.current.onmessage = (event) => {
    //   const data = JSON.parse(event.data);
    //   console.log("Received:", data);

    //   if (data.cmd === "navigate") {
    //     if (iframeRef.current) {
    //       iframeRef.current.src = data.payload.url;
    //     }
    //   }
    // };

    // ws.current.onclose = () => {
    //   console.log("WebSocket disconnected");
    // };

    // PostMessage yanıtlarını dinleyin
    window.addEventListener("message", (event) => {
      let jsonDataStr = JSON.stringify(event.data, null, 2);
      let jsonData = JSON.parse(jsonDataStr);
      if (jsonData?.eventType && jsonData.eventType === "interaction") {
        console.log("JSON Data:", jsonData.data);
      }
    });

    // return () => {
    //   if (ws.current) {
    //     ws.current.close();
    //   }
    // };
  }, [url]);

  const handleCapture = () => {
    if (iframeRef.current) {
      iframeRef.current.onload = () => {
        console.log("Iframe loaded");
        // iframeRef.current.contentWindow.postMessage({ cmd: "capture" }, "*");
        iframeRef.current.contentWindow.postMessage(
          { cmd: "capture" },
          new URL(url).origin
        );
      };
    }
  };

  return (
    <div>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="URL girin"
      />
      <button onClick={() => (iframeRef.current.src = url)}>URL'yi Aç</button>
      <button onClick={handleCapture}>Kayıtları Yakala</button>
      <iframe
        ref={iframeRef}
        title="Interaction Frame"
        width="800"
        height="600"
      />
    </div>
  );
}

export default WebSocketComponent;
