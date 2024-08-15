<script>
      function setupEventListeners() {
        document.addEventListener("input", handleInput);
        document.addEventListener("click", handleClick);
      }

      function teardownEventListeners() {
        document.removeEventListener("input", handleInput);
        document.removeEventListener("click", handleClick);
      }

      function handleInput(event) {
        window.parent.postMessage(
          {
            eventType: "interaction",
            data: {
              value: event.target.value,
              action: event.type,
              id: event.target.id,
              name: event.target.name,
              placeholder: event.target.placeholder,
              className: event.target.className,
              innerHTML: event.srcElement.innerHTML,
              element: event.srcElement.localName,
              type: event.target.type,
            },
          },
          "*"
        );
      }

      function handleClick(event) {
        window.parent.postMessage(
          {
            eventType: "interaction",
            data: {
              id: event.target.id,
              action: event.type,
              className: event.target.className,
              name: event.target.name,
              type: event.target.type,
              text: event.target.textContent,
              innerHTML: event.srcElement.innerHTML,
              element: event.srcElement.localName,
            },
          },
          "*"
        );
      }

      window.addEventListener("message", function (event) {
        if (event.origin !== "http://localhost:5173") return;

        if (event.data.cmd === "capture") {
          setupEventListeners();
        } else if (event.data.cmd === "stop") {
          teardownEventListeners();
        }
      });
    </script>