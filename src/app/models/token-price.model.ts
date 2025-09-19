// token-price.model.ts
export interface TokenPrice {
  id: string;
  symbol: string;
  name: string;
  blockchain: string;
  current_price: number;
  price_change_24h: number;
  last_updated: Date;
  image?: string;
}

export interface PriceResponse {
  tokens: TokenPrice[];
  lastUpdate: Date;
  nextUpdate: Date;
}

export interface CoinGeckoResponse {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_24h: number;
  last_updated: string;
}