export type Color = {
  "100": string;
  "10%": string;
};

export const colors: Record<string, Color> = {
  swamp: {
    "100": "rgba(143, 143, 112, 1)",
    "10%": "rgba(143, 143, 112, 0.06)"
  },
  green: {
    "100": "rgba(125, 136, 97, 1)",
    "10%": "rgba(125, 136, 97, 0.06)"
  },
  purple: {
    "100": "rgba(118, 120, 158, 1)",
    "10%": "rgba(118, 120, 158, 0.06)"
  },
  orange: {
    "100": "rgba(178, 134, 52, 1)",
    "10%": "rgba(178, 134, 52, 0.06)"
  }
};
