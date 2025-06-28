import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (value: number) => {
  return Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

export const formatPercentage = (value: number) => {
  return Intl.NumberFormat("id-ID", {
    style: "percent",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    signDisplay: "exceptZero",
  }).format(value);
};

export const formatDate = (date: string | Date) => {
  let dateObj: Date;
  if (typeof date === "string") {
    try {
      dateObj = new Date(date);
    } catch (error) {
      console.error(error);
      return "Invalid date";
    }
  } else {
    dateObj = date;
  }

  return Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
  }).format(dateObj);
};
