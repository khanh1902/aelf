using AElf.Cryptography.ECDSA;
using AElf.Testing.TestBase;

namespace AElf.Contracts.FishtopiaSMC
{
    // The Module class load the context required for unit testing
    public class Module : ContractTestModule<FishtopiaSMC>
    {
        
    }
    
    // The TestBase class inherit ContractTestBase class, it defines Stub classes and gets instances required for unit testing
    public class TestBase : ContractTestBase<Module>
    {
        // The Stub class for unit testing
        internal readonly FishtopiaSMCContainer.FishtopiaSMCStub FishtopiaSMCStub;
        // A key pair that can be used to interact with the contract instance
        private ECKeyPair DefaultKeyPair => Accounts[0].KeyPair;

        public TestBase()
        {
            FishtopiaSMCStub = GetFishtopiaSMCContractStub(DefaultKeyPair);
        }

        private FishtopiaSMCContainer.FishtopiaSMCStub GetFishtopiaSMCContractStub(ECKeyPair senderKeyPair)
        {
            return GetTester<FishtopiaSMCContainer.FishtopiaSMCStub>(ContractAddress, senderKeyPair);
        }
    }
    
}