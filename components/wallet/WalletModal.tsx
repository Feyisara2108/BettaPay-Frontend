"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useWalletStore } from '@/lib/store/walletStore';
import { toast } from 'sonner';

export function WalletModal({ open, onOpenChange, onConnected }: { open: boolean; onOpenChange: (v: boolean) => void; onConnected?: (address: string) => void }) {
  const connect = useWalletStore((s) => s.connect);

  const handleFreighter = async () => {
    try {
      await connect('freighter');
      const address = useWalletStore.getState().address;
      if (address) {
        toast.success('Connected with Freighter');
        onOpenChange(false);
        onConnected?.(address);
      } else {
        toast.error('Freighter connected but no address available');
      }
    } catch (e) {
      console.error(e);
      toast.error('Freighter connection failed');
    }
  };

  const handleWalletConnect = async () => {
    try {
      // Placeholder: prompt for public key until full WalletConnect integration is added
      await connect('walletconnect');
      const address = useWalletStore.getState().address;
      if (address) {
        toast.success('Connected (WalletConnect placeholder)');
        onOpenChange(false);
        onConnected?.(address);
      } else {
        toast.error('WalletConnect connected but no address provided');
      }
    } catch (e) {
      console.error(e);
      toast.error('WalletConnect connection failed or cancelled');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect a Wallet</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="flex flex-col gap-2">
            <Button onClick={handleFreighter} className="w-full">
              Connect with Freighter
            </Button>
            <Button variant="outline" onClick={handleWalletConnect} className="w-full">
              WalletConnect (experimental)
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">
            Freighter is the recommended browser extension for Stellar. WalletConnect support is experimental and requires a compatible wallet — currently this is a lightweight placeholder for manual key entry.
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
