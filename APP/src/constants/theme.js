// JK Connect — Design System / Theme
// Matches the web frontend's brand palette

export const COLORS = {
  // Brand Colors
  brandDark: '#2C1810',
  brandMaroon: '#5D4037',
  brandOrange: '#D35400',
  brandPeach: '#F5B041',
  brandLight: '#FFF5F0',

  // Status Colors
  success: '#27AE60',
  successLight: '#EAFAF1',
  successBorder: '#A9DFBF',
  danger: '#E74C3C',
  dangerLight: '#FDEDEC',
  dangerBorder: '#F5B7B1',
  warning: '#F39C12',
  warningLight: '#FEF9E7',
  warningBorder: '#F9E79F',
  info: '#3498DB',
  infoLight: '#EBF5FB',

  // Neutral Colors
  white: '#FFFFFF',
  black: '#000000',
  gray50: '#FAFAFA',
  gray100: '#F5F5F5',
  gray200: '#EEEEEE',
  gray300: '#E0E0E0',
  gray400: '#BDBDBD',
  gray500: '#9E9E9E',
  gray600: '#757575',
  gray700: '#616161',
  gray800: '#424242',
  gray900: '#212121',

  // Utility
  overlay: 'rgba(0, 0, 0, 0.5)',
  transparent: 'transparent',
  inputBg: 'rgba(255, 245, 240, 0.3)',
  inputBorder: 'rgba(245, 176, 65, 0.4)',
  cardBorder: 'rgba(245, 176, 65, 0.3)',
};

export const FONTS = {
  regular: { fontWeight: '400' },
  medium: { fontWeight: '500' },
  semibold: { fontWeight: '600' },
  bold: { fontWeight: '700' },
  extraBold: { fontWeight: '800' },
};

export const SIZES = {
  // Spacing
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,

  // Font Sizes
  fontXs: 10,
  fontSm: 12,
  fontMd: 14,
  fontBase: 16,
  fontLg: 18,
  fontXl: 20,
  fontXxl: 24,
  fontXxxl: 30,
  fontDisplay: 36,

  // Border Radius
  radiusSm: 6,
  radius: 8,
  radiusMd: 12,
  radiusLg: 16,
  radiusXl: 20,
  radiusFull: 999,

  // Specific
  buttonHeight: 48,
  inputHeight: 48,
  tabBarHeight: 60,
  headerHeight: 56,
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
};
