import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Token, TokenBalance } from '../../models/token.model';
import { TokenService } from '../../../core/tokens/services/token-service';
import { TokenRegistryService } from '../../tokens/services/token-registry';
import { Subscription } from 'rxjs';
import { ethers } from 'ethers';
import { Connection } from '@solana/web3.js';

@Component({
  selector: 'app-token-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './token-selector.html',
  styleUrls: ['./token-selector.scss']
})
export class TokenSelector implements OnInit, OnDestroy {
  @Input() blockchain: 'ethereum' | 'solana' = 'ethereum';
  @Input() chainIdOrNetwork: number | string = 1;
  @Input() account: string | null = null;
  @Input() provider: ethers.BrowserProvider | null = null;
  @Input() connection: Connection | null = null;
  @Output() tokenSelected = new EventEmitter<Token>();
  
  tokens: TokenBalance[] = [];
  selectedToken: Token | null = null;
  isLoading = false;
  searchTerm = '';
  
  private balancesSubscription: Subscription | null = null;

  constructor(
    private tokenService: TokenService,
    private tokenRegistry: TokenRegistryService
  ) {}

  async ngOnInit() {
    await this.loadTokens();
  }

  ngOnDestroy() {
    if (this.balancesSubscription) {
      this.balancesSubscription.unsubscribe();
    }
  }

  async loadTokens() {
    if (!this.account || (this.blockchain === 'ethereum' && !this.provider) || (this.blockchain === 'solana' && !this.connection)) {
      this.tokens = this.tokenRegistry.getTokens(this.chainIdOrNetwork).map(token => ({
        token,
        balance: '0',
        formattedBalance: '0'
      }));
      return;
    }
    
    this.isLoading = true;
    try {
      this.tokens = await this.tokenService.getTokenBalances(
        this.blockchain,
        this.blockchain === 'ethereum' ? this.provider! : this.connection!,
        this.account,
        this.chainIdOrNetwork
      );
      
      const nativeToken = this.tokens.find(t => t.token.isNative);
      if (nativeToken) {
        this.selectToken(nativeToken.token);
      }
    } catch (error) {
      console.error('Error loading tokens:', error);
      this.tokens = this.tokenRegistry.getTokens(this.chainIdOrNetwork).map(token => ({
        token,
        balance: '0',
        formattedBalance: '0'
      }));
    } finally {
      this.isLoading = false;
    }
  }

  selectToken(token: Token) {
    this.selectedToken = token;
    this.tokenSelected.emit(token);
  }

  get filteredTokens(): TokenBalance[] {
    if (!this.searchTerm) {
      return this.tokens;
    }
    
    const searchLower = this.searchTerm.toLowerCase();
    return this.tokens.filter(tokenBalance => 
      tokenBalance.token.name.toLowerCase().includes(searchLower) ||
      tokenBalance.token.symbol.toLowerCase().includes(searchLower) ||
      tokenBalance.token.address.toLowerCase().includes(searchLower)
    );
  }

  async refreshBalances() {
    await this.loadTokens();
  }

  onSearchChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value;
  }

  clearSearch() {
    this.searchTerm = '';
  }

  getTokenDisplay(tokenBalance: TokenBalance): string {
    return `${tokenBalance.token.symbol} - ${tokenBalance.formattedBalance}`;
  }

  trackByTokenAddress(index: number, tokenBalance: TokenBalance): string {
    return tokenBalance.token.address;
  }
}