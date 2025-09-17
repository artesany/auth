import { Injectable } from '@angular/core';
import { Token, SOLANA_COMMON_TOKENS, SOLANA_NETWORKS, detectAddressType, SolanaHelpers, EthereumHelpers } from '../../helpers/abi.helper';
import { TOKEN_LISTS, SOLANA_TOKEN_LISTS } from '../../helpers/token-list.helper';
import { Connection, PublicKey } from '@solana/web3.js';
import { ethers, Contract } from 'ethers';
import * as splToken from '@solana/spl-token';

interface IERC20Metadata {
  name(): Promise<string>;
  symbol(): Promise<string>;
  decimals(): Promise<number>;
}

@Injectable({ providedIn: 'root' })
export class TokenRegistryService {
  private customTokens: { [key: string]: Token[] } = {};

  constructor() {}

  getTokens(chainIdOrNetwork: number | string): Token[] {
    let tokens: Token[] = [];
    
    if (typeof chainIdOrNetwork === 'number') {
      tokens = [...(TOKEN_LISTS[chainIdOrNetwork] || [])];
    } else {
      tokens = [...(SOLANA_TOKEN_LISTS[chainIdOrNetwork] || [])];
    }
    
    const customKey = typeof chainIdOrNetwork === 'number' 
      ? `evm-${chainIdOrNetwork}` 
      : `solana-${chainIdOrNetwork}`;
    
    if (this.customTokens[customKey]) {
      tokens = [...tokens, ...this.customTokens[customKey]];
    }
    
    return tokens.length >= 5 ? tokens : [...tokens, ...this.getFallbackTokens(chainIdOrNetwork)];
  }

  private getFallbackTokens(chainIdOrNetwork: number | string): Token[] {
    const fallbackTokens: Token[] = [];
    if (typeof chainIdOrNetwork === 'number') {
      const nativeToken = TOKEN_LISTS[chainIdOrNetwork]?.find(t => t.isNative);
      if (nativeToken) fallbackTokens.push(nativeToken);
    } else {
      const nativeToken = SOLANA_TOKEN_LISTS[chainIdOrNetwork]?.find(t => t.isNative);
      if (nativeToken) fallbackTokens.push(nativeToken);
    }
    return fallbackTokens;
  }

  getTokenByAddress(chainIdOrNetwork: number | string, address: string): Token | undefined {
    return this.getTokens(chainIdOrNetwork).find(token => 
      token.address.toLowerCase() === address.toLowerCase()
    );
  }

  getNativeToken(chainIdOrNetwork: number | string): Token | undefined {
    return this.getTokens(chainIdOrNetwork).find(token => token.isNative);
  }

  addCustomToken(chainIdOrNetwork: number | string, token: Token): void {
    const customKey = typeof chainIdOrNetwork === 'number' 
      ? `evm-${chainIdOrNetwork}` 
      : `solana-${chainIdOrNetwork}`;
    
    if (!this.customTokens[customKey]) {
      this.customTokens[customKey] = [];
    }
    
    const exists = this.customTokens[customKey].some(t => 
      t.address.toLowerCase() === token.address.toLowerCase()
    );
    
    if (!exists) {
      this.customTokens[customKey].push(token);
    }
  }

  async fetchTokenMetadataEVM(
    provider: ethers.BrowserProvider,
    address: string,
    chainId: number
  ): Promise<Token | null> {
    try {
      if (address === '0xNative' || address === 'native') {
        return this.getNativeToken(chainId) || null;
      }

      const contract = new Contract(address, [
        'function name() view returns (string)',
        'function symbol() view returns (string)',
        'function decimals() view returns (uint8)'
      ], provider) as unknown as IERC20Metadata;

      const [name, symbol, decimals] = await Promise.all([
        contract.name(),
        contract.symbol(),
        contract.decimals()
      ]);

      return {
        address,
        name,
        symbol,
        decimals,
        chainId,
        logoURI: undefined
      };
    } catch (error) {
      console.error('Error fetching EVM token metadata:', error);
      return null;
    }
  }

  async fetchTokenMetadataSolana(
    connection: Connection,
    address: string
  ): Promise<Token | null> {
    try {
      if (address === SOLANA_COMMON_TOKENS.WSOL.address) {
        const mainnetToken = this.getNativeToken('mainnet-beta');
        return mainnetToken ? { ...mainnetToken, chainId: SOLANA_NETWORKS['mainnet-beta'].chainId } : null;
      }

      const publicKey = new PublicKey(address);
      let decimals = 6;

      try {
        const mintInfo = await splToken.getMint(connection, publicKey);
        decimals = mintInfo.decimals;
      } catch (error) {
        console.warn('Error with getMint, using default decimals:', error);
        const accountInfo = await connection.getAccountInfo(publicKey);
        if (accountInfo && accountInfo.data.length > 44) {
          decimals = accountInfo.data[44];
        }
      }
      
      return {
        address,
        name: 'Unknown SPL Token',
        symbol: 'UNKNOWN',
        decimals,
        chainId: SOLANA_NETWORKS['mainnet-beta'].chainId,
        logoURI: undefined
      };
    } catch (error) {
      console.error('Error fetching Solana token metadata:', error);
      return null;
    }
  }

  async findTokenByAddress(
    address: string,
    evmProvider?: ethers.BrowserProvider,
    solanaConnection?: Connection,
    chainId?: number
  ): Promise<Token | null> {
    const addressType = detectAddressType(address);
    
    if (addressType === 'ethereum') {
      if (!evmProvider || chainId === undefined) {
        throw new Error('EVM provider and chainId are required for Ethereum address');
      }
      const existingToken = this.getTokenByAddress(chainId, address);
      if (existingToken) return existingToken;
      return await this.fetchTokenMetadataEVM(evmProvider, address, chainId);
    } else if (addressType === 'solana') {
      if (!solanaConnection) {
        throw new Error('Solana connection is required for Solana address');
      }
      const existingToken = this.getTokenByAddress('mainnet-beta', address);
      if (existingToken) return existingToken;
      return await this.fetchTokenMetadataSolana(solanaConnection, address);
    }
    
    return null;
  }

  isValidTokenAddress(address: string, blockchainType: 'ethereum' | 'solana'): boolean {
    if (blockchainType === 'ethereum') {
      return EthereumHelpers.isValidAddress(address);
    } else {
      return SolanaHelpers.isValidAddress(address);
    }
  }

  getCustomTokens(): { [key: string]: Token[] } {
    return { ...this.customTokens };
  }

  clearCustomTokens(): void {
    this.customTokens = {};
  }

  clearCustomTokensForChain(chainIdOrNetwork: number | string): void {
    const customKey = typeof chainIdOrNetwork === 'number' 
      ? `evm-${chainIdOrNetwork}` 
      : `solana-${chainIdOrNetwork}`;
    delete this.customTokens[customKey];
  }
}