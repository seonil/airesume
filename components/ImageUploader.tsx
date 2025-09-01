
import React, { useCallback } from 'react';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  setErrorMessage: (message: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, setErrorMessage }) => {
  const handleFileChange = (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      if (!['image/jpeg', 'image/png', 'image/heic', 'image/webp'].includes(file.type)) {
        setErrorMessage('지원하지 않는 파일 형식입니다. (JPG, PNG, HEIC, WEBP)');
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrorMessage('파일 크기는 5MB를 초과할 수 없습니다.');
        return;
      }
      setErrorMessage('');
      onImageUpload(file);
    }
  };

  const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    handleFileChange(event.dataTransfer.files);
  }, []);

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
        <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-10 h-10 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">클릭 또는 드래그</span>하여 업로드</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">JPG, PNG, HEIC (최대 5MB)</p>
            </div>
            <input id="file-upload" type="file" className="hidden" accept="image/jpeg,image/png,image/heic,image/webp" onChange={(e) => handleFileChange(e.target.files)} />
        </label>
         <div className="mt-6 text-left text-sm text-gray-600 dark:text-gray-300 w-full">
            <h3 className="font-semibold text-base mb-2">사진 권장 가이드:</h3>
            <ul className="list-disc list-inside space-y-1">
                <li>정면을 응시하는 선명한 사진을 사용해주세요.</li>
                <li>안경에 빛 반사가 없는 사진이 좋습니다.</li>
                <li>이마와 헤어 라인이 잘 보여야 합니다.</li>
            </ul>
        </div>
    </div>
  );
};

export default ImageUploader;
