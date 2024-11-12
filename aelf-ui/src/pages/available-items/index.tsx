import { Address, IPortkeyProvider } from '@portkey/provider-types';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import './transfer-nft.scss';
import useSmartContract from '@/hooks/useSmartContract';
import { removeNotification } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const AvailableItems = ({ provider, currentWalletAddress }: { provider: IPortkeyProvider | null; currentWalletAddress: string }) => {
  const { sideChainSmartContract } = useSmartContract(provider);
  const [result, setResult] = useState<boolean | null>(null);
  const [itemsId, setItemsId] = useState<string>('');
  const navigate = useNavigate();

  const handleReturnClick = () => {
    navigate('/');
  };

  const handleItemsInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setItemsId(value);
  };

  // Handle Transfer Submit Form
  const onSubmit = async () => {
    const availableItemsLoadingId = toast.loading('Call Available Items Executing');

    try {
      const values = {
        itemsId,
      };
      const result = await sideChainSmartContract?.callViewMethod('AvailableItems', values);
      if (result && result.data && result.data.value) {
        setResult(result.data.value);
        toast.update(availableItemsLoadingId, {
          render: 'Call Available Items Successfully!',
          type: 'success',
          isLoading: false,
        });
      }
      removeNotification(availableItemsLoadingId);
    } catch (error: any) {
      console.error(error, '=====error');
      removeNotification(availableItemsLoadingId);
    }
  };

  return (
    <div className='form-wrapper'>
      <div className='form-container'>
        <div className='form-content'>
          <h2 className='form-title'>Available Items</h2>
          <div className='input-group'>
            <div className='input-group'>
              <input type='text' name='itemsId' value={itemsId} onChange={handleItemsInputChange} placeholder='Items Id' />
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

export default AvailableItems;
