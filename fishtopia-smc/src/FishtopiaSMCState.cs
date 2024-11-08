using System.Collections.Generic;
using AElf.Sdk.CSharp.State;
using AElf.Types;
using Google.Protobuf.WellKnownTypes;

namespace AElf.Contracts.FishtopiaSMC
{
    public partial class FishtopiaSMCState : ContractState
    {
        public BoolState Initialized { get; set; }
        public SingletonState<Address> AdminAddress { get; set; }
        public SingletonState<Address> Owner { get; set; }
        public MappedState<Address, Address> PaymentTokenList { get; set; }
        public MappedState<Address, List<ItemsDAO>> ItemsList { get; set; }
    }
}