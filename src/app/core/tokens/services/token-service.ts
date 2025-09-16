import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import { Connection, PublicKey, LAMPORTS_PER_SOL, Transaction, SystemProgram } from '@solana/web3.js';
import { Token, TokenBalance } from '../../models/token.model';
import { TokenRegistryService } from '../../tokens/services/token-registry';
import { SolanaHelpers, EthereumHelpers, ERC20_ABI } from '../../helpers/abi.helper';

@Injectable({ providedIn: 'root' })
export class TokenService {
  constructor(private tokenRegistry: TokenRegistryService) {}

  // ============ ETHEREUM METHODS ============

  /**
   * Obtener balances de tokens ERC-20
   */
  async getTokenBalancesEVM(
    provider: ethers.BrowserProvider,
    address: string,
    chainId: number
  ): Promise<TokenBalance[]> {
    try {
      const tokens = this.tokenRegistry.getTokens(chainId);
      const balances: TokenBalance[] = [];

      for (const token of tokens) {
        try {
          if (token.isNative) {
            // Balance de moneda nativa
            const balance = await provider.getBalance(address);
            balances.push({
              token,
              balance: balance.toString(),
              formattedBalance: ethers.formatEther(balance)
            });
          } else {
            // Balance de token ERC-20
            const contract = new ethers.Contract(token.address, ERC20_ABI, provider);
            const balance = await contract['balanceOf'](address);
            const decimals = await contract['decimals']();
            
            balances.push({
              token,
              balance: balance.toString(),
              formattedBalance: ethers.formatUnits(balance, decimals)
            });
          }
        } catch (error) {
          console.warn(`Error fetching balance for ${token.symbol}:`, error);
          // Si hay error, agregar balance 0
          balances.push({
            token,
            balance: '0',
            formattedBalance: '0'
          });
        }
      }

      return balances;
    } catch (error) {
      console.error('Error fetching EVM token balances:', error);
      throw new Error(`Failed to fetch token balances: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Transferir tokens ERC-20
   */
  async transferTokenEVM(
    signer: ethers.Signer,
    token: Token,
    to: string,
    amount: string
  ): Promise<ethers.TransactionResponse> {
    try {
      if (token.isNative) {
        // Transferencia de moneda nativa
        return await signer.sendTransaction({
          to,
          value: ethers.parseEther(amount)
        });
      } else {
        // Transferencia de token ERC-20
        const contract = new ethers.Contract(token.address, ERC20_ABI, signer);
        const decimals = await contract['decimals']();
        const parsedAmount = ethers.parseUnits(amount, decimals);
        
        return await contract['transfer'](to, parsedAmount);
      }
    } catch (error) {
      console.error('Error transferring EVM tokens:', error);
      throw new Error(`Failed to transfer tokens: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Obtener balance de un token ERC-20 específico
   */
  async getTokenBalanceEVM(
    provider: ethers.BrowserProvider,
    address: string,
    token: Token
  ): Promise<TokenBalance> {
    try {
      if (token.isNative) {
        const balance = await provider.getBalance(address);
        return {
          token,
          balance: balance.toString(),
          formattedBalance: ethers.formatEther(balance)
        };
      } else {
        const contract = new ethers.Contract(token.address, ERC20_ABI, provider);
        const balance = await contract['balanceOf'](address);
        const decimals = await contract['decimals']();
        
        return {
          token,
          balance: balance.toString(),
          formattedBalance: ethers.formatUnits(balance, decimals)
        };
      }
    } catch (error) {
      console.error('Error getting EVM token balance:', error);
      return {
        token,
        balance: '0',
        formattedBalance: '0'
      };
    }
  }

  // ============ SOLANA METHODS ============

  /**
   * Obtener balances de tokens SPL
   */
  async getTokenBalancesSolana(
    connection: Connection,
    address: string,
    network: string
  ): Promise<TokenBalance[]> {
    try {
      const tokens = this.tokenRegistry.getTokens(network);
      const balances: TokenBalance[] = [];
      const publicKey = new PublicKey(address);

      for (const token of tokens) {
        try {
          if (token.isNative) {
            // Balance de SOL nativo
            const balance = await connection.getBalance(publicKey);
            balances.push({
              token,
              balance: balance.toString(),
              formattedBalance: (balance / LAMPORTS_PER_SOL).toString()
            });
          } else {
            // Para tokens SPL, implementación simplificada
            // En producción, usarías @solana/spl-token para obtener balances reales
            const simulatedBalance = Math.random() > 0.5 ? '1000000000' : '0'; // Balance simulado
            balances.push({
              token,
              balance: simulatedBalance,
              formattedBalance: SolanaHelpers.fromLamports(BigInt(simulatedBalance), token.decimals)
            });
          }
        } catch (error) {
          console.warn(`Error fetching balance for ${token.symbol}:`, error);
          balances.push({
            token,
            balance: '0',
            formattedBalance: '0'
          });
        }
      }

      return balances;
    } catch (error) {
      console.error('Error fetching Solana token balances:', error);
      throw new Error(`Failed to fetch Solana token balances: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Transferir tokens SPL
   */
  async transferTokenSolana(
    connection: Connection,
    wallet: any,
    token: Token,
    to: string,
    amount: string
  ): Promise<string> {
    try {
      const fromPublicKey = new PublicKey(wallet.publicKey);
      const toPublicKey = new PublicKey(to);

      if (token.isNative) {
        // Transferencia de SOL nativo
        const transaction = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: fromPublicKey,
            toPubkey: toPublicKey,
            lamports: BigInt(parseFloat(amount) * LAMPORTS_PER_SOL)
          })
        );

        const { blockhash } = await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = fromPublicKey;

        const signedTransaction = await wallet.signTransaction(transaction);
        const signature = await connection.sendRawTransaction(signedTransaction.serialize());
        
        await connection.confirmTransaction(signature);
        return signature;
      } else {
        // Para tokens SPL, implementación simplificada
        console.log('Simulating SPL token transfer...');
        
        // Simular un retraso de transacción
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Devolver un hash de transacción simulado
        return '5'.repeat(64); // Hash simulado
      }
    } catch (error) {
      console.error('Error transferring Solana tokens:', error);
      throw new Error(`Failed to transfer Solana tokens: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Obtener balance de un token SPL específico
   */
  async getTokenBalanceSolana(
    connection: Connection,
    address: string,
    token: Token
  ): Promise<TokenBalance> {
    try {
      const publicKey = new PublicKey(address);
      
      if (token.isNative) {
        const balance = await connection.getBalance(publicKey);
        return {
          token,
          balance: balance.toString(),
          formattedBalance: (balance / LAMPORTS_PER_SOL).toString()
        };
      } else {
        // Para tokens SPL, implementación simplificada
        const simulatedBalance = Math.random() > 0.3 ? '500000000' : '0'; // Balance simulado
        return {
          token,
          balance: simulatedBalance,
          formattedBalance: SolanaHelpers.fromLamports(BigInt(simulatedBalance), token.decimals)
        };
      }
    } catch (error) {
      console.error('Error getting Solana token balance:', error);
      return {
        token,
        balance: '0',
        formattedBalance: '0'
      };
    }
  }

  // ============ UNIVERSAL METHODS ============

  /**
   * Obtener balances según blockchain
   */
  async getTokenBalances(
    blockchain: 'ethereum' | 'solana',
    provider: ethers.BrowserProvider | Connection,
    address: string,
    chainIdOrNetwork: number | string
  ): Promise<TokenBalance[]> {
    if (blockchain === 'ethereum') {
      return this.getTokenBalancesEVM(
        provider as ethers.BrowserProvider,
        address,
        chainIdOrNetwork as number
      );
    } else {
      return this.getTokenBalancesSolana(
        provider as Connection,
        address,
        chainIdOrNetwork as string
      );
    }
  }

  /**
   * Transferir tokens según blockchain
   */
  async transferToken(
    blockchain: 'ethereum' | 'solana',
    signer: any,
    token: Token,
    to: string,
    amount: string,
    connection?: Connection
  ): Promise<any> {
    if (blockchain === 'ethereum') {
      return this.transferTokenEVM(signer, token, to, amount);
    } else {
      if (!connection) {
        throw new Error('Connection parameter is required for Solana transfers');
      }
      return this.transferTokenSolana(connection, signer, token, to, amount);
    }
  }

  /**
   * Obtener balance de un token específico
   */
  async getTokenBalance(
    blockchain: 'ethereum' | 'solana',
    provider: ethers.BrowserProvider | Connection,
    address: string,
    token: Token
  ): Promise<TokenBalance> {
    if (blockchain === 'ethereum') {
      return this.getTokenBalanceEVM(
        provider as ethers.BrowserProvider,
        address,
        token
      );
    } else {
      return this.getTokenBalanceSolana(
        provider as Connection,
        address,
        token
      );
    }
  }

  /**
   * Verificar si una dirección es válida para la blockchain
   */
  isValidAddress(address: string, blockchain: 'ethereum' | 'solana'): boolean {
    if (blockchain === 'ethereum') {
      return EthereumHelpers.isValidAddress(address);
    } else {
      return SolanaHelpers.isValidAddress(address);
    }
  }

  /**
   * Formatear cantidad según decimales del token
   */
  formatAmount(amount: string, decimals: number): string {
    try {
      if (amount.includes('.')) {
        const [integer, fractional] = amount.split('.');
        return `${integer}.${fractional.padEnd(decimals, '0').slice(0, decimals)}`;
      }
      return amount;
    } catch (error) {
      console.error('Error formatting amount:', error);
      return amount;
    }
  }

  /**
   * Convertir cantidad a unidades base (wei, lamports)
   */
  toBaseUnits(amount: string, decimals: number): bigint {
    try {
      if (amount.includes('.')) {
        const [integer, fractional] = amount.split('.');
        const fractionalPart = fractional.padEnd(decimals, '0').slice(0, decimals);
        return BigInt(integer + fractionalPart);
      }
      return BigInt(amount + '0'.repeat(decimals));
    } catch (error) {
      console.error('Error converting to base units:', error);
      return BigInt(0);
    }
  }

  /**
   * Convertir desde unidades base (wei, lamports)
   */
  fromBaseUnits(amount: bigint, decimals: number): string {
    try {
      const amountStr = amount.toString().padStart(decimals + 1, '0');
      const integerPart = amountStr.slice(0, -decimals) || '0';
      const fractionalPart = amountStr.slice(-decimals).replace(/0+$/, '');
      
      return fractionalPart ? `${integerPart}.${fractionalPart}` : integerPart;
    } catch (error) {
      console.error('Error converting from base units:', error);
      return '0';
    }
  }

  /**
   * Obtener información de gas para transacción Ethereum
   */
  async getGasInfoEVM(
    provider: ethers.BrowserProvider,
    from: string,
    to: string,
    value: string
  ): Promise<{
    gasPrice: string;
    gasLimit: string;
    estimatedFee: string;
  }> {
    try {
      const gasPrice = await provider.getFeeData();
      const transaction = {
        from,
        to,
        value: ethers.parseEther(value)
      };
      const gasLimit = await provider.estimateGas(transaction);

      const estimatedFee = gasPrice.gasPrice! * gasLimit;

      return {
        gasPrice: ethers.formatUnits(gasPrice.gasPrice!, 'gwei'),
        gasLimit: gasLimit.toString(),
        estimatedFee: ethers.formatEther(estimatedFee)
      };
    } catch (error) {
      console.error('Error getting gas info:', error);
      throw new Error(`Failed to get gas info: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Obtener información de fee para transacción Solana
   */
  async getFeeInfoSolana(connection: Connection): Promise<{
    feePerSignature: number;
    recentBlockhash: string;
  }> {
    try {
      const feeCalculator = await connection.getFeeCalculatorForBlockhash(
        (await connection.getRecentBlockhash()).blockhash
      );
      
      return {
        feePerSignature: feeCalculator.value?.lamportsPerSignature || 5000,
        recentBlockhash: (await connection.getRecentBlockhash()).blockhash
      };
    } catch (error) {
      console.error('Error getting fee info:', error);
      return {
        feePerSignature: 5000,
        recentBlockhash: ''
      };
    }
  }
}