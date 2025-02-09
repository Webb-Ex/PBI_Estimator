export const SIZE_MAPPING = {
  small: "SM",
  medium: "MD",
  large: "LG",
  "extra small": "XS",
  "extra large": "XL",
} as const;

export const TSIZE_COLORS = {
  XS: "#34b85c",
  SM: "#5bbdde",
  MD: "#eccc48",
  LG: "#e16d6d",
  XL: "#9a86eb",
} as const;

export const TSIZE_DAYS = {
  XS: 20,
  SM: 60,
  MD: 100,
  LG: 150,
  XL: 220,
} as const;

export const SIZE_DISPLAY_NAMES = {
  XS: "Extra Small",
  SM: "Small",
  MD: "Medium",
  LG: "Large",
  XL: "Extra Large",
} as const;

export const SPRINT_DATA = {
  XS: { sprints: 2, months: 1, range: "0-20" },
  SM: { sprints: 6, months: 3, range: "21-60" },
  MD: { sprints: 10, months: 5, range: "61-100" },
  LG: { sprints: 15, months: 7.5, range: "101-150" },
  XL: { sprints: 22, months: 11, range: "151-220" },
} as const;

export interface PBI {
  id: string;
  name: string;
  description: string;
  product: string;
  t_size: string;
  likes: number;
}