import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ImageUploader from './components/ImageUploader';
import OptionsPanel from './components/OptionsPanel';
import ResultDisplay from './components/ResultDisplay';
import { generateResumePhoto } from './services/geminiService';
import { PayPalButton } from './services/paypalService'; // Corrected import path
import { Gender } from './types';
import type { StyleOption, BackgroundOption, AspectRatioOption, FramingOption, AngleOption, ExpressionOption } from './types';
import { MALE_SUITS, BACKGROUND_OPTIONS, ASPECT_RATIO_OPTIONS, FRAMING_OPTIONS, ANGLE_OPTIONS, EXPRESSION_OPTIONS, PRICE_KRW, ENABLE_PAYMENT } from './constants';

// FIX: Complete truncated component and add default export.
const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [consent, setConsent] = useState<boolean>(false);

  // Default options state
  const [gender, setGender] = useState<Gender>(Gender.MALE);
  const [selectedSuit, setSelectedSuit] = useState<StyleOption>(MALE_SUITS[0]);
  const [selectedBackground, setSelectedBackground] = useState<BackgroundOption>(BACKGROUND_OPTIONS[0]);
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<AspectRatioOption>(ASPECT_RATIO_OPTIONS[0]);
  const [selectedFraming, setSelectedFraming] = useState<FramingOption>(FRAMING_OPTIONS[0]);
  const [selectedAngle, setSelectedAngle] = useState<AngleOption>(ANGLE_OPTIONS[0]);
  const [selectedExpression, setSelectedExpression] = useState<ExpressionOption>(EXPRESSION_OPTIONS[0]);
  
  const runImageGeneration = async (
      imageFile: File,
      genGender: Gender,
      genSuitPrompt: string,
      genBackgroundPrompt: string,
      genFramingPrompt: string,
      genAnglePrompt: string,
      genExpressionPrompt: string
  ) => {
      setIsLoading(true);
      setError(null);
      setGeneratedImage(null);

      try {
          const result = await generateResumePhoto(
              imageFile,
              genGender,
              genSuitPrompt,
              genBackgroundPrompt,
              genFramingPrompt,
              genAnglePrompt,
              genExpressionPrompt
          );
          setGeneratedImage(result);
      } catch (e) {
          setError((e as Error).message);
      } finally {
          setIsLoading(false);
      }
  };
  
  useEffect(() => {
    setError(null);
  }, [originalImage]);

  const handleImageUpload = (file: File) => {
    setOriginalImage(file);
    setGeneratedImage(null);
    setError(null);
    setConsent(false);
  };
  
  const resetApp = () => {
    setOriginalImage(null);
    setGeneratedImage(null);
    setError(null);
    setConsent(false);
  }

  // This function is for the "free" mode (when ENABLE_PAYMENT is false)
  const handleGenerateRequest = async () => {
    if (!originalImage) {
      setError('먼저 사진을 업로드해주세요.');
      return;
    }
    if (!consent) {
        setError('사진 사용에 동의해야 합니다.');
        return;
    }

    await runImageGeneration(
        originalImage,
        gender,
        selectedSuit.prompt,
        selectedBackground.prompt,
        selectedFraming.prompt,
        selectedAngle.prompt,
        selectedExpression.prompt
    );
  };
  
  // This function is called on successful PayPal payment
  const handlePaymentSuccess = async () => {
    if (!originalImage) {
        setError('결제 후 원본 이미지를 찾을 수 없습니다. 다시 시도해주세요.');
        return;
    }
    await runImageGeneration(
        originalImage,
        gender,
        selectedSuit.prompt,
        selectedBackground.prompt,
        selectedFraming.prompt,
        selectedAngle.prompt,
        selectedExpression.prompt
    );
  };

  return (
    <div className="flex flex-col min-h-screen font-sans">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
          {/* Left Panel */}
          <div className="flex flex-col">
            {!originalImage ? (
              <ImageUploader onImageUpload={handleImageUpload} setErrorMessage={setError} />
            ) : (
              <div className="flex flex-col h-full">
                <OptionsPanel
                  gender={gender} setGender={setGender}
                  selectedSuit={selectedSuit} setSelectedSuit={setSelectedSuit}
                  selectedBackground={selectedBackground} setSelectedBackground={setSelectedBackground}
                  selectedAspectRatio={selectedAspectRatio} setSelectedAspectRatio={setSelectedAspectRatio}
                  selectedFraming={selectedFraming} setSelectedFraming={setSelectedFraming}
                  selectedAngle={selectedAngle} setSelectedAngle={setSelectedAngle}
                  selectedExpression={selectedExpression} setSelectedExpression={setSelectedExpression}
                  resetApp={resetApp}
                />
                <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
                  <div className="flex items-start">
                    <input 
                      id="consent-checkbox"
                      type="checkbox" 
                      checked={consent} 
                      onChange={(e) => setConsent(e.target.checked)} 
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                    />
                    <label htmlFor="consent-checkbox" className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                      업로드한 사진이 본인 소유이며, 서비스 이용 약관에 따라 이미지 생성에 활용하는 것에 동의합니다.
                    </label>
                  </div>
                  
                  <div className="mt-4 w-full">
                    {ENABLE_PAYMENT ? (
                        isLoading ? (
                            <div className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center text-lg">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                처리 중...
                            </div>
                        ) : (
                           <PayPalButton
                              amount={String(PRICE_KRW)}
                              onSuccess={handlePaymentSuccess}
                              onError={setError}
                              disabled={!consent || isLoading}
                            />
                        )
                    ) : (
                      <button 
                        onClick={handleGenerateRequest} 
                        disabled={!consent || isLoading}
                        className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-lg"
                      >
                         {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>사진 생성 중...</span>
                            </>
                        ) : (
                            'AI 증명사진 생성하기'
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
            {error && <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg" role="alert">{error}</div>}
          </div>

          {/* Right Panel */}
          <div className="h-full">
            <ResultDisplay 
              originalImage={originalImage}
              generatedImage={generatedImage}
              isLoading={isLoading}
              aspectRatio={selectedAspectRatio.aspectRatio}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
