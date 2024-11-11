
using System.Collections.Generic;
using AElf.Sdk.CSharp.State;
using AElf.Types;

namespace AElf.Contracts.FishtopiaSMC
{
    public partial class FishtopiaSMCState
    {
        public MappedState<string, ItemsDAO> ItemsList { get; set; }
    }
}