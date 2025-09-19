// services/token-price.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, timer, throwError, of } from 'rxjs';
import { catchError, map, tap, retry } from 'rxjs/operators';

export interface TokenPrice {
  id: string;
  symbol: string;
  name: string;
  blockchain: string;
  current_price: number;
  price_change_24h: number;
  last_updated: Date;
  image?: string;
}

interface CoinGeckoResponse {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_24h: number;
  last_updated: string;
}

@Injectable({
  providedIn: 'root'
})
export class TokenPriceService {
  private prices$ = new BehaviorSubject<TokenPrice[]>([]);
  private loading$ = new BehaviorSubject<boolean>(true);
  private error$ = new BehaviorSubject<string | null>(null);
  private lastUpdate$ = new BehaviorSubject<Date | null>(null);
  
  private readonly updateInterval = 60 * 60 * 1000;
  private readonly apiUrl = 'https://api.coingecko.com/api/v3/coins/markets';
  private readonly cacheDuration = 5 * 60 * 1000;

  private cache: TokenPrice[] = [];
  private lastFetchTime: number = 0;

  public currentPrices$ = this.prices$.asObservable();
  public loadingState$ = this.loading$.asObservable();
  public errorState$ = this.error$.asObservable();
  public lastUpdateState$ = this.lastUpdate$.asObservable();

  constructor(private http: HttpClient) {
    this.initializeService();
  }

  private initializeService(): void {
    this.loading$.next(true);
    this.loadInitialPrices().subscribe({
      next: (prices) => {
        this.loading$.next(false);
      },
      error: (error) => {
        this.loading$.next(false);
        this.error$.next('Error inicializando servicio');
      }
    });
    this.setupAutoUpdate();
  }

  private loadInitialPrices(): Observable<TokenPrice[]> {
    if (this.isCacheValid()) {
      this.prices$.next(this.cache);
      this.lastUpdate$.next(new Date(this.lastFetchTime));
      return of(this.cache);
    }
    return this.fetchTokenPrices();
  }

  private setupAutoUpdate(): void {
    timer(this.updateInterval, this.updateInterval).subscribe(() => {
      this.fetchTokenPrices().subscribe();
    });
  }

  public refreshPrices(): Observable<TokenPrice[]> {
    return this.fetchTokenPrices();
  }

  private fetchTokenPrices(): Observable<TokenPrice[]> {
    this.loading$.next(true);
    this.error$.next(null);

    const params = new HttpParams()
      .set('vs_currency', 'usd')
      .set('order', 'market_cap_desc')
      .set('per_page', '50')
      .set('page', '1')
      .set('sparkline', 'false')
      .set('price_change_percentage', '24h');

    return this.http.get<CoinGeckoResponse[]>(this.apiUrl, { params }).pipe(
      map(response => this.processApiResponse(response)),
      tap(prices => {
        this.cache = prices;
        this.lastFetchTime = Date.now();
        this.prices$.next(prices);
        this.lastUpdate$.next(new Date());
        this.loading$.next(false);
      }),
      retry(2),
      catchError(error => this.handleError(error))
    );
  }

  private processApiResponse(response: CoinGeckoResponse[]): TokenPrice[] {
    const uniqueBlockchains = new Set<string>();
    const processedTokens: TokenPrice[] = [];

    for (const token of response) {
      const blockchain = this.mapSymbolToBlockchain(token.symbol);
      
      if (!uniqueBlockchains.has(blockchain) && token.current_price > 0) {
        uniqueBlockchains.add(blockchain);
        
        processedTokens.push({
          id: token.id,
          symbol: token.symbol.toUpperCase(),
          name: token.name,
          blockchain: blockchain,
          current_price: token.current_price,
          price_change_24h: token.price_change_24h || 0,
          last_updated: new Date(token.last_updated),
          image: token.image
        });

        if (processedTokens.length >= 20) break;
      }
    }
    return processedTokens;
  }

  private mapSymbolToBlockchain(symbol: string): string {
    const blockchainMap: { [key: string]: string } = {
      'eth': 'Ethereum', 'btc': 'Bitcoin', 'bnb': 'Binance', 'sol': 'Solana',
      'matic': 'Polygon', 'ada': 'Cardano', 'xrp': 'Ripple', 'dot': 'Polkadot',
      'doge': 'Dogecoin', 'avax': 'Avalanche', 'link': 'Chainlink', 'ltc': 'Litecoin',
      'atom': 'Cosmos', 'uni': 'Uniswap', 'usdt': 'Tether', 'usdc': 'USD Coin',
      'busd': 'Binance USD', 'dai': 'DAI', 'shib': 'Shiba Inu'
    };
    return blockchainMap[symbol.toLowerCase()] || symbol.toUpperCase();
  }

  private isCacheValid(): boolean {
    return this.cache.length > 0 && (Date.now() - this.lastFetchTime) < this.cacheDuration;
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    const errorMessage = error.status 
      ? `Error ${error.status}: ${error.message}`
      : 'Error desconocido al obtener precios';

    this.error$.next(errorMessage);
    this.loading$.next(false);

    if (this.cache.length > 0) {
      this.prices$.next(this.cache);
    }

    return throwError(() => new Error(errorMessage));
  }

  public getTokenPrice(symbol: string): number | null {
    const token = this.cache.find(t => t.symbol === symbol.toUpperCase());
    return token ? token.current_price : null;
  }
}