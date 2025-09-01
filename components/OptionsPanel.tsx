import React from 'react';
import { Gender } from '../types';
import type { StyleOption, BackgroundOption, AspectRatioOption, FramingOption, AngleOption, ExpressionOption } from '../types';
import { MALE_SUITS, FEMALE_SUITS, BACKGROUND_OPTIONS, ASPECT_RATIO_OPTIONS, FRAMING_OPTIONS, ANGLE_OPTIONS, EXPRESSION_OPTIONS } from '../constants';

interface OptionsPanelProps {
  gender: Gender;
  setGender: (gender: Gender) => void;
  selectedSuit: StyleOption;
  setSelectedSuit: (suit: StyleOption) => void;
  selectedBackground: BackgroundOption;
  setSelectedBackground: (bg: BackgroundOption) => void;
  selectedAspectRatio: AspectRatioOption;
  setSelectedAspectRatio: (crop: AspectRatioOption) => void;
  selectedFraming: FramingOption;
  setSelectedFraming: (framing: FramingOption) => void;
  selectedAngle: AngleOption;
  setSelectedAngle: (angle: AngleOption) => void;
  selectedExpression: ExpressionOption;
  setSelectedExpression: (expression: ExpressionOption) => void;
  resetApp: () => void;
}

const OptionsPanel: React.FC<OptionsPanelProps> = ({
  gender, setGender,
  selectedSuit, setSelectedSuit,
  selectedBackground, setSelectedBackground,
  selectedAspectRatio, setSelectedAspectRatio,
  selectedFraming, setSelectedFraming,
  selectedAngle, setSelectedAngle,
  selectedExpression, setSelectedExpression,
  resetApp
}) => {
  
  const suitOptions = gender === Gender.MALE ? MALE_SUITS : FEMALE_SUITS;

  const handleGenderChange = (newGender: Gender) => {
    setGender(newGender);
    if (newGender === Gender.MALE) {
        setSelectedSuit(MALE_SUITS[0]);
    } else {
        setSelectedSuit(FEMALE_SUITS[0]);
    }
  }

  return (
    <div className="p-6 space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-y-auto h-full">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">옵션 설정</h2>
        <button onClick={resetApp} className="text-sm text-blue-600 hover:underline">다른 사진 선택</button>
      </div>

      {/* Gender Selection */}
      <div className="space-y-2">
        <label className="font-semibold text-gray-700 dark:text-gray-200">1. 성별</label>
        <div className="flex space-x-2">
          {[Gender.MALE, Gender.FEMALE].map(g => (
            <button key={g} onClick={() => handleGenderChange(g)} className={`w-full py-2 px-4 rounded-md transition-colors text-sm font-medium ${gender === g ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>
              {g === Gender.MALE ? '남성' : '여성'}
            </button>
          ))}
        </div>
      </div>

      {/* Suit Selection */}
      <div className="space-y-2">
        <label className="font-semibold text-gray-700 dark:text-gray-200">2. 정장 스타일</label>
        <div className="grid grid-cols-2 gap-2">
          {suitOptions.map(suit => (
            <button key={suit.id} onClick={() => setSelectedSuit(suit)} className={`py-2 px-3 rounded-md transition-colors text-sm text-left ${selectedSuit.id === suit.id ? 'bg-blue-600 text-white ring-2 ring-blue-400' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>
              {suit.label}
            </button>
          ))}
        </div>
      </div>

      {/* Background Selection */}
      <div className="space-y-2">
        <label className="font-semibold text-gray-700 dark:text-gray-200">3. 배경 색상</label>
        <div className="grid grid-cols-6 gap-2">
          {BACKGROUND_OPTIONS.map(bg => (
            <button key={bg.id} onClick={() => setSelectedBackground(bg)} className={`w-full flex items-center justify-center p-2 rounded-md transition-all ${selectedBackground.id === bg.id ? 'ring-2 ring-blue-500' : ''}`}>
              <div className={`w-6 h-6 rounded-full ${bg.colorClass} border border-gray-300`}></div>
            </button>
          ))}
        </div>
        <p className="text-center text-xs text-gray-500">{selectedBackground.label}</p>
      </div>

      {/* Framing Selection */}
      <div className="space-y-2">
        <label className="font-semibold text-gray-700 dark:text-gray-200">4. 사진 구도</label>
        <div className="grid grid-cols-3 gap-2">
          {FRAMING_OPTIONS.map(frame => (
            <button key={frame.id} onClick={() => setSelectedFraming(frame)} className={`py-2 px-3 rounded-md transition-colors text-sm ${selectedFraming.id === frame.id ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>
              {frame.label}
            </button>
          ))}
        </div>
      </div>

      {/* Angle Selection */}
      <div className="space-y-2">
        <label className="font-semibold text-gray-700 dark:text-gray-200">5. 사진 각도</label>
        <div className="grid grid-cols-3 gap-2">
          {ANGLE_OPTIONS.map(angle => (
            <button key={angle.id} onClick={() => setSelectedAngle(angle)} className={`py-2 px-3 rounded-md transition-colors text-sm ${selectedAngle.id === angle.id ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>
              {angle.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Expression Selection */}
      <div className="space-y-2">
        <label className="font-semibold text-gray-700 dark:text-gray-200">6. 표정</label>
        <div className="grid grid-cols-2 gap-2">
          {EXPRESSION_OPTIONS.map(expression => (
            <button key={expression.id} onClick={() => setSelectedExpression(expression)} className={`py-2 px-3 rounded-md transition-colors text-sm ${selectedExpression.id === expression.id ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>
              {expression.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Aspect Ratio Selection */}
      <div className="space-y-2">
        <label className="font-semibold text-gray-700 dark:text-gray-200">7. 사진 규격</label>
        <div className="grid grid-cols-3 gap-2">
          {ASPECT_RATIO_OPTIONS.map(crop => (
            <button key={crop.id} onClick={() => setSelectedAspectRatio(crop)} className={`py-2 px-3 rounded-md transition-colors text-sm ${selectedAspectRatio.id === crop.id ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>
              {crop.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OptionsPanel;