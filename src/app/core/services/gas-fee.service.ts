import { Injectable, signal } from '@angular/core';
import { ethers } from 'ethers';

@Injectable({
  providedIn: 'root'
})
export class GasFeeService {
  public gasPrice = signal<string>('0');  
  public totalFee = signal<string>('0');  

  constructor() {}

  async calculateGas(provider: ethers.BrowserProvider) {
    if (!provider) return;

    try {
      let feeData;

      try {
        // EIP-1559
        feeData = await provider.getFeeData();
      } catch (err) {
        console.warn('getFeeData falló, usando gasPrice clásico', err);

        // 🔹 Fallback usando provider.send("eth_gasPrice")
        const gasPriceStr = await provider.send("eth_gasPrice", []);
        const gasPriceBigInt = BigInt(gasPriceStr);
        feeData = { gasPrice: gasPriceBigInt };
      }

      const gasPrice = feeData.gasPrice ?? 0n;
      this.gasPrice.set(ethers.formatEther(gasPrice));

      const gasLimit = 21000n; // transferencia simple ETH
      const total = gasPrice * gasLimit;
      this.totalFee.set(ethers.formatEther(total));
    } catch (err) {
      console.warn('Error calculando gas:', err);
      this.gasPrice.set('0');
      this.totalFee.set('0');
    }
  }

  calculateMaxAmount(balance: string): string {
    const bal = parseFloat(balance || '0');
    const fee = parseFloat(this.totalFee() || '0');
    return Math.max(0, bal - fee).toString();
  }
}

