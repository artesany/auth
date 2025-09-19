import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TokenPriceService } from '../../../services/token-price.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
  imports: [CommonModule, FormsModule]
})
export class Home implements OnInit, OnDestroy {
  loading = true;
  tokens: any[] = [];
  selectedToken = '';
  amount: number = 0;
  totalAmount: number = 0;
  receivedTokens: number = 0;
  
  private subscription: Subscription = new Subscription();

  constructor(
    private router: Router,
    private tokenPriceService: TokenPriceService
  ) {}

  ngOnInit() {
    this.subscription.add(
      this.tokenPriceService.currentPrices$.subscribe(tokens => {
        this.tokens = tokens;
        if (tokens.length > 0 && !this.selectedToken) {
          this.selectedToken = tokens[0].symbol;
          this.calculateConversion();
        }
      })
    );

    this.subscription.add(
      this.tokenPriceService.loadingState$.subscribe(loading => {
        this.loading = loading;
      })
    );
  }

  onTokenChange() {
    this.calculateConversion();
  }

  onAmountChange() {
    this.calculateConversion();
  }

  calculateConversion() {
    if (!this.selectedToken || this.amount <= 0) {
      this.totalAmount = 0;
      this.receivedTokens = 0;
      return;
    }

    const token = this.tokens.find(t => t.symbol === this.selectedToken);
    if (token) {
      this.totalAmount = this.amount * token.current_price;
      // 1 MyToken = 1 USD (ajusta según tu lógica de negocio)
      this.receivedTokens = this.totalAmount;
    }
  }

  initiatePurchase() {
    if (this.amount <= 0 || !this.selectedToken) {
      alert('Por favor, selecciona un token y una cantidad válida');
      return;
    }

    const selectedTokenData = this.tokens.find(t => t.symbol === this.selectedToken);
    
    const purchaseData = {
      cryptoAmount: this.amount,
      cryptoToken: this.selectedToken,
      cryptoPrice: selectedTokenData.current_price,
      totalUSD: this.totalAmount,
      myTokensToReceive: this.receivedTokens,
      timestamp: new Date()
    };

    // Guardar datos para usar en el proceso de pago
    localStorage.setItem('currentPurchase', JSON.stringify(purchaseData));
    
    // Aquí iría tu lógica específica de pago
    console.log('Iniciando compra:', purchaseData);
    
    // Ejemplo de lógica de pago:
    this.processPayment(purchaseData);
  }

  private processPayment(purchaseData: any) {
    // Tu lógica específica de procesamiento de pago
    // Esto podría ser:
    // - Conexión con wallet
    // - Redirección a pasarela de pago
    // - Confirmación de transacción
    // - etc.
    
    console.log('Procesando pago con:', purchaseData);
    
    // Ejemplo: después de procesar el pago, redirigir
    this.router.navigate(['/payment-confirmation'], {
      state: { purchaseData }
    }).catch(err => {
      console.error('Error en navegación:', err);
    });
  }

  goToPay() {
    // Este método separado para la navegación que mencionaste
    this.router.navigate(['/pago-wallets']).catch(err => {
      console.error('Error al navegar a Wallets:', err);
    });
  }

  refreshPrices() {
    this.tokenPriceService.refreshPrices().subscribe({
      next: () => console.log('Precios actualizados'),
      error: (err) => console.error('Error:', err)
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}