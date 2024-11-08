import { IPortkeyProvider } from '@portkey/provider-types';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import './transfer-nft.scss';
import { Button } from '@/components/ui/button';
import useNFTSmartContract from '@/hooks/useSmartContract';
import { delay, removeNotification } from '@/lib/utils';
import { useState } from 'react';

const ReadSMC = ({ provider, currentWalletAddress }: { provider: IPortkeyProvider | null; currentWalletAddress: string }) => {
  const { sideChainSmartContract } = useNFTSmartContract(provider);
  const [items, setItems] = useState<string>('');
  const navigate = useNavigate();

  const handleReturnClick = () => {
    navigate('/');
  };

  const handleItemsInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setItems(event.target.value);
  };

  // Handle Transfer Submit Form
  const onSubmit = async () => {
    const purchaseItemsLoadingId = toast.loading('Transfer Transaction Executing');

    try {
      const transferNtfInput = {
        items,
      };

      await sideChainSmartContract?.callSendMethod('PurchaseItems', currentWalletAddress, transferNtfInput);

      toast.update(purchaseItemsLoadingId, {
        render: 'NFT Transferred Successfully!',
        type: 'success',
        isLoading: false,
      });
      removeNotification(purchaseItemsLoadingId);

      await delay(3000);

      handleReturnClick();
    } catch (error: any) {
      console.error(error.message, '=====error');
      toast.error(error.message);
      removeNotification(purchaseItemsLoadingId);
    }
  };

  return (
    <div className='form-wrapper'>
      <div className='form-container'>
        <div className='form-content'>
          <h2 className='form-title'>Pay Items</h2>
          <div className='input-group'>
            <input type='text' name='items' value={items} onChange={handleItemsInputChange} />
          </div>

          <div className='button-container'>
            <button type='button' className='return-btn' onClick={handleReturnClick}>
              Cancel
            </button>
            <Button type='submit' className='submit-btn' onClick={onSubmit}>
              Pay
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadSMC;
