import { Address, IPortkeyProvider } from '@portkey/provider-types';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import './transfer-nft.scss';
import useSmartContract from '@/hooks/useSmartContract';
import { removeNotification } from '@/lib/utils';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const AvailablePaymentToken = ({ provider, currentWalletAddress }: { provider: IPortkeyProvider | null; currentWalletAddress: string }) => {
  const { sideChainSmartContract } = useSmartContract(provider);
  const [result, setResult] = useState<boolean | null>(null);
  const [address, setAddress] = useState<Address>('');
  const navigate = useNavigate();

  const handleReturnClick = () => {
    navigate('/');
  };

  const handleItemsInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setAddress(value);
  };

  // Handle Transfer Submit Form
  const onSubmit = async () => {
    const availablePaymentTokenLoadingId = toast.loading('Call Available Payment Token Executing');

    try {
      const values = {
        address,
      };
      const result = await sideChainSmartContract?.callViewMethod('AvailablePaymentToken', values);
      if (result && result.data && result.data.value) {
        setResult(result.data.value);
        toast.update(availablePaymentTokenLoadingId, {
          render: 'Call Available Payment Token Successfully!',
          type: 'success',
          isLoading: false,
        });
      } else {
        throw new Error('Call Available Payment Token Failed');
      }
      removeNotification(availablePaymentTokenLoadingId);
    } catch (error: any) {
      console.error(error.message, '=====error');
      removeNotification(availablePaymentTokenLoadingId);
    }
  };

  return (
    <div className='form-wrapper'>
      <div className='form-container'>
        <div className='form-content'>
          <h2 className='form-title'>Available Payment Token</h2>
          <div className='input-group'>
            <div className='input-group'>
              <input type='text' name='amount' value={address} onChange={handleItemsInputChange} placeholder='address' />
            </div>

            <div className='nft-collection'>
              <div className='bordered-container'>
                <strong>Result = {result ? 'true' : 'false'}</strong>
              </div>
            </div>
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

export default AvailablePaymentToken;
