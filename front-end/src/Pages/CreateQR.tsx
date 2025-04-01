import React, { useState, useRef } from "react";
import QRCode from "qrcode";
import axios from "../Helpers/api";

const CreateQR: React.FC = () => {
  const [destination, setDestination] = useState<string>("");
  const [exactPlaceName, setExactPlaceName] = useState<string>(""); 
  const [description, setDescription] = useState<string>("");
  const [qrImage, setQrImage] = useState<string | null>(null);
  const qrRef = useRef<HTMLImageElement | null>(null);

  // Function to generate a Google Maps link
  const generateGoogleMapsURL = (destination: string) => {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
  };

  // Function to generate QR Code
  const handleGenerateQR = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination || !description || !exactPlaceName) {
      alert("Please enter all fields.");
      return;
    }

    const googleMapsURL = generateGoogleMapsURL(destination);

    try {
      const qrImageDataUrl = await QRCode.toDataURL(googleMapsURL);
      setQrImage(qrImageDataUrl);
    } catch (error) {
      console.error("Error generating QR Code:", error);
    }
  };

  // Function to save QR Code data to database
  const handleSaveQR = async () => {
    if (!qrImage) {
      alert("Generate QR Code first.");
      return;
    }

    try {
      const response = await fetch(qrImage);
      const blob = await response.blob();
      const file = new File([blob], "qr_code.png", { type: "image/png" });

      // ✅ Prepare FormData for Upload
      const formData = new FormData();
      formData.append("destination", destination);
      formData.append("exactPlaceName", exactPlaceName);
      formData.append("description", description);
      formData.append("qrImage", file);

      // ✅ Send Data to Backend
      const res = await axios.post("save-qr", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 201) {
        alert("QR Code saved successfully!");
        setDestination("");
        setExactPlaceName(""); // ✅ Reset field
        setDescription("");
        setQrImage(null);
      }
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        alert(error.response.data.message);
      } else {
        alert("Network error or Server Error");
      }
      console.error("Error saving QR Code:", error);
    }
  };

  // Function to download QR Code as an image
  const downloadQR = () => {
    if (!qrImage || !qrRef.current) {
      alert("Generate QR Code first.");
      return;
    }
  
    const img = new Image();
    img.src = qrImage;
    img.onload = () => {
      // ✅ Create Canvas
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
  
      if (!ctx) {
        console.error("Canvas rendering not supported");
        return;
      }
  
      // ✅ Set Canvas Size (QR Code + Extra Space for Text)
      const qrSize = 300; // QR code size
      const textHeight = 100; // Increased space for text
      canvas.width = qrSize;
      canvas.height = qrSize + textHeight; // Total height
  
      // ✅ Draw QR Code on Canvas
      ctx.drawImage(img, 0, 0, qrSize, qrSize);
  
      // ✅ Add Black Background for Text Area
      ctx.fillStyle = "white";
      ctx.fillRect(0, qrSize, qrSize, textHeight);
  
      // ✅ Set Text Styles
      ctx.fillStyle = "black";
      ctx.textAlign = "center";
  
      // ✅ Draw Exact Place Name (Bold)
      ctx.font = "bold 18px Arial";
      ctx.fillText(exactPlaceName, qrSize / 2, qrSize + 25);
  
      // ✅ Wrap and Draw Description (Auto-Wrap Text)
      ctx.font = "16px Arial";
      const words = description.split(" ");
      let line = "";
      let y = qrSize + 50; // Start Y position for description
      const maxWidth = qrSize - 20; // Max text width
  
      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + " ";
        const testWidth = ctx.measureText(testLine).width;
  
        if (testWidth > maxWidth) {
          ctx.fillText(line, qrSize / 2, y);
          line = words[i] + " ";
          y += 20; // Move text down for next line
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, qrSize / 2, y); // Draw last line
  
      // ✅ Convert Canvas to Image & Download
      const finalImage = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = finalImage;
      const timestamp = new Date().toISOString().replace(/[-:.]/g, "_");
      link.download = `QR_${exactPlaceName.replace(/\s+/g, "_")}_${timestamp}.png`;
  
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  
      // ✅ Clean up memory
      window.URL.revokeObjectURL(img.src);
    };
  };
  

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      
      <form onSubmit={handleGenerateQR} className="space-y-4">
        {/* Destination Location Input */}
        <div>
          <label className="block text-gray-700">Exact Address(Latitude, Longitude):</label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Enter destination (latitude, longitude, or address)"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* ✅ Exact Place Name Input */}
        <div>
          <label className="block text-gray-700">Exact Place Name:</label>
          <input
            type="text"
            value={exactPlaceName}
            onChange={(e) => setExactPlaceName(e.target.value)}
            placeholder="Enter exact place name"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Description Input */}
        <div>
          <label className="block text-gray-700">Description:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Generate QR Button */}
        <button
          type="submit"
          className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200"
        >
          Generate QR Code
        </button>
      </form>

      {/* Display QR Code and Save Options */}
      {qrImage && (
        <div className="mt-6 flex flex-col items-center">
          <h3 className="text-lg font-semibold text-gray-700">
            Scan QR Code to Navigate:
          </h3>
          <img
            ref={qrRef}
            src={qrImage}
            alt="QR Code"
            className="mt-2 w-40 h-40"
          />

          {/* Save QR Code Button */}
          <button
            onClick={handleSaveQR}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Save QR Code
          </button>

          {/* Download QR Code Button */}
          <button
            onClick={downloadQR}
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Download QR Code
          </button>

          <a
            href={generateGoogleMapsURL(destination)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 text-blue-500 underline"
          >
            Open in Google Maps
          </a>
        </div>
      )}
    </div>
  );
};

export default CreateQR;
