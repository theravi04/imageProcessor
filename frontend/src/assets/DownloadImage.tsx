import React from "react";
import axios from "axios";
import { useImageContext } from "../context/ImageContext";

const DownloadImage: React.FC = () => {
  const { download } = useImageContext(); // Assuming you also have `format` in context

  const handleDownload = async (format: string) => {
    if (!download) {
      console.error("No preview available.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/download",
        {
          image: download,
          format,
        },
        {
          headers: { "Content-Type": "application/json" },
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data as ArrayBuffer], { type: `image/${format}` });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `processed-image.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url); // Clean up the URL object
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  return (
    <>
      {download && (
        <>
          <div>This is the processed image</div>
          <img className="w-44" src={download} alt="Processed Preview" />
        </>
      )}
      <div className="download-section">
        <button
          onClick={() => handleDownload("jpeg")}
          className="p-2 bg-blue-500 text-white rounded"
        >
          Download as JPEG
        </button>
        <button
          onClick={() => handleDownload("png")}
          className="p-2 bg-blue-500 text-white rounded ml-2"
        >
          Download as PNG
        </button>
      </div>
    </>
  );
};

export default DownloadImage;
