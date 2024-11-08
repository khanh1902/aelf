import { IPortkeyProvider } from '@portkey/provider-types';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import './transfer-nft.scss';
import { Button } from '@/components/ui/button';
import useSmartContract, { DAPP_CHAIN_TESTNET_SMC } from '@/hooks/useSmartContract';
import { delay, removeNotification } from '@/lib/utils';
import { useState } from 'react';

const PurchaseItems = ({ provider, currentWalletAddress }: { provider: IPortkeyProvider | null; currentWalletAddress: string }) => {
  const { sideChainSmartContract, nativeTokenSmartContract } = useSmartContract(provider);
  const [amount, setAmount] = useState<number>(0);
  const navigate = useNavigate();

  const handleReturnClick = () => {
    navigate('/');
  };

  const handleItemsInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setAmount(value as unknown as number);
  };

  // Handle Transfer Submit Form
  const onSubmit = async () => {
    const purchaseItemsLoadingId = toast.loading('Transfer Transaction Executing');

    try {
      const approveInput = {
        spender: DAPP_CHAIN_TESTNET_SMC,
        symbol: 'ELF',
        Amount: amount,
      };

      await nativeTokenSmartContract?.callSendMethod('Approve', currentWalletAddress, approveInput);

      const transferNtfInput = {
        amount,
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
            <input type='text' name='amount' value={amount} onChange={handleItemsInputChange} />
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

export default PurchaseItems;
