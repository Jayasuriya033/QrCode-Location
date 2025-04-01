import React, { useEffect, useState } from "react";
import axios from "../Helpers/api";
import { FaDownload, FaTrash } from "react-icons/fa";

interface QRCodeData {
  id: number;
  destination: string;
  exactPlaceName: string;
  description: string;
  image: string; // Image URL
}

const QrDetails: React.FC = () => {
  const [qrCodes, setQrCodes] = useState<QRCodeData[]>([]);

  //  Fetch QR Codes from Backend
  useEffect(() => {
    const fetchQRCodes = async () => {
      try {
        const response = await axios.get("/get-all");
        setQrCodes(response.data);
      } catch (error) {
        console.error("Error fetching QR Codes:", error);
      }
    };

    fetchQRCodes();
  }, []);

  const generateGoogleMapsURL = (destination: string) => {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
      destination
    )}`;
  };


  const handleDownload = async (imageUrl: string, exactPlaceName: string, description: string) => {
    try {
      const response = await axios.get(`http://localhost:5000${imageUrl}`, {
        responseType: "blob",
      });
  
      const img = new Image();
      img.src = window.URL.createObjectURL(new Blob([response.data]));
      img.onload = () => {
        //  Create Canvas
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
  
        if (!ctx) {
          console.error("Canvas rendering not supported");
          return;
        }
  
        //  Set Canvas Size (QR Code + Extra Space for Text)
        const qrSize = 300; // QR code size
        const textHeight = 100; // Increased space for text
        canvas.width = qrSize;
        canvas.height = qrSize + textHeight;
  
        //  Draw QR Code on Canvas
        ctx.drawImage(img, 0, 0, qrSize, qrSize);
  
        //  Add Black Background for Text Area
        ctx.fillStyle = "white";
        ctx.fillRect(0, qrSize, qrSize, textHeight);
  
        //  Set Text Styles
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
  
        //  Draw Exact Place Name (Bold)
        ctx.font = "bold 18px Arial";
        ctx.fillText(exactPlaceName, qrSize / 2, qrSize + 25);
  
        //  Draw Wrapped Description (Auto Wrap Text)
        ctx.font = "16px Arial";
        const words = description.split(" ");
        let line = "";
        let y = qrSize + 50; // Starting Y position for description
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
  
        //  Convert Canvas to Image & Download
        const finalImage = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = finalImage;
        link.download = `${exactPlaceName}_QR_Code.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
  
        //  Clean up
        window.URL.revokeObjectURL(img.src);
      };
    } catch (error) {
      console.error("Error downloading QR Code:", error);
      alert("Failed to download QR Code.");
    }
  };
  
  
  //  Function to Delete a QR Code
  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this QR code?"))
      return;

    try {
      await axios.delete(`/delete-qr/${id}`);
      setQrCodes(qrCodes.filter((qr) => qr.id !== id)); // Remove from UI
      alert("QR Code deleted successfully!");
    } catch (error) {
      console.error("Error deleting QR Code:", error);
      alert("Failed to delete QR Code.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
        QR Code Details
      </h2> */}

      {qrCodes.length === 0 ? (
        <p className="text-center text-gray-500">No QR Codes available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {qrCodes.map((qr) => (
            <div
              key={qr.id}
              className="p-4 border rounded-lg shadow-lg bg-gray-100"
            >
              <img
                src={`http://localhost:5000/uploads/${qr.image
                  .split("/")
                  .pop()}`}
                alt={`QR Code for ${qr.destination}`}
                className="w-40 h-40 mx-auto"
              />

              <h3 className="text-xl font-bold text-gray-800 text-center mt-2">
                📍 {qr.exactPlaceName}
              </h3>

              <p className="text-md text-gray-600 text-center mt-1 italic">
                📝 {qr.description}
              </p>

              <a
                href={generateGoogleMapsURL(qr.destination)}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-600 font-medium text-center mt-3 hover:text-blue-800 transition duration-200"
              >
                🌍 Open in Google Maps →
              </a>

              {/* Action Buttons */}
              <div className="flex justify-center space-x-4 mt-3">
                <button
                  onClick={() =>
                    handleDownload(qr.image, qr.exactPlaceName, qr.description)
                  }
                  className="flex items-center bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600"
                >
                  <FaDownload className="mr-2" /> Download
                </button>

                <button
                  onClick={() => handleDelete(qr.id)}
                  className="flex items-center bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600"
                >
                  <FaTrash className="mr-2" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QrDetails;
