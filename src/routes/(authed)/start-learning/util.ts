export const levels = ['N5', 'N4', 'N3', 'N2', 'N1'] as const;
export type Level = (typeof levels)[number];
