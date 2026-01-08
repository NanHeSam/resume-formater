export type LayoutType = 'traditional' | 'modern' | 'minimal';
export type SpacingType = 'compact' | 'normal' | 'relaxed';
export type FontFamily = 'sans-serif' | 'serif' | 'monospace';
export type AlignmentType = 'left' | 'center' | 'right';

export interface ColorConfig {
  primary: string;
  secondary: string;
  text: string;
  background: string;
}

export interface FontConfig {
  heading: FontFamily;
  body: FontFamily;
}

export interface StylingConfig {
  colors: ColorConfig;
  fonts: FontConfig;
  layout: LayoutType;
  spacing: SpacingType;
  headerAlignment: AlignmentType;
  summaryAlignment?: AlignmentType;
}

export const DEFAULT_STYLING: StylingConfig = {
  colors: {
    primary: '#55aba3',
    secondary: '#64748b',
    text: '#1e293b',
    background: '#ffffff',
  },
  fonts: {
    heading: 'sans-serif',
    body: 'sans-serif',
  },
  layout: 'traditional',
  spacing: 'normal',
  headerAlignment: 'left',
};
