import React from 'react';
import type { StyleOption, BackgroundOption, AspectRatioOption, FramingOption, AngleOption, ExpressionOption, RetouchingOption, SpecialRequestOption } from './types';

export const APP_TITLE = 'AI 증명사진 만들기';
export const PRICE_KRW = 500;
export const ENABLE_PAYMENT = false; // Set to true to enable Stripe checkout

export const MALE_SUITS: StyleOption[] = [
  { id: 'navy-tie', label: '네이비 수트 / 타이', prompt: 'a navy blue two-button suit jacket, white shirt, and a classic navy blue tie' },
  { id: 'charcoal-tie', label: '차콜 수트 / 타이', prompt: 'a charcoal grey two-button suit jacket, white shirt, and a dark grey tie' },
  { id: 'black-tie', label: '블랙 수트 / 타이', prompt: 'a classic black two-button suit jacket, white shirt, and a simple black tie' },
  { id: 'navy-no-tie', label: '네이비 수트 / 노타이', prompt: 'a navy blue two-button suit jacket and a crisp white shirt, top button open' },
];

export const FEMALE_SUITS: StyleOption[] = [
  { id: 'charcoal-jacket', label: '차콜 자켓', prompt: 'a charcoal grey tailored jacket with a white crew-neck blouse' },
  { id: 'navy-jacket', label: '네이비 자켓', prompt: 'a navy blue tailored jacket with a cream-colored round-neck blouse' },
  { id: 'black-jacket', label: '블랙 자켓', prompt: 'a classic black tailored jacket with a simple white blouse' },
];

export const BACKGROUND_OPTIONS: BackgroundOption[] = [
  { id: 'light-gray', label: '라이트 그레이', prompt: 'a solid, professional light gray studio background', colorClass: 'bg-gray-200' },
  { id: 'white', label: '화이트', prompt: 'a clean, solid white studio background', colorClass: 'bg-white' },
  { id: 'light-blue', label: '라이트 블루', prompt: 'a soft, solid light blue studio background', colorClass: 'bg-blue-100' },
  { id: 'corp-blue', label: '기업 블루', prompt: 'a professional, corporate blue studio background', colorClass: 'bg-blue-600' },
  { id: 'dark-gray', label: '다크 그레이', prompt: 'a professional, solid dark charcoal gray studio background', colorClass: 'bg-gray-700' },
  { id: 'dark-navy', label: '다크 네이비', prompt: 'a deep, solid dark navy blue studio background', colorClass: 'bg-indigo-900' },
];

export const FRAMING_OPTIONS: FramingOption[] = [
  { id: 'headshot', label: '얼굴/어깨', prompt: 'Crop to a balanced head-and-shoulders portrait (upper chest and up).' },
  { id: 'waist-up', label: '상반신', prompt: 'Frame the shot from the waist up.' },
  { id: 'full-body', label: '전신', prompt: 'Show the full body from head to toe. The suit should include matching trousers or a skirt.' },
];

export const ANGLE_OPTIONS: AngleOption[] = [
  { id: 'original', label: '원본 각도 유지', prompt: 'Maintain the original angle and pose of the person in the photo.' },
  { id: 'frontal', label: '정면', prompt: 'Adjust the angle so the photo appears as a typical business profile (frontal head-on view).' },
  { id: 'three-quarter', label: '사선', prompt: 'Adjust the angle to a classic three-quarter view, with the shoulders slightly turned away from the camera.' },
];

export const EXPRESSION_OPTIONS: ExpressionOption[] = [
  { id: 'neutral', label: '원본 표정 유지', prompt: 'Maintain the original facial expression.' },
  { id: 'slight-smile', label: '은은한 미소', prompt: 'Subtly and realistically adjust the facial expression to a gentle, slight, closed-mouth smile suitable for a professional headshot. Ensure the change is minimal, natural-looking, and fits the person\'s face.' },
  { id: 'bright-smile', label: '환한 미소', prompt: 'Subtly and realistically adjust the facial expression to a warm, genuine, open-mouth smile suitable for a professional headshot. Ensure the change is natural-looking, pleasant, and fits the person\'s face.' },
  { id: 'confident', label: '자신감 있는 표정', prompt: 'Subtly and realistically adjust the facial expression to convey confidence. This may include a very slight, closed-mouth smile, a hint of a "smize" (smiling with the eyes), and a generally assured look. The change must be minimal, natural, and professional.' },
];

export const RETOUCHING_OPTIONS: RetouchingOption[] = [
  { id: 'level-0', label: '원본', prompt: 'Strictly preserve all facial features, bone structure, skin texture, and identity. Do not make any alterations to the face!!!!!!' },
  { id: 'level-1', label: '최소', prompt: 'Apply only the most subtle and minimal professional retouching. Slightly even out skin tone. Do not alter facial features.' },
  { id: 'level-2', label: '기본', prompt: 'Apply standard professional headshot retouching. Even out skin tone, soften very minor blemishes, and slightly enhance lighting to look professional, but keep all facial features and structure identical.' },
  { id: 'level-3', label: '보정', prompt: 'In addition to standard retouching, make very subtle, natural-looking enhancements to facial symmetry and features to increase attractiveness slightly, while ensuring the person is still completely recognizable. The changes must be minimal.' },
  { id: 'level-4', label: '강함', prompt: 'Make subtle enhancements to facial features to create a slightly more idealized and charismatic version of the person, while maintaining their core identity and recognizability. The result should look like the person on their absolute best day, professionally photographed and retouched.' },
];

export const SPECIAL_REQUEST_OPTIONS: SpecialRequestOption[] = [
  { id: 'keep-features', label: '얼굴 특징 유지' },
  { id: 'tidy-hair', label: '머리 단정하게 정리' },
  { id: 'remove-beard', label: '수염 제거' },
  { id: 'remove-reflection', label: '안경 반사 제거' },
  { id: 'symmetry', label: '얼굴 대칭 교정' },
  { id: 'whiten-teeth', label: '치아 미백' },
];

export const ASPECT_RATIO_OPTIONS: AspectRatioOption[] = [
    { id: '3:4', label: '이력서(여권) (3:4)', aspectRatio: 3 / 4 },
    { id: '1:1', label: '프로필 (1:1)', aspectRatio: 1 / 1 },
    { id: '4:5', label: 'SNS (4:5)', aspectRatio: 4 / 5 },
];
