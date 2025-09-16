export interface Token {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  chainId: number|string;
  logoURI?: string;
  isNative?: boolean;
}

export interface TokenBalance {
  token: Token;
  balance: string;
  formattedBalance: string;
}