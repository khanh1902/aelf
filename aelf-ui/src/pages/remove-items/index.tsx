import { Address, IPortkeyProvider } from '@portkey/provider-types';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import './transfer-nft.scss';
import { Button } from '@/components/ui/button';
import useSmartContract from '@/hooks/useSmartContract';
import { delay, removeNotification } from '@/lib/utils';
import { useState } from 'react';

const RemoveItems = ({ provider, currentWalletAddress }: { provider: IPortkeyProvider | null; currentWalletAddress: string }) => {
  const { sideChainSmartContract, } = useSmartContract(provider);
  const [itemsId, setItemsId] = useState<Address>('');
  const navigate = useNavigate();

  const handleReturnClick = () => {
    navigate('/');
  };

  const handleItemsIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setItemsId(value);
  };

  // Handle Transfer Submit Form
  const onSubmit = async () => {
    const removeItemsLoadingId = toast.loading('Remove Items Executing');

    try {
      const input = {
        itemsId,
      };
      await sideChainSmartContract?.callSendMethod('RemoveItems', currentWalletAddress, input);

      toast.update(removeItemsLoadingId, {
        render: 'Remove Items Successfully!',
        type: 'success',
        isLoading: false,
      });
      removeNotification(removeItemsLoadingId);

      await delay(3000);

      handleReturnClick();
    } catch (error: any) {
      console.error(error.message, '=====error');
      toast.error(error.message);
      removeNotification(removeItemsLoadingId);
    }
  };

  return (
    <div className='form-wrapper'>
      <div className='form-container'>
        <div className='form-content'>
          <h2 className='form-title'>Remove Payment Token</h2>
          <div className='input-group'>
            <input type='text' name='itemsId' value={itemsId} onChange={handleItemsIdChange} placeholder='Items Id' />
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

export default RemoveItems;
