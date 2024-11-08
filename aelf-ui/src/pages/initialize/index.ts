import { useState } from 'react';
// @ts-ignore
import AElf from 'aelf-sdk';
import { toast } from 'react-toastify';

import { IPortkeyProvider } from '@portkey/provider-types';
import detectProvider from '@portkey/detect-provider';
import useSmartContract from '@/hooks/useSmartContract';
import './create-nft.scss';

import { removeNotification } from '@/lib/utils';


const Initialize = async (currentWalletAddress: string) => {
  const [provider, setProvider] = useState<IPortkeyProvider | null>(null);
  const { sideChainSmartContract } = useSmartContract(provider);

  const init = async () => {
    try {
      const detectedProvider = await detectProvider();
      setProvider(detectedProvider);
    } catch (error) {
      console.error('Error detecting provider:', error);
    }
  };

  if (!provider) await init();

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

export default Initialize;
