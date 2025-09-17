import { Token } from '../models/token.model';
import { SOLANA_COMMON_TOKENS, SOLANA_NETWORKS } from './abi.helper';

// Función helper para acceder a tokens de forma segura
const getSolanaToken = (tokenKey: keyof typeof SOLANA_COMMON_TOKENS): { address: string; name: string; symbol: string; decimals: number; logoURI: string } => {
  return SOLANA_COMMON_TOKENS[tokenKey];
};

// Listas de tokens por chainId (EVM) - Actualizadas con top tokens de septiembre 2025
export const TOKEN_LISTS: { [chainId: number]: Token[] } = {
  // Ethereum Mainnet (ID 1) - Top 10+ por market cap 2025: ETH, USDT, USDC, WBTC, SHIB, PEPE, LINK, UNI, DAI, AAVE, LDO, FLOKI
  1: [
    {
      address: '0xNative',
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
      chainId: 1,
      isNative: true,
      logoURI: 'https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/ethereum/info/logo.png'
    },
    {
      address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      name: 'Tether USD',
      symbol: 'USDT',
      decimals: 6,
      chainId: 1,
      logoURI: 'https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png'
    },
    {
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 6,
      chainId: 1,
      logoURI: 'https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png'
    },
    {
      address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
      name: 'Wrapped BTC',
      symbol: 'WBTC',
      decimals: 8,
      chainId: 1,
      logoURI: 'https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png'
    },
    {
      address: '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE',
      name: 'Shiba Inu',
      symbol: 'SHIB',
      decimals: 18,
      chainId: 1,
      logoURI: 'https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/ethereum/assets/0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE/logo.png'
    },
    {
      address: '0x6982508145454Ce325dDbE47a25d4ec3d2311933',
      name: 'Pepe',
      symbol: 'PEPE',
      decimals: 18,
      chainId: 1,
      logoURI: 'https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/ethereum/assets/0x6982508145454Ce325dDbE47a25d4ec3d2311933/logo.png'
    },
    {
      address: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
      name: 'Chainlink',
      symbol: 'LINK',
      decimals: 18,
      chainId: 1,
      logoURI: 'https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/ethereum/assets/0x514910771AF9Ca656af840dff83E8264EcF986CA/logo.png'
    },
    {
      address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
      name: 'Uniswap',
      symbol: 'UNI',
      decimals: 18,
      chainId: 1,
      logoURI: 'https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/ethereum/assets/0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984/logo.png'
    },
    {
      address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      name: 'Dai Stablecoin',
      symbol: 'DAI',
      decimals: 18,
      chainId: 1,
      logoURI: 'https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png'
    },
    {
      address: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
      name: 'Aave',
      symbol: 'AAVE',
      decimals: 18,
      chainId: 1,
      logoURI: 'https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/ethereum/assets/0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9/logo.png'
    },
    {
      address: '0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32',
      name: 'Lido DAO',
      symbol: 'LDO',
      decimals: 18,
      chainId: 1,
      logoURI: 'https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/ethereum/assets/0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32/logo.png'
    },
    {
      address: '0x43f11c02439e2736800433a2209cbf4aCE50dA53',
      name: 'Floki Inu',
      symbol: 'FLOKI',
      decimals: 9,
      chainId: 1,
      logoURI: 'https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/ethereum/assets/0x43f11c02439e2736800433a2209cbf4aCE50dA53/logo.png'
    }
  ],
  // Ethereum Sepolia Testnet (ID 11155111) - Limitado; top test tokens: ETH, USDT, USDC, DAI, LINK, USDZ, WETH
  11155111: [
    {
      address: '0xNative',
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
      chainId: 11155111,
      isNative: true,
      logoURI: 'https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/ethereum/info/logo.png'
    },
    {
      address: '0x7169D38820dfd117C3FA1f22a697dBA58d90BA06',
      name: 'Tether USD',
      symbol: 'USDT',
      decimals: 6,
      chainId: 11155111,
      logoURI: 'https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png'
    },
    {
      address: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 6,
      chainId: 11155111,
      logoURI: 'https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png'
    },
    {
      address: '0x2e8d98fd126a32362f2bd8a6e7fded8038b7550e',
      name: 'Dai Stablecoin',
      symbol: 'DAI',
      decimals: 18,
      chainId: 11155111,
      logoURI: 'https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png'
    },
    {
      address: '0x779877a7b0d9e8603169ddbd7836e478b4624789',
      name: 'Chainlink',
      symbol: 'LINK',
      decimals: 18,
      chainId: 11155111,
      logoURI: 'https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/ethereum/assets/0x514910771AF9Ca656af840dff83E8264EcF986CA/logo.png'
    },
    {
      address: '0x94a9D9AC8a22534E3FaCa9F4e7F2e2cf85d5E4A8',
      name: 'USDZ',
      symbol: 'USDZ',
      decimals: 6,
      chainId: 11155111,
      logoURI: 'https://example.com/usdz-logo.png' // Usar placeholder para testnet
    },
    {
      address: '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14',
      name: 'Wrapped Ether',
      symbol: 'WETH',
      decimals: 18,
      chainId: 11155111,
      logoURI: 'https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png'
    }
  ],
  // Polygon Mainnet (ID 137) - Top 2025: MATIC, USDT, USDC, LINK, UNI, AAVE, QUICK, SAND, MANA, WETH, ALI, VANRY
  137: [
    {
      address: '0xNative',
      name: 'Polygon',
      symbol: 'MATIC',
      decimals: 18,
      chainId: 137,
      isNative: true,
      logoURI: 'https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/polygon/info/logo.png'
    },
    {
      address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
      name: 'Tether USD',
      symbol: 'USDT',
      decimals: 6,
      chainId: 137,
      logoURI: 'https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/polygon/assets/0xc2132D05D31c914a87C6611C10748AEb04B58e8F/logo.png'
    },
    {
      address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 6,
      chainId: 137,
      logoURI: 'https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/polygon/assets/0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174/logo.png'
    },
    {
      address: '0x53E0bca35eC356BD5ddDFebbD1Fc0bD05Cba2ce58',
      name: 'Chainlink',
      symbol: 'LINK',
      decimals: 18,
      chainId: 137,
      logoURI: 'https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/polygon/assets/0x53E0bca35eC356BD5ddDFebbD1Fc0bD05Cba2ce58/logo.png'
    },
    {
      address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
      name: 'Uniswap',
      symbol: 'UNI',
      decimals: 18,
      chainId: 137,
      logoURI: 'https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/polygon/assets/0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984/logo.png'
    },
    {
      address: '0xD6DF932A45C0f255f85145f286eA0b292B21C90B',
      name: 'Aave',
      symbol: 'AAVE',
      decimals: 18,
      chainId: 137,
      logoURI: 'https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/polygon/assets/0xD6DF932A45C0f255f85145f286eA0b292B21C90B/logo.png'
    },
    {
      address: '0x326C977E6efc84E512bB9C30f76E30c160eD06FB',
      name: 'QuickSwap',
      symbol: 'QUICK',
      decimals: 18,
      chainId: 137,
      logoURI: 'https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/polygon/assets/0x326C977E6efc84E512bB9C30f76E30c160eD06FB/logo.png'
    },
    {
      address: '0xBbba073C31bF03b8ACf7c28EF0738DeCF3695683',
      name: 'The Sandbox',
      symbol: 'SAND',
      decimals: 18,
      chainId: 137,
      logoURI: 'https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/polygon/assets/0xBbba073C31bF03b8ACf7c28EF0738DeCF3695683/logo.png'
    },
    {
      address: '0xA1c57f48F0Deb89f569dFbE6E2B7f46D33606fD4',
      name: 'Decentraland',
      symbol: 'MANA',
      decimals: 18,
      chainId: 137,
      logoURI: 'https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/polygon/assets/0xA1c57f48F0Deb89f569dFbE6E2B7f46D33606fD4/logo.png'
    },
    {
      address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
      name: 'Wrapped Ether',
      symbol: 'WETH',
      decimals: 18,
      chainId: 137,
      logoURI: 'https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/polygon/assets/0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619/logo.png'
    },
    {
      address: '0x80A16016cC4A2E6a2CACA8a4a498b1699fF0f844',
      name: 'ApeSwap Finance',
      symbol: 'BANANA',
      decimals: 18,
      chainId: 137,
      logoURI: 'https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/polygon/assets/0x80A16016cC4A2E6a2CACA8a4a498b1699fF0f844/logo.png'
    },
    {
      address: '0x9C78EE466D6Cb57A4d01Fd887D2E6280c6E8FBB9',
      name: 'Polygonal',
      symbol: 'ALI',
      decimals: 18,
      chainId: 137,
      logoURI: 'https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/polygon/assets/0x9C78EE466D6Cb57A4d01Fd887D2E6280c6E8FBB9/logo.png'
    }
  ],
  // BSC Mainnet (ID 56) - Top 2025: BNB, USDT, USDC, CAKE, BUSD, DOT, WETH, XRP
  56: [
    {
      address: '0xNative',
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
      chainId: 56,
      isNative: true,
      logoURI: 'https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/binance/info/logo.png'
    },
    {
      address: '0x55d398326f99059fF775485246999027B3197955',
      name: 'Tether USD',
      symbol: 'USDT',
      decimals: 18,
      chainId: 56,
      logoURI: 'https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/binance/assets/0x55d398326f99059fF775485246999027B3197955/logo.png'
    },
    {
      address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 18,
      chainId: 56,
      logoURI: 'https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/binance/assets/0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d/logo.png'
    },
    {
      address: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
      name: 'PancakeSwap',
      symbol: 'CAKE',
      decimals: 18,
      chainId: 56,
      logoURI: 'https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/binance/assets/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82/logo.png'
    },
    {
      address: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
      name: 'Binance USD',
      symbol: 'BUSD',
      decimals: 18,
      chainId: 56,
      logoURI: 'https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/binance/assets/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56/logo.png'
    },
    {
      address: '0x7083609fCE4d1d8Dc0C979AAb8c869Ea2C873402',
      name: 'Polkadot',
      symbol: 'DOT',
      decimals: 18,
      chainId: 56,
      logoURI: 'https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/binance/assets/0x7083609fCE4d1d8Dc0C979AAb8c869Ea2C873402/logo.png'
    },
    {
      address: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
      name: 'Wrapped ETH',
      symbol: 'WETH',
      decimals: 18,
      chainId: 56,
      logoURI: 'https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/binance/assets/0x2170Ed0880ac9A755fd29B2688956BD959F933F8/logo.png'
    },
    {
      address: '0x1D2F0da169ceB9fC7B3144628dB156f3F6c60dBE',
      name: 'XRP',
      symbol: 'XRP',
      decimals: 18,
      chainId: 56,
      logoURI: 'https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/binance/assets/0x1D2F0da169ceB9fC7B3144628dB156f3F6c60dBE/logo.png'
    }
  ],
  // BSC Testnet (ID 97) - Limitado; BNB test, USDT test
  97: [
    {
      address: '0xNative',
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
      chainId: 97,
      isNative: true,
      logoURI: 'https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/binance/info/logo.png'
    },
    {
      address: '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd',
      name: 'Tether USD',
      symbol: 'USDT',
      decimals: 18,
      chainId: 97,
      logoURI: 'https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/binance/assets/0x55d398326f99059fF775485246999027B3197955/logo.png'
    },
    {
      address: '0x0959158b6040D32d04c301A72cBFD6b39E21c9AE',
      name: 'Binance-Peg BUSD',
      symbol: 'BUSD',
      decimals: 18,
      chainId: 97,
      logoURI: 'https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/binance/assets/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56/logo.png'
    }
  ],
  // Optimism Mainnet (ID 10) - Top 2025: ETH, USDT, USDC, LINK, WBTC, DOT, UNI, LDO, PENDLE, TBTC, SNX, PERP
  10: [
    {
      address: '0xNative',
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
      chainId: 10,
      isNative: true,
      logoURI: 'https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/optimism/info/logo.png'
    },
    {
      address: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
      name: 'Tether USD',
      symbol: 'USDT',
      decimals: 6,
      chainId: 10,
      logoURI: 'https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/optimism/assets/0x94b008aA00579c1307B0EF2c499aD98a8ce58e58/logo.png'
    },
    {
      address: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 6,
      chainId: 10,
      logoURI: 'https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/optimism/assets/0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85/logo.png'
    },
    {
      address: '0x350a791Bfc2C21F9Ed5d10980Dad2e2638ffa7f6',
      name: 'Chainlink',
      symbol: 'LINK',
      decimals: 18,
      chainId: 10,
      logoURI: 'https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/optimism/assets/0x350a791Bfc2C21F9Ed5d10980Dad2e2638ffa7f6/logo.png'
    },
    {
      address: '0x68f180fcCe6836688e9084f035309E29Bf0A2095',
      name: 'Wrapped BTC',
      symbol: 'WBTC',
      decimals: 8,
      chainId: 10,
      logoURI: 'https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/optimism/assets/0x68f180fcCe6836688e9084f035309E29Bf0A2095/logo.png'
    },
    {
      address: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
      name: 'Polkadot',
      symbol: 'DOT',
      decimals: 18,
      chainId: 10,
      logoURI: 'https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/optimism/assets/0x7F5c764cBc14f9669B88837ca1490cCa17c31607/logo.png'
    },
    {
      address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
      name: 'Uniswap',
      symbol: 'UNI',
      decimals: 18,
      chainId: 10,
      logoURI: 'https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/optimism/assets/0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984/logo.png'
    },
    {
      address: '0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32',
      name: 'Lido DAO',
      symbol: 'LDO',
      decimals: 18,
      chainId: 10,
      logoURI: 'https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/optimism/assets/0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32/logo.png'
    },
    {
      address: '0x808507121b80c02388fAD14726482e061B8da827',
      name: 'Pendle',
      symbol: 'PENDLE',
      decimals: 18,
      chainId: 10,
      logoURI: 'https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/optimism/assets/0x808507121b80c02388fAD14726482e061B8da827/logo.png'
    },
    {
      address: '0xB0fE2D4C5bB6D3a7A4b3a8a4B5d5c8a4b3a7A4b3',
      name: 'tBTC',
      symbol: 'TBTC',
      decimals: 18,
      chainId: 10,
      logoURI: 'https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/optimism/assets/0xB0fE2D4C5bB6D3a7A4b3a8a4B5d5c8a4b3a7A4b3/logo.png' // Placeholder
    },
    {
      address: '0x8700dAec35aF8Ff88c16Aa612bdCddfEfF917AF3',
      name: 'Synthetix',
      symbol: 'SNX',
      decimals: 18,
      chainId: 10,
      logoURI: 'https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/optimism/assets/0x8700dAec35aF8Ff88c16Aa612bdCddfEfF917AF3/logo.png'
    },
    {
      address: '0x9e1028F5F1D5eDE59748FFceE5532509976840E0',
      name: 'Perpetual Protocol',
      symbol: 'PERP',
      decimals: 18,
      chainId: 10,
      logoURI: 'https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/optimism/assets/0x9e1028F5F1D5eDE59748FFceE5532509976840E0/logo.png'
    }
  ],
  // Arbitrum One (ID 42161) - Top 2025: ETH, USDT, USDC, WBTC, LINK, ARB, GMX, RDNT, BONK, MKR, USDS, DOT
  42161: [
    {
      address: '0xNative',
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
      chainId: 42161,
      isNative: true,
      logoURI: 'https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/arbitrum/info/logo.png'
    },
    {
      address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
      name: 'Tether USD',
      symbol: 'USDT',
      decimals: 6,
      chainId: 42161,
      logoURI: 'https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/arbitrum/assets/0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9/logo.png'
    },
    {
      address: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 6,
      chainId: 42161,
      logoURI: 'https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/arbitrum/assets/0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8/logo.png'
    },
    {
      address: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
      name: 'Wrapped BTC',
      symbol: 'WBTC',
      decimals: 8,
      chainId: 42161,
      logoURI: 'https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/arbitrum/assets/0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f/logo.png'
    },
    {
      address: '0x912CE59144191C1204E64559FE8253a0e49E6548',
      name: 'Chainlink',
      symbol: 'LINK',
      decimals: 18,
      chainId: 42161,
      logoURI: 'https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/arbitrum/assets/0x912CE59144191C1204E64559FE8253a0e49E6548/logo.png'
    },
    {
      address: '0xf97f4df75117a78c1A5a0DBb814Af92458594a71',
      name: 'Arbitrum',
      symbol: 'ARB',
      decimals: 18,
      chainId: 42161,
      logoURI: 'https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/arbitrum/assets/0xf97f4df75117a78c1A5a0DBb814Af92458594a71/logo.png'
    },
    {
      address: '0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a',
      name: 'GMX',
      symbol: 'GMX',
      decimals: 18,
      chainId: 42161,
      logoURI: 'https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/arbitrum/assets/0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a/logo.png'
    },
    {
      address: '0x3082CC23568eA640225c2467653dB90e9250AaA0',
      name: 'Radiant Capital',
      symbol: 'RDNT',
      decimals: 18,
      chainId: 42161,
      logoURI: 'https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/arbitrum/assets/0x3082CC23568eA640225c2467653dB90e9250AaA0/logo.png'
    },
    {
      address: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
      name: 'Bonk',
      symbol: 'BONK',
      decimals: 5,
      chainId: 42161,
      logoURI: 'https://cdn.jsdelivr.net/gh/solana-labs/token-list@mainnet/DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263/logo.png'
    },
    {
      address: '0x9f8F72aA9304c8B593d555F12eF6589cC3db75f0',
      name: 'Maker',
      symbol: 'MKR',
      decimals: 18,
      chainId: 42161,
      logoURI: 'https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/arbitrum/assets/0x9f8F72aA9304c8B593d555F12eF6589cC3db75f0/logo.png'
    },
    {
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      name: 'USDS',
      symbol: 'USDS',
      decimals: 6,
      chainId: 42161,
      logoURI: 'https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/arbitrum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png'
    },
    {
      address: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
      name: 'Polkadot',
      symbol: 'DOT',
      decimals: 18,
      chainId: 42161,
      logoURI: 'https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/arbitrum/assets/0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8/logo.png'
    }
  ]
};

// Tokens de Solana por network - Actualizadas con top 2025: WSOL, USDT, USDC, BONK, WIF, JUP, PYTH, MNDE, RAY, MOODENG, KMNO
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
      address: 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCNj',
      name: 'Jupiter',
      symbol: 'JUP',
      decimals: 6,
      chainId: SOLANA_NETWORKS['mainnet-beta'].chainId,
      logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCNj/logo.png'
    },
    {
      address: 'HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3',
      name: 'Pyth Network',
      symbol: 'PYTH',
      decimals: 6,
      chainId: SOLANA_NETWORKS['mainnet-beta'].chainId,
      logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3/logo.png'
    },
    {
      address: 'MNDEFzGvMt87ueuHvVU9VcTqsAP5b3fTGPsHuuPA5ey',
      name: 'Marinade',
      symbol: 'MNDE',
      decimals: 6,
      chainId: SOLANA_NETWORKS['mainnet-beta'].chainId,
      logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/MNDEFzGvMt87ueuHvVU9VcTqsAP5b3fTGPsHuuPA5ey/logo.png'
    },
    {
      address: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R',
      name: 'Raydium',
      symbol: 'RAY',
      decimals: 6,
      chainId: SOLANA_NETWORKS['mainnet-beta'].chainId,
      logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R/logo.png'
    },
    {
      address: '7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2Hr',
      name: 'Popcat',
      symbol: 'POPCAT',
      decimals: 9,
      chainId: SOLANA_NETWORKS['mainnet-beta'].chainId,
      logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2Hr/logo.png'
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
    },
    {
      address: 'HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3',
      name: 'Pyth Network (Devnet)',
      symbol: 'PYTH',
      decimals: 6,
      chainId: SOLANA_NETWORKS.devnet.chainId,
      logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3/logo.png'
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

// Función alternativa para obtener tokens Solana de forma segura
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