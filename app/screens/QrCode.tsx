"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import QRCode from "qrcode";
import SolanaLogo from "@/public/img/heysolana.png";
import BackButton from "../components/ui/BackButton";

export default function SolanaQRCode() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const qrData: string = "https://aptos.network/solana-address";
  const qrSize: number = 350;
  const logoSize: number = 75;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Generate QR Code
    QRCode.toCanvas(
      canvas,
      qrData,
      {
        width: qrSize,
        margin: 3,
        errorCorrectionLevel: "H",
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      },
      (error) => {
        if (error) {
          console.error("Error generating QR code:", error);
          return;
        }

        // Load and draw the Solana logo in the center
        const logo = new window.Image();
        logo.src = SolanaLogo.src; // Use .src for Next.js Image compatibility
        logo.onload = () => {
          const x = (qrSize - logoSize) / 2; // Center horizontally
          const y = (qrSize - logoSize) / 2; // Center vertically
          ctx.drawImage(logo, x, y, logoSize, logoSize);
        };
      }
    );
  }, []);

  // Functions for Share and Copy buttons
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Solana Address",
          text: "Use this address to receive tokens on the Aptos network.",
          url: qrData,
        })
        .catch((error) => console.error("Error sharing:", error));
    } else {
      alert("Share functionality is not supported on this device.");
    }
  };

  const handleCopy = () => {
    navigator.clipboard
      .writeText(qrData)
      .then(() => alert("Address copied to clipboard!"))
      .catch((error) => console.error("Error copying:", error));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center">
      {/* Header with Back Button and Title */}
      <div className="flex items-center gap-2 mb-4 w-full max-w-md">
        <BackButton/>
        <h1 className="text-lg  text-black">Solana</h1>
      </div>

      {/* QR Code Container */}
      <div className="bg-white rounded-xl shadow-md p-4 flex flex-col justify-center items-center w-full max-w-md h-full">
        <canvas ref={canvasRef} width={qrSize} height={qrSize} />

        <div className="flex gap-4 mt-4">
          <button
            onClick={handleShare}
            className="bg-[#F1F1F1] py-[15px] w-[180px] rounded-full text-black cursor-pointer"
          >
            Share
          </button>
          <button
            onClick={handleCopy}
            className="bg-[#971BB2] py-[15px] w-[180px] rounded-full cursor-pointer"
          >
            Copy
          </button>
        </div>
      </div>

      {/* Info Text */}
      <div className="mt-4 p-4 bg-[#D6F3F5] rounded-xl border border-[#9DE0E5] w-full max-w-md flex items-start gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-5 h-5 text-blue-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-sm text-gray-700">
          Use this address to receive tokens and collectibles on the Aptos
          network only.
        </p>
      </div>
    </div>
  );
}
