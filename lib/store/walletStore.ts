import { create } from 'zustand';
import { AssetBalance } from '../types';
import { connectFreighter } from '@/lib/stellar/freighter';

type Connector = 'freighter' | 'walletconnect' | null;

interface WalletState {
  address: string | null;
  isConnected: boolean;
  connector: Connector;
  network: 'mainnet' | 'testnet';
  balances: AssetBalance[];
  connect: (connector?: Connector) => Promise<void>;
  disconnect: () => void;
  refreshBalances: () => Promise<void>;
}

export const useWalletStore = create<WalletState>((set, get) => ({
  address: null,
  isConnected: false,
  connector: null,
  network: (process.env.NEXT_PUBLIC_STELLAR_NETWORK as 'mainnet' | 'testnet') || 'testnet',
  balances: [],

  // connect supports specifying a connector. Defaults to freighter when omitted.
  connect: async (connector: Connector = 'freighter') => {
    try {
      if (connector === 'freighter') {
        const address = await connectFreighter();
        if (address) {
          set({ address, isConnected: true, connector: 'freighter' });
          get().refreshBalances();
        } else {
          throw new Error('Freighter connection failed or was cancelled');
        }
      } else if (connector === 'walletconnect') {
        // Placeholder lightweight WalletConnect support: prompt for public key until full integration is added.
        // This avoids blocking the app if the WalletConnect runtime/integration isn't available yet.
        const manual = typeof window !== 'undefined' ? window.prompt('Paste your Stellar public key (WalletConnect placeholder):') : null;
        if (manual) {
          set({ address: manual, isConnected: true, connector: 'walletconnect' });
          get().refreshBalances();
        } else {
          throw new Error('WalletConnect placeholder: no key provided');
        }
      } else {
        throw new Error('Unsupported connector');
      }
    } catch (error) {
      console.error('Failed to connect wallet', error);
      throw error;
    }
  },

  disconnect: () => {
    set({ address: null, isConnected: false, connector: null, balances: [] });
  },

  refreshBalances: async () => {
    const { address } = get();
    if (!address) return;

    // TODO: replace mock data with actual Horizon queries
    set({
      balances: [
        { assetCode: 'USDC', balance: '14500.00', usdEquivalent: 14500.00 },
        { assetCode: 'XLM', balance: '250.50', usdEquivalent: 25.05 },
      ]
    });
  }
}));
