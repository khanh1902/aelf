import { Address, IPortkeyProvider } from '@portkey/provider-types';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import './transfer-nft.scss';
import useSmartContract from '@/hooks/useSmartContract';
import { removeNotification } from '@/lib/utils';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const GetAdminWallet = ({ provider, currentWalletAddress }: { provider: IPortkeyProvider | null; currentWalletAddress: string }) => {
  const { sideChainSmartContract } = useSmartContract(provider);
  const [address, setAddress] = useState<Address>('');
  const navigate = useNavigate();

  const handleReturnClick = () => {
    navigate('/');
  };
  // Handle Transfer Submit Form
  const onSubmit = async () => {
    const getAdminWalletLoadingId = toast.loading('Load Admin Wallet Executing');

    try {
      const values = {};
      const result = await sideChainSmartContract?.callViewMethod('AdminWallet', values);
      if (result && result.data && result.data.value) {
        setAddress(result.data.value);
      }
      toast.update(getAdminWalletLoadingId, {
        render: 'Load Admin Wallet Successfully!',
        type: 'success',
        isLoading: false,
      });
      removeNotification(getAdminWalletLoadingId);
    } catch (error: any) {
      console.error(error.message, '=====error');
      console.error(error);
      toast.error(error.message);
      removeNotification(getAdminWalletLoadingId);
    }
  };

  return (
    <div className='form-wrapper'>
      <div className='form-container'>
        <div className='form-content'>
          <h2 className='form-title'>Owner</h2>
          <div className='input-group'>
            {address ? (
              <div className='nft-collection'>
                <div className='bordered-container'>
                  <strong>Result: {address}</strong>
                </div>
              </div>
            ) : (
              <></>
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

export default GetAdminWallet;
