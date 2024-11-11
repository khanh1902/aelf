import { Address, IPortkeyProvider } from '@portkey/provider-types';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import './transfer-nft.scss';
import useSmartContract from '@/hooks/useSmartContract';
import { delay, removeNotification } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

const GetOwner = ({ provider, currentWalletAddress }: { provider: IPortkeyProvider | null; currentWalletAddress: string }) => {
  const { sideChainSmartContract } = useSmartContract(provider);
  const [address, setAddress] = useState<Address>('');
  const navigate = useNavigate();

  const handleReturnClick = () => {
    navigate('/');
  };
  // Handle Transfer Submit Form
  const onSubmit = async () => {
    const setAdminWalletLoadingId = toast.loading('Load Owner Executing');

    try {
      
      const values = {};
      const data = await sideChainSmartContract?.callViewMethod('Owner', values, {});
      toast.update(setAdminWalletLoadingId, {
        render: 'Load Admin Wallet Successfully!',
        type: 'success',
        isLoading: false,
      });
      removeNotification(setAdminWalletLoadingId);

      await delay(3000);
      return data;
    } catch (error: any) {
      console.error(error.message, '=====error');
      console.error(error);
      toast.error(error.message);
      removeNotification(setAdminWalletLoadingId);
    }
  };

  useEffect(() => {
    onSubmit()
      .then((data) => {
        console.log(data);
      })
      .catch((error) => console.log(error));
  }, [currentWalletAddress, sideChainSmartContract]);

  return (
    <div className='form-wrapper'>
      <div className='form-container'>
        <div className='form-content'>
          <h2 className='form-title'>Owner</h2>
          <div className='input-group'>
            {currentWalletAddress ? (
              <div className='nft-collection'>
                <div className='bordered-container'>
                  <strong>Address: </strong>
                </div>
              </div>
            ) : (
              <div className='bordered-container'>
                <strong>Please connect your Portkey Wallet and Create a new NFT Collection and NFT Tokens</strong>
              </div>
            )}
          </div>

          <div className='button-container'>
            <button type='button' className='return-btn' onClick={handleReturnClick}>
              Cancel
            </button>
            <Button type='submit' className='submit-btn' onClick={onSubmit}>
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetOwner;
