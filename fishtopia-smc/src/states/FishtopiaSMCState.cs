using AElf.Sdk.CSharp.State;
using AElf.Types;

namespace AElf.Contracts.FishtopiaSMC
{
    public partial class FishtopiaSMCState : ContractState
    {
        public BoolState Initialized { get; set; }
        public SingletonState<Address> AdminWalletAddress { get; set; }
        public SingletonState<Address> Owner { get; set; }
        public MappedState<Address, Address> PaymentTokens { get; set; }
    }
}