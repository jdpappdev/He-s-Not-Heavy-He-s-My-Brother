/**
 * Design Tokens for "He's Not Heavy, He's My Brother"
 * All color and style constants are centralized here.
 */

export const COLORS = {
  gesso: '#C4C3B6',
  folioBone: '#E7E5E4',
  lampBlack: '#000000',
  rawUmber: '#595855',
  verdaccio: '#66654E',
} as const;

export type ColorToken = keyof typeof COLORS;
