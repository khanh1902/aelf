import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IPortkeyProvider } from '@portkey/provider-types';
import { toast } from 'react-toastify';

import './home.scss';
import { Button } from '@/components/ui/button';
import useNFTSmartContract from '@/hooks/useSmartContract';
import { removeNotification } from '@/lib/utils';

const HomePage = ({ provider, currentWalletAddress }: { provider: IPortkeyProvider | null; currentWalletAddress?: string }) => {
  console.log(currentWalletAddress);
  const navigate = useNavigate();
  const { sideChainSmartContract } = useNFTSmartContract(provider);
  const [isInitialized, setIsInitialized] = useState<boolean>(
    localStorage.getItem('Initialized') && localStorage.getItem('Initialized') === '1' ? true : false
  );

  const Initialize = async (currentWalletAddress: string) => {
    const initializeLoadingId = toast.loading('Initialize on SideChain...');
    try {
      await sideChainSmartContract?.callSendMethod('Initialize', currentWalletAddress);

      toast.update(initializeLoadingId, {
        render: 'Collection was Created Successfully On SideChain',
        type: 'success',
        isLoading: false,
      });

      removeNotification(initializeLoadingId);
      toast.info('You Can Create NFT now');
      return 'success';
    } catch (error: any) {
      toast.update(initializeLoadingId, {
        render: error.message || 'Initialization failed',
        type: 'error',
        isLoading: false,
      });
      removeNotification(initializeLoadingId);
      return 'error';
    }
  };

  const handleInitialize = async () => {
    await Initialize(currentWalletAddress as string);
    setIsInitialized(true);
    localStorage.setItem('Initialized', '1');
  };

  return (
    <div className='home-container'>
      <div className='nft-collection-container'>
        <div className='nft-collection-head'>
          <h2>Read Contract</h2>
          <div className='button-wrapper'>
            <Button className='header-button' onClick={() => (currentWalletAddress ? navigate('/get-owner') : toast.warning('Please Connect Wallet First'))}>
              Owner
            </Button>
            <Button className='header-button' onClick={() => handleInitialize()}>
              IsOwner
            </Button>
            <Button className='header-button' onClick={() => handleInitialize()}>
              AdminWallet
            </Button>
            <Button className='header-button' onClick={() => (currentWalletAddress ? navigate('/get-balance-of') : toast.warning('Please Connect Wallet First'))}>
              BalanceOf
            </Button>
            <Button className='header-button' onClick={() => handleInitialize()}>
              AvailablePaymentToken
            </Button>
            <Button className='header-button' onClick={() => handleInitialize()}>
              AvailableItems
            </Button>
            <Button
              className='header-button'
              onClick={() => (currentWalletAddress ? navigate('/purchase-items') : toast.warning('Please Connect Wallet First'))}
            >
              Purchase Items
            </Button>
          </div>
        </div>
      </div>

      <div className='nft-collection-container'>
        <div className='nft-collection-head'>
          <h2>Write Contract</h2>
          <div className='button-wrapper'>
            <Button className='header-button' onClick={() => handleInitialize()} disabled={isInitialized}>
              Initialize
            </Button>

            <Button
              className='header-button'
              onClick={() => (currentWalletAddress ? navigate('/set-admin-wallet') : toast.warning('Please Connect Wallet First'))}
            >
              SetAdminWallet
            </Button>

            <Button
              className='header-button'
              onClick={() => (currentWalletAddress ? navigate('/add-payment-token') : toast.warning('Please Connect Wallet First'))}
            >
              AddPaymentToken
            </Button>

            <Button
              className='header-button'
              onClick={() => (currentWalletAddress ? navigate('/remove-payment-token') : toast.warning('Please Connect Wallet First'))}
            >
              RemovePaymentToken
            </Button>

            <Button
              className='header-button'
              onClick={() => (currentWalletAddress ? navigate('/add-items') : toast.warning('Please Connect Wallet First'))}
            >
              AddItems
            </Button>

            <Button
              className='header-button'
              onClick={() => (currentWalletAddress ? navigate('/purchase-items') : toast.warning('Please Connect Wallet First'))}
            >
              Purchase Items
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
