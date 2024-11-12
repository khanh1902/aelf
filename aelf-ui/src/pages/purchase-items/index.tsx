import { Address, IPortkeyProvider } from '@portkey/provider-types';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import './transfer-nft.scss';
import { Button } from '@/components/ui/button';
import useSmartContract, { DAPP_CHAIN_TESTNET_SMC } from '@/hooks/useSmartContract';
import { delay, removeNotification } from '@/lib/utils';
import { useState } from 'react';

const PurchaseItems = ({ provider, currentWalletAddress }: { provider: IPortkeyProvider | null; currentWalletAddress: string }) => {
  const { sideChainSmartContract, nativeTokenSmartContract } = useSmartContract(provider);
  const [payableAmount, setPayableAmount] = useState<number>();
  const [userId, setUserId] = useState<string>('');
  const [itemsId, setItemsId] = useState<string>('');
  const [paymentToken, setPaymentToken] = useState<Address>('');
  const navigate = useNavigate();

  const handleReturnClick = () => {
    navigate('/');
  };

  const handleItemsIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setItemsId(value);
  };

  const handlePayableAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setPayableAmount(value as unknown as number);
  };

  const handleUserIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setUserId(value);
  };

  const handlePaymentTokenChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setPaymentToken(value);
  };

  // Handle Transfer Submit Form
  const onSubmit = async () => {
    const addItemsLoadingId = toast.loading('Purchase Items Executing');

    try {
      const approveInput = {
        spender: DAPP_CHAIN_TESTNET_SMC,
        symbol: 'ELF',
        Amount: payableAmount,
      };

      await nativeTokenSmartContract?.callSendMethod('Approve', currentWalletAddress, approveInput);
      const input = {
        payableAmount,
        userId,
        itemsId,
        paymentToken,
      };
      const result = await sideChainSmartContract?.callSendMethod('PurchaseItems', currentWalletAddress, input);
      console.log(result);

      toast.update(addItemsLoadingId, {
        render: 'Purchase Items Successfully!',
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
            <input type='text' name='payableAmount' value={payableAmount} onChange={handlePayableAmountChange} placeholder='Payable Amount' />
            <input type='text' name='userId' value={userId} onChange={handleUserIdChange} placeholder='User Id' />
            <input type='text' name='itemsId' value={itemsId} onChange={handleItemsIdChange} placeholder='Items Id' />
            <input type='text' name='paymentToken' value={paymentToken} onChange={handlePaymentTokenChange} placeholder='Payment Token' />
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

export default PurchaseItems;
