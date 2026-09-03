import { useRef, useEffect, useCallback } from "react";

/**
 * Embeds Kiri:Moto in an iframe and communicates via postMessage.
 * The iframe loads from /slicer/ (proxied to the kirimoto container).
 *
 * Kiri:Moto frame API docs:
 * https://github.com/GridSpace/grid-apps/wiki/Kiri:Moto-Frame-API
 */
export default function SlicerPanel({ fileUrl, onGcodeReady }) {
  const iframeRef = useRef(null);

  const sendMessage = useCallback(
    (action, data = {}) => {
      iframeRef.current?.contentWindow?.postMessage(
        { api: "kiri", action, ...data },
        "*"
      );
    },
    []
  );

  useEffect(() => {
    const handler = (e) => {
      if (e.data?.api !== "kiri") return;

      switch (e.data.action) {
        case "ready":
          // Kiri:Moto is loaded — load file if we have one
          if (fileUrl) {
            sendMessage("load", { url: fileUrl });
          }
          break;
        case "slice.done":
          // Slicing finished — gcode is available
          sendMessage("export");
          break;
        case "export.done":
          // G-code string returned
          if (onGcodeReady) onGcodeReady(e.data.gcode);
          break;
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [fileUrl, sendMessage, onGcodeReady]);

  // When fileUrl changes, send load message
  useEffect(() => {
    if (fileUrl) sendMessage("load", { url: fileUrl });
  }, [fileUrl, sendMessage]);

  return (
    <div className="h-full w-full rounded-xl overflow-hidden border border-navy-700">
      <iframe
        ref={iframeRef}
        src="/slicer/"
        className="h-full w-full border-0"
        title="Kiri:Moto Slicer"
        sandbox="allow-scripts allow-same-origin allow-popups"
      />
    </div>
  );
}
