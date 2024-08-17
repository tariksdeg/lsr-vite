import axios from "axios";
import React, { useState, useEffect, useRef } from "react";

function WebSocketComponent() {
  const [url, setUrl] = useState(
    "https://tarik-degirmenci-website.vercel.app/"
    // "http://10.0.30.5:3000/login"
  );
  const ws = useRef(null);
  const iframeRef = useRef(null);
  const [actions, setActions] = useState([]);
  const [isScript, setIsScript] = useState(true);
  const [iframeDiv, setIframeDiv] = useState(false);

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
      // Kısa bir gecikmeden sonra iframe'i DOM'dan kaldır
      iframeRef.current.src = ""; // Mesajın gönderilmesi için kısa bir gecikme
      setTimeout(() => {
        setIframeDiv(false);
      }, 100);
    }
  };

  const handleOpenURL = () => {
    setIframeDiv(true);
    setTimeout(() => {
      iframeRef.current.src = url;
      setActions((prev) => [...prev, { action: "navigate", to: url }]);

      iframeRef.current.onload = () => {
        console.log("Iframe loaded");
        iframeRef.current.contentWindow.postMessage(
          { cmd: "capture" },
          new URL(url).origin
        );
      };
    }, 1000);
  };

  const scriptControl = async () => {
    axios
      .get(new URL(url).origin)
      .then((response) => {
        const html = response.data;
        if (html.includes("event-listeners-script")) {
          alert("Script found succesfully");
          setIsScript(false);
        } else {
          alert("Script couldn't find.");
        }
      })
      .catch((error) => console.error("Error fetching page:", error));
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
        <button onClick={scriptControl}>Script Kontrol</button>
        <button disabled={isScript} onClick={handleOpenURL}>
          Kaydı Başlat
        </button>
        {/* <button onClick={handleCapture}>Kayıtları Yakala</button> */}
        <button disabled={isScript} onClick={() => setActions([])}>
          Kayıtları Sil
        </button>
        <button disabled={isScript} onClick={handleEnd}>
          Kaydı Sonlandır
        </button>
      </div>
      {iframeDiv && (
        <div>
          <iframe
            ref={iframeRef}
            title="Interaction Frame"
            width="800"
            height="600"
          />
        </div>
      )}
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
