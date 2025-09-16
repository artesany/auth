import { PublicKey } from '@solana/web3.js';
import { ethers } from 'ethers';

// Interfaces para configuración de tokens y redes Solana
export interface SolanaTokenConfig {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
}

export interface SolanaNetworkConfig {
  endpoint: string;
  chainId: number;
  explorer: string | null;
}

export interface SolanaCommonTokens {
  WSOL: SolanaTokenConfig;
  USDC: SolanaTokenConfig;
  USDT: SolanaTokenConfig;
}

export interface SolanaNetworks {
  'mainnet-beta': SolanaNetworkConfig;
  testnet: SolanaNetworkConfig;
  devnet: SolanaNetworkConfig;
  localnet: SolanaNetworkConfig;
  [key: string]: SolanaNetworkConfig;
}

// Interfaz para tokens
export interface Token {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  chainId: number | string;
  isNative?: boolean;
  logoURI?: string;
}

// Interfaz para balances de tokens
export interface TokenBalance {
  token: Token;
  balance: string;
  formattedBalance: string;
}

// Listas de tokens para EVM
export const TOKEN_LISTS: { [chainId: number]: Token[] } = {
  1: [ // Ethereum Mainnet
    {
      address: '0x0000000000000000000000000000000000000000',
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
      chainId: 1,
      isNative: true,
      logoURI: 'https://etherscan.io/images/ethereum-icon.png'
    },
    {
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 6,
      chainId: 1,
      logoURI: 'https://etherscan.io/token/images/centre-usdc_28.png'
    }
  ],
  11155111: [ // Sepolia Testnet
    {
      address: '0x0000000000000000000000000000000000000000',
      name: 'Sepolia Ether',
      symbol: 'ETH',
      decimals: 18,
      chainId: 11155111,
      isNative: true,
      logoURI: 'https://etherscan.io/images/ethereum-icon.png'
    }
  ]
};

// Listas de tokens para Solana
export const SOLANA_TOKEN_LISTS: { [network: string]: Token[] } = {
  'mainnet-beta': [
    {
      address: 'So11111111111111111111111111111111111111112',
      name: 'Wrapped SOL',
      symbol: 'WSOL',
      decimals: 9,
      chainId: 'mainnet-beta',
      isNative: true,
      logoURI: 'https://cdn.jsdelivr.net/gh/solana-labs/token-list/assets/mainnet/So11111111111111111111111111111111111111112/logo.png'
    },
    {
      address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 6,
      chainId: 'mainnet-beta',
      logoURI: 'https://cdn.jsdelivr.net/gh/solana-labs/token-list/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png'
    }
  ],
  devnet: [
    {
      address: 'So11111111111111111111111111111111111111112',
      name: 'Wrapped SOL',
      symbol: 'WSOL',
      decimals: 9,
      chainId: 'devnet',
      isNative: true,
      logoURI: 'https://cdn.jsdelivr.net/gh/solana-labs/token-list/assets/mainnet/So11111111111111111111111111111111111111112/logo.png'
    }
  ]
};

// Constantes para tokens comunes de Solana
export const SOLANA_COMMON_TOKENS: SolanaCommonTokens = {
  WSOL: {
    address: 'So11111111111111111111111111111111111111112',
    name: 'Wrapped SOL',
    symbol: 'WSOL',
    decimals: 9,
    logoURI: 'https://cdn.jsdelivr.net/gh/solana-labs/token-list/assets/mainnet/So11111111111111111111111111111111111111112/logo.png'
  },
  USDC: {
    address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    name: 'USD Coin',
    symbol: 'USDC',
    decimals: 6,
    logoURI: 'https://cdn.jsdelivr.net/gh/solana-labs/token-list/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png'
  },
  USDT: {
    address: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
    name: 'USDT',
    symbol: 'USDT',
    decimals: 6,
    logoURI: 'https://cdn.jsdelivr.net/gh/solana-labs/token-list/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.svg'
  }
};

// Configuración de redes Solana
export const SOLANA_NETWORKS: SolanaNetworks = {
  'mainnet-beta': {
    endpoint: 'https://api.mainnet-beta.solana.com',
    chainId: 101,
    explorer: 'https://explorer.solana.com'
  },
  testnet: {
    endpoint: 'https://api.testnet.solana.com',
    chainId: 102,
    explorer: 'https://explorer.solana.com/?cluster=testnet'
  },
  devnet: {
    endpoint: 'https://api.devnet.solana.com',
    chainId: 103,
    explorer: 'https://explorer.solana.com/?cluster=devnet'
  },
  localnet: {
    endpoint: 'http://localhost:8899',
    chainId: 104,
    explorer: null
  }
};

// ABIs para tokens ERC-20 (Ethereum y EVM-compatibles)
export const ERC20_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "event Transfer(address indexed from, address indexed to, uint256 amount)",
  "event Approval(address indexed owner, address indexed spender, uint256 amount)"
];

// ABI para el estándar ERC-20 con metadata
export const ERC20_METADATA_ABI = [
  ...ERC20_ABI,
  "function name() external view returns (string memory)",
  "function symbol() external view returns (string memory)",
  "function decimals() external view returns (uint8)"
];

// Interfaces para interactuar con programas SPL-Token en Solana
export const SPL_TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');

// Estructuras e instrucciones para SPL-Token
export const SPL_TOKEN_INSTRUCTIONS = {
  InitializeMint: { index: 0, layout: { decimals: 'uint8', mintAuthority: 'publicKey', freezeAuthority: { type: 'publicKey', optional: true } } },
  InitializeAccount: { index: 1, layout: {} },
  InitializeMultisig: { index: 2, layout: { m: 'uint8' } },
  Transfer: { index: 3, layout: { amount: 'uint64' } },
  Approve: { index: 4, layout: { amount: 'uint64' } },
  Revoke: { index: 5, layout: {} },
  SetAuthority: { index: 6, layout: { authorityType: 'uint8', newAuthority: { type: 'publicKey', optional: true } } },
  MintTo: { index: 7, layout: { amount: 'uint64' } },
  Burn: { index: 8, layout: { amount: 'uint64' } },
  CloseAccount: { index: 9, layout: {} },
  FreezeAccount: { index: 10, layout: {} },
  ThawAccount: { index: 11, layout: {} },
  TransferChecked: { index: 12, layout: { amount: 'uint64', decimals: 'uint8' } },
  ApproveChecked: { index: 13, layout: { amount: 'uint64', decimals: 'uint8' } },
  MintToChecked: { index: 14, layout: { amount: 'uint64', decimals: 'uint8' } },
  BurnChecked: { index: 15, layout: { amount: 'uint64', decimals: 'uint8' } }
};

// Interfaces para interactuar con Associated Token Account Program en Solana
export const SPL_ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');

// Helper functions para Solana
export const SolanaHelpers = {
  isValidAddress: (address: string): boolean => {
    try {
      new PublicKey(address);
      return true;
    } catch {
      return false;
    }
  },
  toLamports: (amount: number | string, decimals: number): bigint => {
    const amountStr = typeof amount === 'string' ? amount : amount.toString();
    const [int, frac = ''] = amountStr.split('.');
    const fractionalPart = frac.padEnd(decimals, '0').slice(0, decimals);
    return BigInt(int + fractionalPart);
  },
  fromLamports: (lamports: bigint, decimals: number): string => {
    const lamportsStr = lamports.toString().padStart(decimals + 1, '0');
    const intPart = lamportsStr.slice(0, -decimals) || '0';
    const fractionalPart = lamportsStr.slice(-decimals).replace(/0+$/, '');
    return fractionalPart ? `${intPart}.${fractionalPart}` : intPart;
  },
  findAssociatedTokenAddress: async (
    walletAddress: PublicKey,
    tokenMintAddress: PublicKey
  ): Promise<PublicKey> => {
    const [address] = await PublicKey.findProgramAddress(
      [
        walletAddress.toBuffer(),
        SPL_TOKEN_PROGRAM_ID.toBuffer(),
        tokenMintAddress.toBuffer(),
      ],
      SPL_ASSOCIATED_TOKEN_PROGRAM_ID
    );
    return address;
  }
};

// Helper functions para Ethereum
export const EthereumHelpers = {
  isValidAddress: (address: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  },
  toWei: (amount: string, decimals: number): bigint => {
    const [int, frac = ''] = amount.split('.');
    const fractionalPart = frac.padEnd(decimals, '0').slice(0, decimals);
    return BigInt(int + fractionalPart);
  },
  fromWei: (wei: bigint, decimals: number): string => {
    const weiStr = wei.toString().padStart(decimals + 1, '0');
    const intPart = weiStr.slice(0, -decimals) || '0';
    const fractionalPart = weiStr.slice(-decimals).replace(/0+$/, '');
    return fractionalPart ? `${intPart}.${fractionalPart}` : intPart;
  }
};

// Tipo para identificar la blockchain
export type BlockchainType = 'ethereum' | 'solana';

// Detectar el tipo de dirección
export const detectAddressType = (address: string): BlockchainType | null => {
  if (EthereumHelpers.isValidAddress(address)) {
    return 'ethereum';
  } else if (SolanaHelpers.isValidAddress(address)) {
    return 'solana';
  }
  return null;
};