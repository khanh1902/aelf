import { Address, IPortkeyProvider } from '@portkey/provider-types';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import './transfer-nft.scss';
import { Button } from '@/components/ui/button';
import useSmartContract, { DAPP_CHAIN_TESTNET_SMC } from '@/hooks/useSmartContract';
import { delay, removeNotification } from '@/lib/utils';
import { useState } from 'react';

const PurchaseItems = ({ provider, currentWalletAddress }: { provider: IPortkeyProvider | null; currentWalletAddress: string }) => {
  const { sideChainSmartContract, nativeTokenSmartContract } = useSmartContract(provider);
  const [itemsId, setItemsId] = useState<string>('');
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
    const addItemsLoadingId = toast.loading('Purchase Items Executing');

    try {
      // const approveInput = {
      //   spender: DAPP_CHAIN_TESTNET_SMC,
      //   symbol: 'ELF',
      //   Amount: 100000000,
      // };

      // await nativeTokenSmartContract?.callSendMethod('Approve', currentWalletAddress, approveInput);
      const input = {
        userId: 'khanhvan@123',
        itemsId,
      };
      const result = await sideChainSmartContract?.callSendMethod('PurchaseItems', currentWalletAddress, input);
      if (result && result.transactionId) {
        const config = {
          method: 'GET',
          url: `http://localhost:8087/api/aelf/purchased/${result.transactionId}`,
          headers: {
            Authorization:
              'Bearer ' +
              'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiVVNFUiIsImdyYW50X3R5cGUiOiJ0ZWxlZ3JhbSIsInN1YiI6IjIwIiwiaWF0IjoxNzMyMjcyMTAxLCJleHAiOjE3MzIzNTg1MDF9.MvHkWqqV2VB5doXa4WAlqhKFw_xO8zRrt0913fnwpwE',
          },
        };
        console.log("TxId ===> " + result.transactionId);
        for (let i = 0; i < 30; i++) {
          const verifyTx = await axios(config);
          console.log("Status Code ===> " + verifyTx.status)
          if (verifyTx.status === 200) {
            toast.update(addItemsLoadingId, {
              render: 'Purchase Items Successfully!',
              type: 'success',
              isLoading: false,
            });
            removeNotification(addItemsLoadingId);
            return;
          }
        }

        toast.error('Purchase Items Failed!');
        removeNotification(addItemsLoadingId);
      }
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
          <h2 className='form-title'>PurchaseItems</h2>
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

export default PurchaseItems;
