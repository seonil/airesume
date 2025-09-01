
import React from 'react';
import Spinner from './Spinner';

interface ResultDisplayProps {
  originalImage: File | null;
  generatedImage: string | null;
  isLoading: boolean;
  aspectRatio: number;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ originalImage, generatedImage, isLoading, aspectRatio }) => {
  const originalImageUrl = originalImage ? URL.createObjectURL(originalImage) : null;

  const downloadImage = (dataUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getFilename = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `resume_photo_${year}${month}${day}_${hours}${minutes}${seconds}.png`;
  };

  return (
    <div className="w-full h-full p-4 flex flex-col items-center justify-center bg-gray-200 dark:bg-gray-800 rounded-lg shadow-inner">
      <div className="relative w-full max-w-md" style={{ aspectRatio: `${aspectRatio}` }}>
        {isLoading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black bg-opacity-60 rounded-md">
            <Spinner />
            <p className="mt-4 text-white text-lg font-semibold">사진 생성 중...</p>
            <p className="text-white text-sm">잠시만 기다려주세요.</p>
          </div>
        )}

        {!originalImage && !generatedImage && (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
             <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="mt-4">사진을 업로드하여 시작하세요.</p>
          </div>
        )}
        
        {(generatedImage || originalImageUrl) && (
            <img 
                src={generatedImage || originalImageUrl || ''} 
                alt={generatedImage ? "Generated" : "Original"} 
                className="object-contain w-full h-full rounded-md shadow-lg" 
            />
        )}
      </div>

      {generatedImage && !isLoading && (
        <div className="mt-6 flex flex-col items-center">
            <p className="text-lg font-semibold mb-3">AI 이력서 사진이 완성되었습니다!</p>
            <button 
              onClick={() => downloadImage(generatedImage, getFilename())} 
              className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 transition-colors flex items-center shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              다운로드 (PNG)
            </button>
        </div>
      )}
    </div>
  );
};

export default ResultDisplay;
