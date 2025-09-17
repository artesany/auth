import { Token } from '../models/token.model';
import { SOLANA_COMMON_TOKENS, SOLANA_NETWORKS } from './abi.helper';

// Función helper para acceder a tokens de Solana
const getSolanaToken = (tokenKey: keyof typeof SOLANA_COMMON_TOKENS): { address: string; name: string; symbol: string; decimals: number; logoURI: string } => {
  return SOLANA_COMMON_TOKENS[tokenKey];
};

// Listas de tokens por chainId (EVM) - Top tokens 2025 (CoinMarketCap, CoinGecko)
export const TOKEN_LISTS: { [chainId: number]: Token[] } = {
  // Ethereum Mainnet (ID 1)
  1: [
    {
      address: '0xNative',
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
      chainId: 1,
      isNative: true,
      logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png'
    },
    {
      address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      name: 'Tether USD',
      symbol: 'USDT',
      decimals: 6,
      chainId: 1,
      logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png'
    },
    {
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 6,
      chainId: 1,
      logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png'
    },
    {
      address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
      name: 'Wrapped BTC',
      symbol: 'WBTC',
      decimals: 8,
      chainId: 1,
      logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png'
    },
    {
      address: '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE',
      name: 'Shiba Inu',
      symbol: 'SHIB',
      decimals: 18,
      chainId: 1,
      logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE/logo.png'
    },
    {
      address: '0x6982508145454Ce325dDbE47a25d4ec3d2311933',
      name: 'Pepe',
      symbol: 'PEPE',
      decimals: 18,
      chainId: 1,
      logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6982508145454Ce325dDbE47a25d4ec3d2311933/logo.png'
    },
    {
      address: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
      name: 'Chainlink',
      symbol: 'LINK',
      decimals: 18,
      chainId: 1,
      logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x514910771AF9Ca656af840dff83E8264EcF986CA/logo.png'
    },
    {
      address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
      name: 'Uniswap',
      symbol: 'UNI',
      decimals: 18,
      chainId: 1,
      logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984/logo.png'
    },
    {
      address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      name: 'Dai Stablecoin',
      symbol: 'DAI',
      decimals: 18,
      chainId: 1,
      logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png'
    },
    {
      address: '0x43f11c02439e2736800433a2209cbf4aCE50dA53',
      name: 'Floki Inu',
      symbol: 'FLOKI',
      decimals: 9,
      chainId: 1,
      logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x43f11c02439e2736800433a2209cbf4aCE50dA53/logo.png'
    }
  ],
  // Ethereum Sepolia Testnet (ID 11155111)
  11155111: [
    {
      address: '0xNative',
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
      chainId: 11155111,
      isNative: true,
      logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png'
    },
    {
      address: '0x7169D38820dfd117C3FA1f22a697dBA58d90BA06',
      name: 'Tether USD',
      symbol: 'USDT',
      decimals: 6,
      chainId: 11155111,
      logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png'
    },
    {
      address: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 6,
      chainId: 11155111,
      logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png'
    },
    {
      address: '0x2e8d98fd126a32362f2bd8a6e7fded8038b7550e',
      name: 'Dai Stablecoin',
      symbol: 'DAI',
      decimals: 18,
      chainId: 11155111,
      logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png'
    },
    {
      address: '0x779877a7b0d9e8603169ddbd7836e478b4624789',
      name: 'Chainlink',
      symbol: 'LINK',
      decimals: 18,
      chainId: 11155111,
      logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x514910771AF9Ca656af840dff83E8264EcF986CA/logo.png'
    }
  ],
  // Polygon Mainnet (ID 137)
  137: [
    {
      address: '0xNative',
      name: 'Polygon',
      symbol: 'MATIC',
      decimals: 18,
      chainId: 137,
      isNative: true,
      logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/info/logo.png'
    },
    {
      address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
      name: 'Tether USD',
      symbol: 'USDT',
      decimals: 6,
      chainId: 137,
      logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/assets/0xc2132D05D31c914a87C6611C10748AEb04B58e8F/logo.png'
    },
    {
      address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 6,
      chainId: 137,
      logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/assets/0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174/logo.png'
    },
    {
      address: '0xb33EaAd8d922B1083446DC23f610c2567fB5180f',
      name: 'Uniswap',
      symbol: 'UNI',
      decimals: 18,
      chainId: 137,
      logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/assets/0xb33EaAd8d922B1083446DC23f610c2567fB5180f/logo.png'
    },
    {
      address: '0xD6DF932A45C0f255f85145f286eA0b292B21C90B',
      name: 'Aave',
      symbol: 'AAVE',
      decimals: 18,
      chainId: 137,
      logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/assets/0xD6DF932A45C0f255f85145f286eA0b292B21C90B/logo.png'
    },
    {
      address: '0xBbba073C31bF03b8ACf7c28EF0738DeCF3695683',
      name: 'The Sandbox',
      symbol: 'SAND',
      decimals: 18,
      chainId: 137,
      logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/assets/0xBbba073C31bF03b8ACf7c28EF0738DeCF3695683/logo.png'
    },
    {
      address: '0xA1c57f48F0Deb89f569dFbE6E2B7f46D33606fD4',
      name: 'Decentraland',
      symbol: 'MANA',
      decimals: 18,
      chainId: 137,
      logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/assets/0xA1c57f48F0Deb89f569dFbE6E2B7f46D33606fD4/logo.png'
    },
    {
      address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
      name: 'Wrapped Ether',
      symbol: 'WETH',
      decimals: 18,
      chainId: 137,
      logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/assets/0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619/logo.png'
    }
  ],
  // BSC Mainnet (ID 56)
  56: [
    {
      address: '0xNative',
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
      chainId: 56,
      isNative: true,
      logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/info/logo.png'
    },
    {
      address: '0x55d398326f99059fF775485246999027B3197955',
      name: 'Tether USD',
      symbol: 'USDT',
      decimals: 18,
      chainId: 56,
      logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/assets/0x55d398326f99059fF775485246999027B3197955/logo.png'
    },
    {
      address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 18,
      chainId: 56,
      logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/assets/0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d/logo.png'
    },
    {
      address: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
      name: 'PancakeSwap',
      symbol: 'CAKE',
      decimals: 18,
      chainId: 56,
      logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/assets/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82/logo.png'
    },
    {
      address: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
      name: 'Binance USD',
      symbol: 'BUSD',
      decimals: 18,
      chainId: 56,
      logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/assets/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56/logo.png'
    },
    {
      address: '0x7083609fCE4d1d8Dc0C979AAb8c869Ea2C873402',
      name: 'Polkadot',
      symbol: 'DOT',
      decimals: 18,
      chainId: 56,
      logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/assets/0x7083609fCE4d1d8Dc0C979AAb8c869Ea2C873402/logo.png'
    },
    {
      address: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
      name: 'Wrapped ETH',
      symbol: 'WETH',
      decimals: 18,
      chainId: 56,
      logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/assets/0x2170Ed0880ac9A755fd29B2688956BD959F933F8/logo.png'
    },
    {
      address: '0x1D2F0da169ceB9fC7B3144628dB156f3F6c60dBE',
      name: 'XRP',
      symbol: 'XRP',
      decimals: 18,
      chainId: 56,
      logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/assets/0x1D2F0da169ceB9fC7B3144628dB156f3F6c60dBE/logo.png'
    }
  ],
  // BSC Testnet (ID 97)
  97: [
    {
      address: '0xNative',
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
      chainId: 97,
      isNative: true,
      logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/info/logo.png'
    },
    {
      address: '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd',
      name: 'Tether USD',
      symbol: 'USDT',
      decimals: 18,
      chainId: 97,
      logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/assets/0x55d398326f99059fF775485246999027B3197955/logo.png'
    },
    {
      address: '0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee',
      name: 'Binance USD',
      symbol: 'BUSD',
      decimals: 18,
      chainId: 97,
      logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/assets/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56/logo.png'
    },
    {
      address: '0x64544969ed7EBf5f083679233325356EbE738930',
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 18,
      chainId: 97,
      logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/assets/0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d/logo.png'
    },
    {
      address: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
      name: 'PancakeSwap',
      symbol: 'CAKE',
      decimals: 18,
      chainId: 97,
      logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/assets/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82/logo.png'
    }
  ],
  // Optimism Mainnet (ID 10)
  10: [
    {
      address: '0xNative',
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
      chainId: 10,
      isNative: true,
      logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/optimism/info/logo.png'
    },
    {
      address: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
      name: 'Tether USD',
      symbol: 'USDT',
      decimals: 6,
      chainId: 10,
      logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/optimism/assets/0x94b008aA00579c1307B0EF2c499aD98a8ce58e58/logo.png'
    },
    {
      address: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 6,
      chainId: 10,
      logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/optimism/assets/0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85/logo.png'
    },
    {
      address: '0x4200000000000000000000000000000000000042',
      name: 'Optimism',
      symbol: 'OP',
      decimals: 18,
      chainId: 10,
      logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/optimism/assets/0x4200000000000000000000000000000000000042/logo.png'
    },
    {
      address: '0x350a791Bfc2C21F9Ed5d10980Dad2e2638ffa7f6',
      name: 'Chainlink',
      symbol: 'LINK',
      decimals: 18,
      chainId: 10,
      logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/optimism/assets/0x350a791Bfc2C21F9Ed5d10980Dad2e2638ffa7f6/logo.png'
    },
    {
      address: '0x8700dAec35aF8Ff88c16Aa612bdCddfEfF917AF3',
      name: 'Synthetix',
      symbol: 'SNX',
      decimals: 18,
      chainId: 10,
      logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/optimism/assets/0x8700dAec35aF8Ff88c16Aa612bdCddfEfF917AF3/logo.png'
    },
    {
      address: '0x9e1028F5F1D5eDE59748FFceE5532509976840E0',
      name: 'Perpetual Protocol',
      symbol: 'PERP',
      decimals: 18,
      chainId: 10,
      logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/optimism/assets/0x9e1028F5F1D5eDE59748FFceE5532509976840E0/logo.png'
    },
    {
      address: '0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32',
      name: 'Lido DAO',
      symbol: 'LDO',
      decimals: 18,
      chainId: 10,
      logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/optimism/assets/0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32/logo.png'
    }
  ],
  // Arbitrum One (ID 42161)
  42161: [
    {
      address: '0xNative',
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
      chainId: 42161,
      isNative: true,
      logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/arbitrum/info/logo.png'
    },
    {
      address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
      name: 'Tether USD',
      symbol: 'USDT',
      decimals: 6,
      chainId: 42161,
      logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/arbitrum/assets/0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9/logo.png'
    },
    {
      address: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 6,
      chainId: 42161,
      logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/arbitrum/assets/0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8/logo.png'
    },
    {
      address: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
      name: 'Wrapped BTC',
      symbol: 'WBTC',
      decimals: 8,
      chainId: 42161,
      logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/arbitrum/assets/0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f/logo.png'
    },
    {
      address: '0xf97f4df75117a78c1A5a0DBb814Af92458594a71',
      name: 'Arbitrum',
      symbol: 'ARB',
      decimals: 18,
      chainId: 42161,
      logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/arbitrum/assets/0xf97f4df75117a78c1A5a0DBb814Af92458594a71/logo.png'
    },
    {
      address: '0x53C91253bc9682c04929cA02ED00b3E423f6710D',
      name: 'Chainlink',
      symbol: 'LINK',
      decimals: 18,
      chainId: 42161,
      logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/arbitrum/assets/0x53C91253bc9682c04929cA02ED00b3E423f6710D/logo.png'
    },
    {
      address: '0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a',
      name: 'GMX',
      symbol: 'GMX',
      decimals: 18,
      chainId: 42161,
      logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/arbitrum/assets/0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a/logo.png'
    },
    {
      address: '0x3082CC23568eA640225c2467653dB90e9250AaA0',
      name: 'Radiant Capital',
      symbol: 'RDNT',
      decimals: 18,
      chainId: 42161,
      logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/arbitrum/assets/0x3082CC23568eA640225c2467653dB90e9250AaA0/logo.png'
    }
  ]
};

// Tokens de Solana por network - Top 2025 (CoinMarketCap, CoinGecko)
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
    },
    {
      address: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
      name: 'Bonk',
      symbol: 'BONK',
      decimals: 5,
      chainId: SOLANA_NETWORKS['mainnet-beta'].chainId,
      logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263/logo.png'
    },
    {
      address: 'EKpQGSJtjMFqQ3mC1QJtmshgjUEtJkvbsEvercyBUgmd',
      name: 'dogwifhat',
      symbol: 'WIF',
      decimals: 6,
      chainId: SOLANA_NETWORKS['mainnet-beta'].chainId,
      logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EKpQGSJtjMFqQ3mC1QJtmshgjUEtJkvbsEvercyBUgmd/logo.png'
    },
    {
      address: '7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2Hr',
      name: 'Popcat',
      symbol: 'POPCAT',
      decimals: 9,
      chainId: SOLANA_NETWORKS['mainnet-beta'].chainId,
      logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2Hr/logo.png'
    },
    {
      address: 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCNj',
      name: 'Jupiter',
      symbol: 'JUP',
      decimals: 6,
      chainId: SOLANA_NETWORKS['mainnet-beta'].chainId,
      logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCNj/logo.png'
    },
    {
      address: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R',
      name: 'Raydium',
      symbol: 'RAY',
      decimals: 6,
      chainId: SOLANA_NETWORKS['mainnet-beta'].chainId,
      logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R/logo.png'
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
    },
    {
      address: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
      name: 'Bonk (Devnet)',
      symbol: 'BONK',
      decimals: 5,
      chainId: SOLANA_NETWORKS.devnet.chainId,
      logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263/logo.png'
    },
    {
      address: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R',
      name: 'Raydium (Devnet)',
      symbol: 'RAY',
      decimals: 6,
      chainId: SOLANA_NETWORKS.devnet.chainId,
      logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R/logo.png'
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
    },
    {
      address: 'Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr',
      name: 'USD Coin (Testnet)',
      symbol: 'USDC',
      decimals: 6,
      chainId: SOLANA_NETWORKS.testnet.chainId,
      logoURI: getSolanaToken('USDC').logoURI
    }
  ]
};

// Función para obtener tokens de Solana
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
  console.log('addCustomToken should be implemented in TokenRegistryService');
}