export interface Question {
  id: string;
  category: string[];
  questionName: string;
  subCategory: string;
  ruleMarket: string;
  timeEnd: string;
  marketType: string;
  symbol: string;
  groupQuestion: string;
  logoUrl: string;
  eps: string;
  logo: File | null;
  tags: string;
  answers: Answer[];
}
export interface Answer {
  id: string;
  logoUrl: string;
  answer: string;
  answerName: string;
  priceCheck: number;
  yes: number;
  logo: File | null;
  resolved?: boolean;
  outcome: string;
  no: number;
  m: number;
}

export interface Errors {
  error?: string;
  category?: string;
  questionName?: string;
  symbol?: string;
  timeEnd?: string;
  ruleMarket?: string;
  tags?: string;
  eps?: string;
  priceCheck?: string;
  logo?: string;
  answers?: {
    [index: number]: ErrorAnswer;
  };
}
export interface ErrorAnswer {
  error?: string;
  answer?: string;
  answerName?: string;
  yes?: string;
  no?: string;
  m?: string;
  priceCheck?: string;
}
export type Category =
  | "CRYPTO"
  | "CULTURE"
  | "EARNINGS"
  | "ECONOMY"
  | "ELECTIONS"
  | "FINANCE"
  | "GEOPOLITICS"
  | "MENTIONS"
  | "POLITICS"
  | "SPORTS"
  | "TECH"
  | "WORLD";
export type MarketType =
  | "ALL"
  | "15M"
  | "HOURLY"
  | "4HOUR"
  | "DAILY"
  | "WEEKLY"
  | "MONTHLY"
  | "ANNUAL"
  | "PRE_MARKET";

export interface AnswerFormType {
  id?: string
  answer: string;
  answerName: string;
  logo: File | null;
  logoUrl?: string;
  yes: number;
  no: number;
  m: number;
  priceCheck: number;
}
export type ModalState =
  | { open: false }
  | { open: true; mode: "create"; data?: null }
  | { open: true; mode: "edit"; data: AnswerFormType };
