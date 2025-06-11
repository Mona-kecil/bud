export type Transaction = {
  _id: string;
  date: string;
  merchant: string;
  description: string;
  amount: number;
  type: "income" | "expense" | "investment";
  category: string; // TODO: fetch list from backend for type safety
  account: string; // TODO: fetch list from backend for type safety
}

export type FilterState = {
  search_term: string;
  category_filter: string; // TODO: fetch list from backend for type safety
  min_amount: number;
  max_amount: number;
  date_from: Date;
  date_to: Date;
  active_tab: "all" | "income" | "expense" | "investment";
}