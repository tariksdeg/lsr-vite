import React, { useState, useEffect, useRef } from "react";

function WebSocketComponent() {
  const [url, setUrl] = useState("http://10.0.30.5:3000/login");
  const ws = useRef(null);
  const iframeRef = useRef(null);
  const [actions, setActions] = useState([]);
  console.log(`actions ==>`, actions);
  useEffect(() => {
    window.addEventListener("message", (event) => {
      let jsonDataStr = JSON.stringify(event.data, null, 2);
      let jsonData = JSON.parse(jsonDataStr);
      if (jsonData?.eventType && jsonData.eventType === "interaction") {
        // console.log("JSON Data:", jsonData.data);
        setActions((prew) => [...prew, jsonData.data]);
      }
    });
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

  const handleEnd = () => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow.postMessage(
        { cmd: "end" },
        new URL(url).origin
      );
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="URL girin"
        />
        <button
          onClick={() => {
            iframeRef.current.src = url;
            setActions((prew) => [...prew, { action: "navigate", to: url }]);
          }}
        >
          URL'yi Aç
        </button>
        <button onClick={handleCapture}>Kayıtları Yakala</button>
        <button onClick={() => setActions([])}>Kayıtları Sil</button>
        <button onClick={handleEnd}>Kaydı Sonlandır</button>
        <iframe
          ref={iframeRef}
          title="Interaction Frame"
          width="800"
          height="600"
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {actions.map((action, index) => {
          return (
            <div key={index}>
              {action.action === "navigate" && (
                <div style={{ display: "flex", fontWeight: 600, gap: 10 }}>
                  <span>action:{action.action || "-"}</span>
                  <span>to:{action.to || "-"}</span>
                </div>
              )}
              {(action.action === "click" || action.action === "input") && (
                <div style={{ display: "flex", fontWeight: 600, gap: 10 }}>
                  <span>action:{action.action || "-"}</span>
                  <span>element:{action.element || "-"}</span>
                  <span>name:{action.name || "-"}</span>
                  <span>type:{action.type || "-"}</span>
                  <span>id:{action.id || "-"}</span>
                  <span>class:{action.className || "-"}</span>
                  {action.action === "input" && (
                    <span>value:{action.value}</span>
                  )}
                </div>
              )}
              {(action.action === "session" ||
                action.action === "localStorage") && (
                <div style={{ display: "flex", fontWeight: 600, gap: 10 }}>
                  <span>action:{action.action || "-"}</span>
                  <span>data:{action.data || "-"}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default WebSocketComponent;
