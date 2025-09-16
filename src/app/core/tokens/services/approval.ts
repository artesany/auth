import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import { Connection, Transaction, PublicKey, SystemProgram } from '@solana/web3.js';
import { ERC20_ABI } from '../../helpers/abi.helper';
import { Token } from '../../models/token.model';

@Injectable({ providedIn: 'root' })
export class ApprovalService {

  constructor() {}

  // ============ ETHEREUM METHODS ============

  /**
   * Verificar allowance de un token ERC-20
   */
  async checkAllowanceEVM(
    provider: ethers.BrowserProvider,
    tokenAddress: string,
    owner: string,
    spender: string
  ): Promise<string> {
    try {
      const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
      
      // Usar notación de corchetes para acceder a métodos desde ABI
      const allowance = await contract['allowance'](owner, spender);
      return allowance.toString();
    } catch (error) {
      console.error('Error checking allowance:', error);
      throw new Error(`Failed to check allowance: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Aprobar gasto de tokens ERC-20
   */
  async approveEVM(
    signer: ethers.Signer,
    tokenAddress: string,
    spender: string,
    amount: string
  ): Promise<ethers.TransactionResponse> {
    try {
      const contract = new ethers.Contract(tokenAddress, ERC20_ABI, signer);
      
      // Obtener decimales del token usando notación de corchetes
      const decimals = await contract['decimals']();
      const parsedAmount = ethers.parseUnits(amount, decimals);
      
      // Usar notación de corchetes para approve
      return await contract['approve'](spender, parsedAmount);
    } catch (error) {
      console.error('Error approving tokens:', error);
      throw new Error(`Failed to approve tokens: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Aprobar cantidad infinita de tokens ERC-20
   */
  async approveInfiniteEVM(
    signer: ethers.Signer,
    tokenAddress: string,
    spender: string
  ): Promise<ethers.TransactionResponse> {
    try {
      const contract = new ethers.Contract(tokenAddress, ERC20_ABI, signer);
      const maxAmount = ethers.MaxUint256;
      
      // Usar notación de corchetes para approve
      return await contract['approve'](spender, maxAmount);
    } catch (error) {
      console.error('Error approving infinite tokens:', error);
      throw new Error(`Failed to approve infinite tokens: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // ============ SOLANA METHODS ============

  /**
   * Verificar allowance de un token SPL (implementación simplificada)
   */
  async checkAllowanceSolana(
    connection: Connection,
    tokenAddress: string,
    owner: string,
    spender: string
  ): Promise<string> {
    try {
      // En Solana, el concepto de "allowance" es diferente
      // Esta es una implementación simplificada
      return '1000000000000000000'; // 1e18 como valor por defecto
    } catch (error) {
      console.error('Error checking Solana allowance:', error);
      throw new Error(`Failed to check Solana allowance: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Aprobar gasto de tokens SPL (implementación simplificada)
   */
  async approveSolana(
    connection: Connection,
    wallet: any,
    tokenAddress: string,
    spender: string,
    amount: string
  ): Promise<string> {
    try {
      // Implementación simplificada
      console.log('Simulating Solana approval...');
      
      // Simular un retraso de transacción
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Devolver un hash de transacción simulado
      return '5'.repeat(64);
    } catch (error) {
      console.error('Error approving Solana tokens:', error);
      throw new Error(`Failed to approve Solana tokens: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // ============ UNIVERSAL METHODS ============

  /**
   * Verificar si se necesita approval
   */
  async needsApproval(
    blockchain: 'ethereum' | 'solana',
    provider: ethers.BrowserProvider | Connection,
    token: Token,
    owner: string,
    spender: string,
    requiredAmount: string
  ): Promise<boolean> {
    try {
      if (blockchain === 'ethereum') {
        const currentAllowance = await this.checkAllowanceEVM(
          provider as ethers.BrowserProvider,
          token.address,
          owner,
          spender
        );

        const requiredAmountWei = ethers.parseUnits(requiredAmount, token.decimals);
        return BigInt(currentAllowance) < requiredAmountWei;
      } else {
        // Para Solana, simplificamos la verificación
        return true;
      }
    } catch (error) {
      console.error('Error checking approval needs:', error);
      return true;
    }
  }

  /**
   * Obtener transacción de approval
   */
  async getApprovalTransaction(
    blockchain: 'ethereum' | 'solana',
    signer: any,
    token: Token,
    spender: string,
    amount: string,
    infinite: boolean = false
  ): Promise<any> {
    if (blockchain === 'ethereum') {
      if (infinite) {
        return this.approveInfiniteEVM(signer, token.address, spender);
      } else {
        return this.approveEVM(signer, token.address, spender, amount);
      }
    } else {
      throw new Error('Solana approval requires connection and wallet parameters. Use approveSolana directly.');
    }
  }
}