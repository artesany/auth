import { Token } from '../models/token.model';
import { SOLANA_COMMON_TOKENS, SOLANA_NETWORKS } from './abi.helper';

// Función helper para acceder a tokens de forma segura
const getSolanaToken = (tokenKey: keyof typeof SOLANA_COMMON_TOKENS): { address: string; name: string; symbol: string; decimals: number; logoURI: string } => {
  return SOLANA_COMMON_TOKENS[tokenKey];
};

// Listas de tokens por chainId (EVM)
export const TOKEN_LISTS: { [chainId: number]: Token[] } = {
  // Ethereum Mainnet
  1: [
    {
      address: '0xNative',
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
      chainId: 1,
      isNative: true,
      logoURI: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/icon/eth.svg'
    },
    {
      address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      name: 'Tether USD',
      symbol: 'USDT',
      decimals: 6,
      chainId: 1,
      logoURI: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/icon/usdt.svg'
    },
    {
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 6,
      chainId: 1,
      logoURI: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/icon/usdc.svg'
    },
    {
      address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
      name: 'Wrapped BTC',
      symbol: 'WBTC',
      decimals: 8,
      chainId: 1,
      logoURI: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/icon/wbtc.svg'
    }
  ],

  // Ethereum Sepolia Testnet
  11155111: [
    {
      address: '0xNative',
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
      chainId: 11155111,
      isNative: true,
      logoURI: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/icon/eth.svg'
    },
    {
      address: '0x7169D38820dfd117C3FA1f22a697dBA58d90BA06',
      name: 'Tether USD',
      symbol: 'USDT',
      decimals: 6,
      chainId: 11155111,
      logoURI: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/icon/usdt.svg'
    }
  ],

  // Polygon Mainnet
  137: [
    {
      address: '0xNative',
      name: 'Polygon',
      symbol: 'MATIC',
      decimals: 18,
      chainId: 137,
      isNative: true,
      logoURI: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/icon/matic.svg'
    },
    {
      address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
      name: 'Tether USD',
      symbol: 'USDT',
      decimals: 6,
      chainId: 137,
      logoURI: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/icon/usdt.svg'
    },
    {
      address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 6,
      chainId: 137,
      logoURI: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/icon/usdc.svg'
    }
  ],

  // BSC Mainnet
  56: [
    {
      address: '0xNative',
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
      chainId: 56,
      isNative: true,
      logoURI: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/icon/bnb.svg'
    },
    {
      address: '0x55d398326f99059fF775485246999027B3197955',
      name: 'Tetter USD',
      symbol: 'USDT',
      decimals: 18,
      chainId: 56,
      logoURI: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/icon/usdt.svg'
    },
    {
      address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 18,
      chainId: 56,
      logoURI: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/icon/usdc.svg'
    }
  ],

  // BSC Testnet
  97: [
    {
      address: '0xNative',
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
      chainId: 97,
      isNative: true,
      logoURI: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/icon/bnb.svg'
    },
    {
      address: '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd',
      name: 'Tether USD',
      symbol: 'USDT',
      decimals: 18,
      chainId: 97,
      logoURI: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/icon/usdt.svg'
    }
  ],

  // Optimism
  10: [
    {
      address: '0xNative',
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
      chainId: 10,
      isNative: true,
      logoURI: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/icon/eth.svg'
    },
    {
      address: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
      name: 'Tether USD',
      symbol: 'USDT',
      decimals: 6,
      chainId: 10,
      logoURI: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/icon/usdt.svg'
    }
  ],

  // Arbitrum One
  42161: [
    {
      address: '0xNative',
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
      chainId: 42161,
      isNative: true,
      logoURI: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/icon/eth.svg'
    },
    {
      address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
      name: 'Tether USD',
      symbol: 'USDT',
      decimals: 6,
      chainId: 42161,
      logoURI: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/icon/usdt.svg'
    }
  ]
};

// Tokens de Solana por network - ACCESO SEGURO A PROPIEDADES
export const SOLANA_TOKEN_LISTS: { [network: string]: Token[] } = {
  'mainnet-beta': [
    {
      address: getSolanaToken('WSOL').address,
      name: getSolanaToken('WSOL').name,
      symbol: getSolanaToken('WSOL').symbol,
      decimals: getSolanaToken('WSOL').decimals,
      chainId: SOLANA_NETWORKS['mainnet-beta'].chainId,
      isNative: true,
      logoURI: getSolanaToken('WSOL').logoURI
    },
    {
      address: getSolanaToken('USDC').address,
      name: getSolanaToken('USDC').name,
      symbol: getSolanaToken('USDC').symbol,
      decimals: getSolanaToken('USDC').decimals,
      chainId: SOLANA_NETWORKS['mainnet-beta'].chainId,
      logoURI: getSolanaToken('USDC').logoURI
    },
    {
      address: getSolanaToken('USDT').address,
      name: getSolanaToken('USDT').name,
      symbol: getSolanaToken('USDT').symbol,
      decimals: getSolanaToken('USDT').decimals,
      chainId: SOLANA_NETWORKS['mainnet-beta'].chainId,
      logoURI: getSolanaToken('USDT').logoURI
    }
  ],
  devnet: [
    {
      address: getSolanaToken('WSOL').address,
      name: getSolanaToken('WSOL').name,
      symbol: getSolanaToken('WSOL').symbol,
      decimals: getSolanaToken('WSOL').decimals,
      chainId: SOLANA_NETWORKS.devnet.chainId,
      isNative: true,
      logoURI: getSolanaToken('WSOL').logoURI
    },
    {
      address: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU',
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 6,
      chainId: SOLANA_NETWORKS.devnet.chainId,
      logoURI: getSolanaToken('USDC').logoURI
    }
  ],
  testnet: [
    {
      address: getSolanaToken('WSOL').address,
      name: getSolanaToken('WSOL').name,
      symbol: getSolanaToken('WSOL').symbol,
      decimals: getSolanaToken('WSOL').decimals,
      chainId: SOLANA_NETWORKS.testnet.chainId,
      isNative: true,
      logoURI: getSolanaToken('WSOL').logoURI
    }
  ]
};

// Función alternativa para obtener tokens solana de forma segura
export const getSolanaTokenList = (network: keyof typeof SOLANA_NETWORKS): Token[] => {
  switch (network) {
    case 'mainnet-beta':
      return SOLANA_TOKEN_LISTS['mainnet-beta'];
    case 'devnet':
      return SOLANA_TOKEN_LISTS['devnet'];
    case 'testnet':
      return SOLANA_TOKEN_LISTS['testnet'];
    case 'localnet':
      return [{
        address: getSolanaToken('WSOL').address,
        name: getSolanaToken('WSOL').name,
        symbol: getSolanaToken('WSOL').symbol,
        decimals: getSolanaToken('WSOL').decimals,
        chainId: SOLANA_NETWORKS.localnet.chainId,
        isNative: true,
        logoURI: getSolanaToken('WSOL').logoURI
      }];
    default:
      return [];
  }
};

// Función para obtener tokens populares
export function getPopularTokens(chainIdOrNetwork: number | string): Token[] {
  if (typeof chainIdOrNetwork === 'number') {
    return TOKEN_LISTS[chainIdOrNetwork] || [];
  } else {
    return getSolanaTokenList(chainIdOrNetwork as keyof typeof SOLANA_NETWORKS);
  }
}

// Función para agregar tokens personalizados
export function addCustomToken(chainIdOrNetwork: number | string, token: Token): void {
  // Esta función sería implementada en el servicio, no en el helper
  console.log('addCustomToken should be implemented in TokenRegistryService');
}