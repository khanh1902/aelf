using Google.Protobuf.WellKnownTypes;

namespace AElf.Contracts.FishtopiaSMC
{
    public class ItemsDAO
    {
        public StringValue ItemsId { get; set; }
        public BoolValue IsAvailable { get; set; }
        public BoolValue CanBuy { get; set; }
        public Int64Value ItemsPrice { get; set; }
    }
}