import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { NetworkInfo, Web3Service } from '../../services/web3.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit, OnDestroy {
  walletAddress: string | null = null;
  shortenedAddress: string = '';
  network: NetworkInfo | null = null;
  isConnected: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';
  balance: string = '';

  private destroy$ = new Subject<void>();

  constructor(private web3Service: Web3Service) {}

  ngOnInit(): void {
    this.subscribeToWalletChanges();
    this.subscribeToNetworkChanges();
    this.subscribeToConnectionStatus();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Subscribe to wallet address changes
   */
  private subscribeToWalletChanges(): void {
    this.web3Service.walletAddress$
      .pipe(takeUntil(this.destroy$))
      .subscribe((address: string | null) => {
        this.walletAddress = address;
        if (address) {
          this.shortenedAddress = this.web3Service.shortenAddress(address);
          this.loadBalance();
        } else {
          this.shortenedAddress = '';
          this.balance = '';
        }
      });
  }

  /**
   * Subscribe to network changes
   */
  private subscribeToNetworkChanges(): void {
    this.web3Service.network$
      .pipe(takeUntil(this.destroy$))
      .subscribe((network: NetworkInfo | null) => {
        this.network = network;
        
        // Show warning if network is not supported
        if (network && !network.isSupported) {
          this.errorMessage = `Warning: You are connected to an unsupported network (${network.name || 'Unknown'}). Please switch to a supported network.`;
        } else {
          this.errorMessage = '';
        }
      });
  }

  /**
   * Subscribe to connection status
   */
  private subscribeToConnectionStatus(): void {
    this.web3Service.isConnected$
      .pipe(takeUntil(this.destroy$))
      .subscribe((connected: boolean) => {
        this.isConnected = connected;
      });
  }

  /**
   * Connect to MetaMask wallet
   */
  async connectWallet(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';

    try {
      await this.web3Service.connectWallet();
    } catch (error: any) {
      console.error('Connection error:', error);
      this.errorMessage = error.message || 'Failed to connect wallet';
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Disconnect wallet
   */
  disconnectWallet(): void {
    this.web3Service.disconnectWallet();
    this.errorMessage = '';
  }

  /**
   * Load wallet balance
   */
  private async loadBalance(): Promise<void> {
    try {
      this.balance = await this.web3Service.getBalance();
    } catch (error) {
      console.error('Error loading balance:', error);
    }
  }

  /**
   * Copy address to clipboard
   */
  copyAddress(): void {
    if (this.walletAddress) {
      navigator.clipboard.writeText(this.walletAddress).then(() => {
        // Show a temporary success message
        const originalMessage = this.errorMessage;
        this.errorMessage = '✓ Address copied to clipboard!';
        setTimeout(() => {
          this.errorMessage = originalMessage;
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy address:', err);
      });
    }
  }

  /**
   * Get network badge color based on support status
   */
  getNetworkBadgeClass(): string {
    if (!this.network) return 'badge-secondary';
    return this.network.isSupported ? 'badge-success' : 'badge-warning';
  }
}