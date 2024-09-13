import React from 'react';
import UploadImage from './assets/UploadImage';
import ImageManipulation from './assets/ImageManipulation';
import DownloadImage from './assets/DownloadImage';
import { ImageProvider } from './context/ImageContext';

const App: React.FC = () => {
  return (
    <ImageProvider>
      <div className="app">
        <h1>Image Processing App</h1>
        <UploadImage />
        <ImageManipulation />
        <DownloadImage />
      </div>
    </ImageProvider>
  );
};

export default App;
