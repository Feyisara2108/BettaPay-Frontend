import {
  isAllowed,
  setAllowed,
  requestAccess,
  signTransaction,
} from '@stellar/freighter-api';
import { STELLAR_NETWORK } from '../utils/constants';

const TESTNET_PASSPHRASE = 'Test SDF Network ; September 2015';
const PUBLIC_PASSPHRASE = 'Public Global Stellar Network ; September 2015';
const getPassphrase = () => STELLAR_NETWORK.toUpperCase() === 'PUBLIC' ? PUBLIC_PASSPHRASE : TESTNET_PASSPHRASE;

// Detect whether Freighter is available. This tries a lightweight call and falls back safely.
export const isFreighterAvailable = async (): Promise<boolean> => {
  try {
    // isAllowed will throw if Freighter is not installed or inaccessible
    await isAllowed();
    return true;
  } catch {
    return false;
  }
};

export const connectFreighter = async (): Promise<string | null> => {
  try {
    let allowedResp = await isAllowed();
    if (!allowedResp.isAllowed) {
      await setAllowed();
      allowedResp = await isAllowed();
    }

    if (allowedResp.isAllowed) {
      const accessResp = await requestAccess();
      if (!accessResp.error && accessResp.address) {
        return accessResp.address;
      }
    }
    return null;
  } catch (error) {
    console.error('Failed to connect Freighter', error);
    return null;
  }
};

export const signWithFreighter = async (xdr: string): Promise<string | null> => {
  try {
    const signedTxResp = await signTransaction(xdr, {
      networkPassphrase: getPassphrase(),
    });

    if (signedTxResp.error) {
      console.error('Freighter sign error', signedTxResp.error);
      return null;
    }

    return signedTxResp.signedTxXdr;
  } catch (error) {
    console.error('Failed to sign transaction with Freighter', error);
    return null;
  }
};
