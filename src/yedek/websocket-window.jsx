import React, { useState, useEffect, useRef } from "react";

const InteractionRecorder = () => {
  const [isWindowOpen, setIsWindowOpen] = useState(false);
  const [actions, setActions] = useState([]);
  const windowRef = useRef(null);
  const wsRef = useRef(null);

  useEffect(() => {
    wsRef.current = new WebSocket("ws://localhost:8080");

    wsRef.current.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log("WebSocket Message:", message);

        if (message.cmd === "updateActions") {
          console.log("Received actions:", message.payload.actions);
          setActions((prevActions) => [
            ...prevActions,
            ...message.payload.actions,
          ]);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    wsRef.current.onopen = () => {
      console.log("WebSocket connected");
    };

    wsRef.current.onclose = () => {
      console.log("WebSocket closed");
    };

    wsRef.current.onerror = (error) => {
      console.error("WebSocket error", error);
    };

    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  const openWindowWithUrl = (url) => {
    const width = 800;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    const features = `width=${width},height=${height},left=${left},top=${top}`;

    windowRef.current = window.open(url, "InteractionWindow", features);
    setIsWindowOpen(true);

    windowRef.current.onload = () => {
      const scriptContent = `
        const ws = new WebSocket('ws://localhost:8080');

        ws.onopen = () => {
          console.log('WebSocket connected');
        };

        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
        };

        function setupEventListeners() {
          document.addEventListener("input", (event) => {
            const action = {
              type: "input_change",
              timestamp: new Date().toISOString(),
              target: {
                tag: event.target.tagName,
                name: event.target.name || "unknown",
              },
              value: event.target.value,
            };
            ws.send(JSON.stringify({ cmd: 'updateActions', payload: { actions: [action] } }));
          }, true);

          document.addEventListener("click", (event) => {
            const action = {
              type: "button_click",
              timestamp: new Date().toISOString(),
              target: {
                tag: event.target.tagName,
                id: event.target.id || "unknown",
              },
            };
            ws.send(JSON.stringify({ cmd: 'updateActions', payload: { actions: [action] } }));
          }, true);
        }

        window.addEventListener("message", (event) => {
          if (event.data && event.data.type === "setupListener") {
            setupEventListeners();
          }
        });

        // Inform the parent window that the script is ready
        window.opener.postMessage({ type: "setupListener" }, "*");
      `;

      const scriptElement = windowRef.current.document.createElement("script");
      scriptElement.textContent = scriptContent;
      windowRef.current.document.body.appendChild(scriptElement);
    };

    windowRef.current.onbeforeunload = () => {
      setIsWindowOpen(false);
      console.log("Captured Actions:", JSON.stringify(actions, null, 2));
      if (wsRef.current) {
        wsRef.current.send(
          JSON.stringify({ cmd: "updateActions", payload: { actions } })
        );
      }
    };
  };

  const closeWindow = () => {
    if (windowRef.current) {
      windowRef.current.close();
      setIsWindowOpen(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => {
          openWindowWithUrl("https://test.platform.pentestbx.com/login");
        }}
      >
        Open URL in New Window
      </button>

      {isWindowOpen && (
        <button onClick={closeWindow} style={{ marginTop: "10px" }}>
          Close Window
        </button>
      )}

      <div>
        <h3>Captured Actions:</h3>
        <pre>{JSON.stringify(actions, null, 2)}</pre>
      </div>
    </div>
  );
};

export default InteractionRecorder;
