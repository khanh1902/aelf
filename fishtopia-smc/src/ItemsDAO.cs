using Google.Protobuf.WellKnownTypes;

namespace AElf.Contracts.FishtopiaSMC
{
    public class ItemsDAO
    {
        public string ItemsId { get; set; }
        public bool IsAvailable { get; set; }
        public bool CanBuy { get; set; }
        public long ItemsPrice { get; set; }
    }
}