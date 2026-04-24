import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

function QrScanner({ onScan, onError }) {
  const scannerRef = useRef(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const config = {
      fps: 10,
      qrbox: { width: 260, height: 260 },
      aspectRatio: 1,
      rememberLastUsedCamera: true,
    };

    scannerRef.current = new Html5QrcodeScanner(
      'qr-reader',
      config,
      false
    );

    scannerRef.current.render(
      async (decodedText) => {
        // ✅ Prevent multiple scans
        if (scanned) return;

        setScanned(true);

        // ✅ Stop scanner after success
        try {
          await scannerRef.current.clear();
        } catch {}

        if (onScan) onScan(decodedText);
      },
      (errorMessage) => {
        // ignore continuous errors (camera noise)
      }
    );

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {});
        scannerRef.current = null;
      }
    };
  }, [onScan, scanned]);

  return (
    <div className="flex flex-col items-center justify-center gap-4">

      {/* Scanner Box */}
      <div className="
        w-full max-w-sm
        rounded-2xl
        border border-white/10
        bg-white/5
        backdrop-blur-xl
        p-3
        shadow-lg
      ">
        <div id="qr-reader" className="rounded-lg overflow-hidden" />
      </div>

      {/* Status */}
      {!scanned ? (
        <p className="text-xs text-slate-400">
          Align QR code inside the box
        </p>
      ) : (
        <p className="text-xs text-emerald-400">
          QR Scanned Successfully
        </p>
      )}

      {/* Reset Button */}
      {scanned && (
        <button
          onClick={() => window.location.reload()}
          className="
            px-4 py-2 rounded-lg
            bg-indigo-500/20 text-indigo-300
            hover:bg-indigo-500/30 text-sm
          "
        >
          Scan Again
        </button>
      )}

    </div>
  );
}

export default QrScanner;