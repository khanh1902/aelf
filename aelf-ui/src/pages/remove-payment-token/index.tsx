import { Address, IPortkeyProvider } from '@portkey/provider-types';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import './transfer-nft.scss';
import { Button } from '@/components/ui/button';
import useSmartContract from '@/hooks/useSmartContract';
import { delay, removeNotification } from '@/lib/utils';
import { useState } from 'react';

const RemovePaymentToken = ({ provider, currentWalletAddress }: { provider: IPortkeyProvider | null; currentWalletAddress: string }) => {
  const { sideChainSmartContract, } = useSmartContract(provider);
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
    const removePaymentTokenLoadingId = toast.loading('Remove Payment Token Executing');

    try {
      const input = {
        address,
      };
      await sideChainSmartContract?.callSendMethod('RemovePaymentToken', currentWalletAddress, input);

      toast.update(removePaymentTokenLoadingId, {
        render: 'Remove Payment Token Successfully!',
        type: 'success',
        isLoading: false,
      });
      removeNotification(removePaymentTokenLoadingId);

      await delay(3000);

      handleReturnClick();
    } catch (error: any) {
      console.error(error.message, '=====error');
      toast.error(error.message);
      removeNotification(removePaymentTokenLoadingId);
    }
  };

  return (
    <div className='form-wrapper'>
      <div className='form-container'>
        <div className='form-content'>
          <h2 className='form-title'>Remove Payment Token</h2>
          <div className='input-group'>
            <input type='text' name='address' value={address} onChange={handleItemsInputChange} placeholder='Address' />
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

export default RemovePaymentToken;
