import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IPortkeyProvider } from '@portkey/provider-types';
import { toast } from 'react-toastify';

import './home.scss';
import { NFT_IMAGES } from '@/lib/constant';
import { Button } from '@/components/ui/button';
import useNFTSmartContract from '@/hooks/useSmartContract';
import { fetchUserNftData } from '@/lib/commonFunctions';
import { removeNotification } from '@/lib/utils';

const HomePage = ({ provider, currentWalletAddress }: { provider: IPortkeyProvider | null; currentWalletAddress?: string }) => {
  console.log(currentWalletAddress);
  const navigate = useNavigate();
  const [userNfts, setUserNfts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { sideChainSmartContract } = useNFTSmartContract(provider);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // get NFT Data from User's wallet
  const getNFTData = async () => {
    const result = await fetchUserNftData(currentWalletAddress as string, sideChainSmartContract);
    if (result !== 'error') {
      setUserNfts(result);
    }
    setLoading(false);
  };

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
  };

  // Use Effect to Fetch NFTs
  useEffect(() => {
    if (currentWalletAddress && sideChainSmartContract) {
      getNFTData();
    }
  }, [currentWalletAddress, sideChainSmartContract]);

  return (
    <div className='home-container'>
      <div className='marketplace-info'>
        <h1>NFTs</h1>
        <h3>Create and Transfer Non-Fungible Tokens with AELF</h3>
      </div>
      <div className='nft-collection-container'>
        <div className='nft-collection-head'>
          <h2>Smart Contract</h2>
          <div className='button-wrapper'>
            <Button className='header-button' onClick={() => handleInitialize()} disabled={isInitialized}>
              Initialize
            </Button>
            <Button
              className='header-button'
              onClick={() => (currentWalletAddress ? navigate('/purchase-items') : toast.warning('Please Connect Wallet First'))}
            >
              Purchase Items
            </Button>
          </div>
        </div>

        {currentWalletAddress ? (
          <div className='nft-collection'>
            {userNfts.length > 0 ? (
              userNfts.slice(0, 5).map((data, index) => (
                <div className={userNfts.length > 3 ? 'nft-card around' : 'nft-card'} key={index}>
                  <img src={NFT_IMAGES[index + 1]} alt={'nft- image' + index} />
                  <div className='nft-info'>
                    <p>{data.nftSymbol}</p>
                  </div>

                  <div className='nft-info-row'>
                    <span>Name:</span>
                    <span>{data.tokenName}</span>
                  </div>

                  <div className='nft-info-row'>
                    <span>Collection Symbol:</span>
                    <span>{data.collectionSymbol}</span>
                  </div>

                  <div className='nft-info-row'>
                    <span>Balance:</span>
                    <span>{data.balance}</span>
                  </div>

                  <div className='nft-info-row'>
                    <span>Owner:</span>
                    <span>{data.realOwner.address}</span>
                  </div>

                  <div className='buy-container'>
                    <Button onClick={() => navigate(`/transfer-nft?nft-index=${index + 1}&nft-symbol=${data.nftSymbol}&nft-balance=${data.balance}`)}>
                      Transfer NFT
                    </Button>
                  </div>
                </div>
              ))
            ) : loading ? (
              <div className='bordered-container'>
                <strong>Loading...</strong>
              </div>
            ) : (
              <div className='bordered-container'>
                <strong>It's Look like you don't have any NFT on your wallet</strong>
              </div>
            )}
          </div>
        ) : (
          <div className='bordered-container'>
            <strong>Please connect your Portkey Wallet and Create a new NFT Collection and NFT Tokens</strong>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
