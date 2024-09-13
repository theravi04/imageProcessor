import React, { useState, useEffect } from "react";
import axios from "axios";
import { useImageContext } from "../context/ImageContext";
import debounce from 'lodash/debounce';

const ImageManipulation: React.FC = () => {
  const { image, preview, setPreview, setDownload } = useImageContext();
  const [brightness, setBrightness] = useState<number>(1);
  const [contrast, setContrast] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);

  const processImage = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/process",
        {
          image,
          brightness,
          contrast,
          rotation,
          format: "jpeg",
        },
        {
          headers: { "Content-Type": "application/json" },
          responseType: "blob", // Expect a blob response for image data
        }
      );

      const previewBlob = new Blob([response.data as ArrayBuffer], {
        type: "image/jpeg",
      });
      const previewUrl = URL.createObjectURL(previewBlob);
      setPreview(previewUrl);
      setDownload(previewUrl);
    } catch (error) {
      console.error("Error processing image:", error);
    }
  };

  // Debounce the processImage function to avoid too many API calls
  const debouncedProcessImage = debounce(processImage, 50);

  // Use effects to trigger the API call when brightness, contrast, or rotation changes
  useEffect(() => {
    if (image) {
      debouncedProcessImage();
    }
    return () => {
      debouncedProcessImage.cancel();
    };
  }, [brightness, contrast, rotation]);

  return (
    <div className="manipulation-section">
      <div className="slider-group">
        <label>Brightness</label>
        <input
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={brightness}
          onChange={(e) => setBrightness(parseFloat(e.target.value))}
        />
      </div>

      <div className="slider-group">
        <label>Contrast</label>
        <input
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={contrast}
          onChange={(e) => setContrast(parseFloat(e.target.value))}
        />
      </div>

      <div className="slider-group">
        <label>Rotation</label>
        <input
          type="range"
          min="0"
          max="360"
          value={rotation}
          onChange={(e) => setRotation(parseInt(e.target.value))}
        />
      </div>

      {preview && (
        <>
          <div>Processed Image:</div>
          <img className="w-44" src={preview} alt="Processed Preview" />
        </>
      )}
    </div>
  );
};

export default ImageManipulation;
