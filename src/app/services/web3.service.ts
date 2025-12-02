import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export interface NetworkInfo {
  chainId: string;
  name: string;
  isSupported: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class Web3Service {
  private walletAddressSubject = new BehaviorSubject<string | null>(null);
  private networkSubject = new BehaviorSubject<NetworkInfo | null>(null);
  private isConnectedSubject = new BehaviorSubject<boolean>(false);

  public walletAddress$: Observable<string | null> = this.walletAddressSubject.asObservable();
  public network$: Observable<NetworkInfo | null> = this.networkSubject.asObservable();
  public isConnected$: Observable<boolean> = this.isConnectedSubject.asObservable();

  private supportedNetworks: { [key: string]: string } = {
    '0x1': 'Ethereum Mainnet',
    '0x5': 'Goerli Testnet',
    '0xaa36a7': 'Sepolia Testnet',
    '0x89': 'Polygon Mainnet',
    '0x13881': 'Polygon Mumbai Testnet',
    '0x38': 'BSC Mainnet',
    '0x61': 'BSC Testnet'
  };

  constructor() {
    this.initializeListeners();
  }

  /**
   * Check if MetaMask is installed
   */
  isMetaMaskInstalled(): boolean {
    return typeof window.ethereum !== 'undefined';
  }

  /**
   * Connect to MetaMask wallet
   */
  async connectWallet(): Promise<void> {
    if (!this.isMetaMaskInstalled()) {
      throw new Error('MetaMask is not installed. Please install MetaMask extension.');
    }

    try {
      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });

      if (accounts && accounts.length > 0) {
        this.walletAddressSubject.next(accounts[0]);
        this.isConnectedSubject.next(true);
        
        // Get current network
        await this.updateNetwork();
      }
    } catch (error: any) {
      console.error('Error connecting to MetaMask:', error);
      
      if (error.code === 4001) {
        throw new Error('User rejected the connection request.');
      } else {
        throw new Error('Failed to connect to MetaMask. Please try again.');
      }
    }
  }

  /**
   * Disconnect wallet
   */
  disconnectWallet(): void {
    this.walletAddressSubject.next(null);
    this.networkSubject.next(null);
    this.isConnectedSubject.next(false);
  }

  /**
   * Update network information
   */
  private async updateNetwork(): Promise<void> {
    if (!this.isMetaMaskInstalled()) return;

    try {
      const chainId = await window.ethereum.request({ 
        method: 'eth_chainId' 
      });

      const networkInfo: NetworkInfo = {
        chainId,
        name: this.supportedNetworks[chainId] || 'Unknown Network',
        isSupported: chainId in this.supportedNetworks
      };

      this.networkSubject.next(networkInfo);
    } catch (error) {
      console.error('Error getting network information:', error);
    }
  }

  /**
   * Initialize event listeners for MetaMask
   */
  private initializeListeners(): void {
    if (!this.isMetaMaskInstalled()) return;

    // Listen for account changes
    window.ethereum.on('accountsChanged', (accounts: string[]) => {
      if (accounts.length === 0) {
        // User disconnected their wallet
        this.disconnectWallet();
      } else {
        // User switched accounts
        this.walletAddressSubject.next(accounts[0]);
        this.isConnectedSubject.next(true);
      }
    });

    // Listen for network/chain changes
    window.ethereum.on('chainChanged', (chainId: string) => {
      // Reload the page as recommended by MetaMask
      // Or update the network info
      this.updateNetwork();
    });

    // Listen for disconnection
    window.ethereum.on('disconnect', () => {
      this.disconnectWallet();
    });
  }

  /**
   * Get current wallet address
   */
  getCurrentAddress(): string | null {
    return this.walletAddressSubject.value;
  }

  /**
   * Get current network
   */
  getCurrentNetwork(): NetworkInfo | null {
    return this.networkSubject.value;
  }

  /**
   * Shorten wallet address for display
   */
  shortenAddress(address: string): string {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  }

  /**
   * Check if wallet is connected
   */
  isWalletConnected(): boolean {
    return this.isConnectedSubject.value;
  }

  /**
   * Get balance of connected wallet
   */
  async getBalance(): Promise<string> {
    if (!this.isMetaMaskInstalled() || !this.getCurrentAddress()) {
      throw new Error('Wallet not connected');
    }

    try {
      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [this.getCurrentAddress(), 'latest']
      });

      // Convert from wei to ether
      const balanceInEther = parseInt(balance, 16) / Math.pow(10, 18);
      return balanceInEther.toFixed(4);
    } catch (error) {
      console.error('Error getting balance:', error);
      throw new Error('Failed to get wallet balance');
    }
  }
}