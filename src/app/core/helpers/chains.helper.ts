export const CHAINS = [
  { 
    id: 1, 
    name: 'Ethereum Mainnet', 
    symbol: 'ETH', 
    rpcUrl: 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY', 
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    explorerUrl: 'https://etherscan.io'
  },
  { 
    id: 11155111, 
    name: 'Sepolia', 
    symbol: 'SepoliaETH', 
    rpcUrl: 'https://ethereum-sepolia-rpc.publicnode.com', 
    nativeCurrency: { name: 'Sepolia', symbol: 'SepoliaETH', decimals: 18 },
    explorerUrl: 'https://sepolia.etherscan.io'
  },
  { 
    id: 137, 
    name: 'Polygon Mainnet', 
    symbol: 'MATIC', 
    rpcUrl: 'https://polygon-rpc.com', 
    nativeCurrency: { name: 'Matic', symbol: 'MATIC', decimals: 18 },
    explorerUrl: 'https://polygonscan.com'
  },
  { 
    id: 56, 
    name: 'BSC Mainnet', 
    symbol: 'BNB', 
    rpcUrl: 'https://bsc-dataseed.binance.org/', 
    nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
    explorerUrl: 'https://bscscan.com'
  },
  { 
    id: 97, 
    name: 'BSC Testnet', 
    symbol: 'BNB', 
    rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545/', 
    nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
    explorerUrl: 'https://testnet.bscscan.com'
  },
  { 
    id: 10, 
    name: 'Optimism', 
    symbol: 'ETH', 
    rpcUrl: 'https://mainnet.optimism.io', 
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    explorerUrl: 'https://optimistic.etherscan.io'
  },
  { 
    id: 42161, 
    name: 'Arbitrum One', 
    symbol: 'ETH', 
    rpcUrl: 'https://arb1.arbitrum.io/rpc', 
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    explorerUrl: 'https://arbiscan.io'
  },
];

/** Devuelve la info de la chain por id */
export function getChainById(chainId: number) {
  return CHAINS.find(c => c.id === chainId);
}