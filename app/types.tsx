export interface Question {
  id: string;
  description: string;
  category: Category[];
  timeEnd: string
  tags: string[];
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
    [index: number]: {
      answer?: string;
      answerName?: string;
      yes?: string;
      no?: string;
      m?: string;
    };
  };
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
  answer: string;
  answerName: string;
  logo: File | null;
  yes: number;
  no: number;
  m: number;
  priceCheck: number;
}