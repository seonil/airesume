
export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
}

export interface StyleOption {
  id: string;
  label: string;
  prompt: string;
  icon?: JSX.Element;
}

export interface BackgroundOption {
  id: string;
  label: string;
  prompt: string;
  colorClass: string;
}

export interface AspectRatioOption {
  id: string;
  label: string;
  aspectRatio: number;
}

export interface FramingOption {
  id: string;
  label: string;
  prompt: string;
}

export interface AngleOption {
  id: string;
  label: string;
  prompt: string;
}

export interface ExpressionOption {
  id: string;
  label: string;
  prompt: string;
}

export interface RetouchingOption {
  id: string;
  label: string;
  prompt: string;
}

export interface SpecialRequestOption {
  id: string;
  label: string;
}
