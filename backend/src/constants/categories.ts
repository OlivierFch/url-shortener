export const CATEGORY_VALUES = ["marketing", "product", "internal", "support"] as const;

export type CategoryValue = (typeof CATEGORY_VALUES)[number];

export interface CategoryOption {
  value: CategoryValue;
  label: string;
}

export const CATEGORY_LABELS: Record<CategoryValue, string> = {
  marketing: "Marketing",
  product: "Produit",
  internal: "Interne",
  support: "Support"
};

export const CATEGORY_OPTIONS: CategoryOption[] = CATEGORY_VALUES.map((value) => ({
  value,
  label: CATEGORY_LABELS[value]
}));

export const isCategoryValue = (value?: string | null): value is CategoryValue => {
  return typeof value === "string" && (CATEGORY_VALUES as readonly string[]).includes(value);
};
