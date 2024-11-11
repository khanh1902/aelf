import { Address, IPortkeyProvider } from '@portkey/provider-types';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import './transfer-nft.scss';
import useSmartContract from '@/hooks/useSmartContract';
import { removeNotification } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

const GetBalanceOf = ({ provider, currentWalletAddress }: { provider: IPortkeyProvider | null; currentWalletAddress: string }) => {
  const { sideChainSmartContract } = useSmartContract(provider);
  const [balanceOf, setBalanceOf] = useState<string>('');
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
    const getBalanceOfLoadingId = toast.loading('Get Balance Of Executing');

    try {
      const values = {
        address,
      };
      const result = await sideChainSmartContract?.callViewMethod('BalanceOf', values);
      if (result && result.data && result.data.value) {
        setBalanceOf(result.data.value);
        toast.update(getBalanceOfLoadingId, {
          render: 'Get Balance Of Successfully!',
          type: 'success',
          isLoading: false,
        });
      }
      else {
        throw new Error ('Get Balance Failed');
      }
      removeNotification(getBalanceOfLoadingId);
    } catch (error: any) {
      console.error(error.message, '=====error');
      removeNotification(getBalanceOfLoadingId);
    }
  };

  return (
    <div className='form-wrapper'>
      <div className='form-container'>
        <div className='form-content'>
          <h2 className='form-title'>BalanceOf</h2>
          <div className='input-group'>
            <div className='input-group'>
              <input type='text' name='amount' value={address} onChange={handleItemsInputChange} placeholder='Address'/>
            </div>
            {balanceOf ? (
              <div className='nft-collection'>
                <div className='bordered-container'>
                  <strong>Result = {balanceOf} ELF.</strong>
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

export default GetBalanceOf;
