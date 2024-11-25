import { IPortkeyProvider, IChain } from '@portkey/provider-types';
import { useEffect, useState } from 'react';

type IContract = ReturnType<IChain['getContract']>;

export const DAPP_CHAIN_TESTNET_SMC = '2sbQLjkLGvvvZtiCfR2KksvUJSpaBHSJN7rvKCbdummvGWi5fb';
export const NATIVE_TOKEN_SMC = 'ASh2Wt7nSEmYqnGxPPzp4pnVDU4uhj1XW9Se5VeZcX2UDdyjx';
// export const DAPP_CHAIN_TESTNET_SMC = 'GsGftEFRv4Qq38sV6YW2UAVNU41DkHDBf5odJzt3j12T6eBNb';
// export const NATIVE_TOKEN_SMC = '7RzVGiuVWkvL4VfVHdZfQF2Tri3sgLe9U991bohHFfSRZXuGX';

// Custom Hook for interacting with NFT Smart Contracts
const useSmartContract = (provider: IPortkeyProvider | null) => {
  // State variables to store the smart contract instances
  const [sideChainSmartContract, setSideChainSmartContract] = useState<IContract>();
  const [nativeTokenSmartContract, setNativeTokenSmartContract] = useState<IContract>();

  //Step A - Function to fetch a smart contract based on chain symbol and contract address
  const fetchContract = async (symbol: 'AELF' | 'tDVW', contractAddress: string) => {
    try {
      // If no provider is available, return null
      if (!provider) return null;
      
      // Fetch the chain information using the provider
      const chain = await provider.getChain(symbol);
      if (!chain) throw new Error('Chain not found');

      // Get the smart contract instance from the chain
      const contract = chain.getContract(contractAddress);

      // Return the smart contract instance
      return contract;
    } catch (error) {
      console.error('Error in fetchContract', { symbol, contractAddress, error });
    }
  };

  // Step B -  Effect hook to initialize and fetch the smart contracts when the provider changes
  useEffect(() => {
    (async () => {
      // Fetch the MainChain Testnet Contract
      // Fetch the dAppChain Testnet Contract
      const sideChainContract = await fetchContract('tDVW', DAPP_CHAIN_TESTNET_SMC);
      setSideChainSmartContract(sideChainContract as IContract);

      const nativeTokenContract = await fetchContract('tDVW', NATIVE_TOKEN_SMC);
      setNativeTokenSmartContract(nativeTokenContract as IContract);


    })();
  }, [provider]); // Dependency array ensures this runs when the provider changes

  // Return the smart contract instances
  return {
    sideChainSmartContract,
    nativeTokenSmartContract,
  };
};

export default useSmartContract;
