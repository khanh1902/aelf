import { Address, IPortkeyProvider } from '@portkey/provider-types';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import './transfer-nft.scss';
import { Button } from '@/components/ui/button';
import useSmartContract from '@/hooks/useSmartContract';
import { delay, removeNotification } from '@/lib/utils';
import { useState } from 'react';

const AddItems = ({ provider, currentWalletAddress }: { provider: IPortkeyProvider | null; currentWalletAddress: string }) => {
  const { sideChainSmartContract, } = useSmartContract(provider);
  const [itemsId, setItemsId] = useState<string>('');
  const [isAvailable, setIsAvailable] = useState<string>('');
  const [canBuy, setCanBuy] = useState<string>('');
  const [paymentToken, setPaymentToken] = useState<Address>('');
  const [itemsPrice, setItemsPrice] = useState<number>();
  const navigate = useNavigate();

  const handleReturnClick = () => {
    navigate('/');
  };

  const handleItemsIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setItemsId(value);
  };

  const handleIsAvailableChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setIsAvailable(value);
  };

  const handleCanBuyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setCanBuy(value);
  };

  const handlePaymentTokenChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setPaymentToken(value);
  };

  const handleItemsPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setItemsPrice(value as unknown as number);
  };


  // Handle Transfer Submit Form
  const onSubmit = async () => {
    const addItemsLoadingId = toast.loading('Add Items Executing');

    try {
      const input = {
        itemsId,
        isAvailable: isAvailable === "true" ? true : false,
        canBuy: canBuy === 'true' ? true : false,
        paymentToken,
        itemsPrice: itemsPrice as number
      };
      await sideChainSmartContract?.callSendMethod('AddItems', currentWalletAddress, input);

      toast.update(addItemsLoadingId, {
        render: 'Add Items Successfully!',
        type: 'success',
        isLoading: false,
      });
      removeNotification(addItemsLoadingId);

      await delay(3000);

      handleReturnClick();
    } catch (error: any) {
      console.error(error.message, '=====error');
      toast.error(error.message);
      removeNotification(addItemsLoadingId);
    }
  };

  return (
    <div className='form-wrapper'>
      <div className='form-container'>
        <div className='form-content'>
          <h2 className='form-title'>Add Payment Token</h2>
          <div className='input-group'>
            <input type='text' name='itemsId' value={itemsId} onChange={handleItemsIdChange} placeholder='Id' />
            <input type='text' name='isAvailable' value={isAvailable} onChange={handleIsAvailableChange} placeholder='Is Available' />
            <input type='text' name='canBuy' value={canBuy} onChange={handleCanBuyChange} placeholder='Can Buy' />
            <input type='text' name='paymentToken' value={paymentToken} onChange={handlePaymentTokenChange} placeholder='Payment Token' />
            <input type='text' name='itemsPrice' value={itemsPrice} onChange={handleItemsPriceChange} placeholder='Price' />
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

export default AddItems;
