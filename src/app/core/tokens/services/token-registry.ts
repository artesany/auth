import { Injectable } from '@angular/core';
import { Token, TOKEN_LISTS, SOLANA_TOKEN_LISTS, SOLANA_COMMON_TOKENS, SOLANA_NETWORKS, detectAddressType, SolanaHelpers, EthereumHelpers } from '../../helpers/abi.helper';
import { Connection, PublicKey } from '@solana/web3.js';
import { ethers, Contract } from 'ethers';
import { getMint } from '@solana/spl-token';

// Interfaz específica para metadatos de token ERC-20, sin extender ethers.Contract
interface IERC20Metadata {
  name(): Promise<string>;
  symbol(): Promise<string>;
  decimals(): Promise<number>;
}

@Injectable({ providedIn: 'root' })
export class TokenRegistryService {
  private customTokens: { [key: string]: Token[] } = {};

  constructor() {}

  // Obtener tokens por chainId (EVM) o network (Solana)
  getTokens(chainIdOrNetwork: number | string): Token[] {
    let tokens: Token[] = [];
    
    if (typeof chainIdOrNetwork === 'number') {
      tokens = [...(TOKEN_LISTS[chainIdOrNetwork] || [])];
    } else {
      tokens = [...(SOLANA_TOKEN_LISTS[chainIdOrNetwork] || [])];
    }
    
    // Agregar tokens personalizados si existen
    const customKey = typeof chainIdOrNetwork === 'number' 
      ? `evm-${chainIdOrNetwork}` 
      : `solana-${chainIdOrNetwork}`;
    
    if (this.customTokens[customKey]) {
      tokens = [...tokens, ...this.customTokens[customKey]];
    }
    
    return tokens;
  }

  // Obtener token por dirección
  getTokenByAddress(chainIdOrNetwork: number | string, address: string): Token | undefined {
    const tokens = this.getTokens(chainIdOrNetwork);
    return tokens.find(token => 
      token.address.toLowerCase() === address.toLowerCase()
    );
  }

  // Obtener token nativo
  getNativeToken(chainIdOrNetwork: number | string): Token | undefined {
    const tokens = this.getTokens(chainIdOrNetwork);
    return tokens.find(token => token.isNative);
  }

  // Agregar token personalizado
  addCustomToken(chainIdOrNetwork: number | string, token: Token): void {
    const customKey = typeof chainIdOrNetwork === 'number' 
      ? `evm-${chainIdOrNetwork}` 
      : `solana-${chainIdOrNetwork}`;
    
    if (!this.customTokens[customKey]) {
      this.customTokens[customKey] = [];
    }
    
    // Verificar si el token ya existe
    const exists = this.customTokens[customKey].some(t => 
      t.address.toLowerCase() === token.address.toLowerCase()
    );
    
    if (!exists) {
      this.customTokens[customKey].push(token);
    }
  }

  // Obtener metadata de token desde blockchain (EVM)
  async fetchTokenMetadataEVM(
    provider: ethers.BrowserProvider,
    address: string,
    chainId: number
  ): Promise<Token | null> {
    try {
      // Si es la dirección nativa, devolver el token nativo
      if (address === '0xNative' || address === 'native') {
        return this.getNativeToken(chainId) || null;
      }

      // Crear contrato con tipos explícitos
      const contract = new Contract(address, [
        'function name() view returns (string)',
        'function symbol() view returns (string)',
        'function decimals() view returns (uint8)'
      ], provider) as unknown as IERC20Metadata;

      // Llamar a los métodos del contrato
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

  // Obtener metadata de token desde blockchain (Solana)
  async fetchTokenMetadataSolana(
    connection: Connection,
    address: string
  ): Promise<Token | null> {
    try {
      // Si es la dirección nativa, devolver SOL
      if (address === 'native' || address === SOLANA_COMMON_TOKENS.WSOL.address) {
        const mainnetToken = this.getNativeToken('mainnet-beta');
        return mainnetToken ? { ...mainnetToken, chainId: SOLANA_NETWORKS['mainnet-beta'].chainId } : null;
      }

      const publicKey = new PublicKey(address);
      
      // Obtener información del mint
      const mintInfo = await getMint(connection, publicKey);
      
      // En Solana, los metadatos como name y symbol requieren el programa de metadatos
      // Usamos valores predeterminados si no hay metadatos disponibles
      return {
        address,
        name: 'Unknown SPL Token',
        symbol: 'UNKNOWN',
        decimals: mintInfo.decimals,
        chainId: SOLANA_NETWORKS['mainnet-beta'].chainId,
        logoURI: undefined
      };
    } catch (error) {
      console.error('Error fetching Solana token metadata:', error);
      return null;
    }
  }

  // Buscar token por dirección (auto-detecta la blockchain)
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
      // Buscar en registros existentes primero
      const existingToken = this.getTokenByAddress(chainId, address);
      if (existingToken) return existingToken;
      
      // Si no existe, buscar en blockchain
      return await this.fetchTokenMetadataEVM(evmProvider, address, chainId);
    } 
    else if (addressType === 'solana') {
      if (!solanaConnection) {
        throw new Error('Solana connection is required for Solana address');
      }
      // Buscar en registros existentes primero
      const existingToken = this.getTokenByAddress('mainnet-beta', address);
      if (existingToken) return existingToken;
      
      // Si no existe, buscar en blockchain
      return await this.fetchTokenMetadataSolana(solanaConnection, address);
    }
    
    return null;
  }

  // Validar formato de dirección de token
  isValidTokenAddress(address: string, blockchainType: 'ethereum' | 'solana'): boolean {
    if (blockchainType === 'ethereum') {
      return EthereumHelpers.isValidAddress(address);
    } else {
      return SolanaHelpers.isValidAddress(address);
    }
  }

  // Obtener todos los tokens personalizados
  getCustomTokens(): { [key: string]: Token[] } {
    return { ...this.customTokens };
  }

  // Limpiar tokens personalizados
  clearCustomTokens(): void {
    this.customTokens = {};
  }

  // Limpiar tokens personalizados de una blockchain específica
  clearCustomTokensForChain(chainIdOrNetwork: number | string): void {
    const customKey = typeof chainIdOrNetwork === 'number' 
      ? `evm-${chainIdOrNetwork}` 
      : `solana-${chainIdOrNetwork}`;
    
    delete this.customTokens[customKey];
  }
}