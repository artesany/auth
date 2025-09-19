export interface Token {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  chainId: number|string;
  logoURI?: string;
  isNative?: boolean;
  price?: number | null;
}

export interface TokenBalance {
  token: Token;
  balance: string;
  formattedBalance: string;
}