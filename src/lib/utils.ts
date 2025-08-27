import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const currencyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
});

const percentageFormatter = new Intl.NumberFormat("id-ID", {
  style: "percent",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
  signDisplay: "exceptZero",
});

const dateFormatterCache = new Map<string, Intl.DateTimeFormat>();

const getDateFormatter = (locale = "id-ID") => {
  if (!dateFormatterCache.has(locale)) {
    dateFormatterCache.set(
      locale,
      new Intl.DateTimeFormat(locale, { dateStyle: "medium" }),
    );
  }
  return dateFormatterCache.get(locale)!;
};

export const formatCurrency = (value: number): string => {
  return currencyFormatter.format(value);
};

export const formatPercentage = (value: number): string => {
  return percentageFormatter.format(value);
};

export const formatDate = (date: string | Date, locale?: string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) return "Invalid date";

  return getDateFormatter(locale).format(dateObj);
};

export const formatCategoryName = (name: string) => {
  return name
    .trim()
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
