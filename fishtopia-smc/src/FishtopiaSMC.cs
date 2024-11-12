using System;
using AElf.Contracts.MultiToken;
using System.Collections.Generic;
using AElf.Sdk.CSharp;
using AElf.Types;
using Google.Protobuf.WellKnownTypes;

namespace AElf.Contracts.FishtopiaSMC
{
    // Contract class must inherit the base class generated from the proto file
    public class FishtopiaSMC : FishtopiaSMCContainer.FishtopiaSMCBase
    {
        private const string TokenContractAddress = "ASh2Wt7nSEmYqnGxPPzp4pnVDU4uhj1XW9Se5VeZcX2UDdyjx"; // tDVW token contract address
        private const string AdminWalletAddress = "2U9EHbDw1g9jaTG4dRkaQicD2ejysj94CFVxHLengrBL3ijsQq";

        private const int _decimal = 8;

        private const string _symbol = "ELF";

        public override Empty Initialize(Empty input)
        {
            Assert(State.Initialized.Value == false, "Already initialized.");

            State.Initialized.Value = true;
            State.Owner.Value = Context.Sender;
            State.AdminWalletAddress.Value = Address.FromBase58(AdminWalletAddress);
            State.TokenContract.Value = Address.FromBase58(TokenContractAddress);

            return new Empty();
        }

        public override Empty SetAdminWallet(AddressInput input)
        {
            AssertIsOwner();
            State.AdminWalletAddress.Value = input.Address;
            return new Empty();
        }

        public override Empty AddPaymentToken(AddressInput input)
        {
            AssertIsOwner();

            if (State.PaymentTokens[input.Address] == null)
            {
                State.PaymentTokens[input.Address] = input.Address;
            }
            return new Empty();
        }

        public override Empty RemovePaymentToken(AddressInput input)
        {
            AssertIsOwner();

            if (State.PaymentTokens[input.Address] != null)
            {
                State.PaymentTokens.Remove(input.Address);
            }
            return new Empty();
        }

        public override Empty AddItems(AddItemsInput input)
        {
            AssertIsOwner();
            Assert(State.PaymentTokens[input.PaymentToken] != null, "Does Not Support This Payment Token.");

            Assert(State.ItemsList[input.ItemsId] == null, "Items Already Exists.");

            ItemsDAO items = new()
            {
                ItemsId = input.ItemsId,
                IsAvailable = input.IsAvailable,
                CanBuy = input.CanBuy,
                PaymentToken = input.PaymentToken,
                ItemsPrice = input.ItemsPrice * _decimal
            };

            State.ItemsList[input.ItemsId] = items;

            return new Empty();
        }

        public override Empty RemoveItems(RemoveItemsInput input)
        {
            AssertIsOwner();
            Assert(State.ItemsList[input.ItemsId] != null, "Items Not Found");
            State.ItemsList.Remove(input.ItemsId);
            return new Empty();
        }

        public override BoolValue AvailableItems(AvailableItemsInput input)
        {
            ItemsDAO items = State.ItemsList[input.ItemsId];
            if (items == null || items.IsAvailable == false) return new BoolValue { Value = false };
            return new BoolValue { Value = true };
        }

        public override Empty TransferOwnership(AddressInput input)
        {
            AssertIsOwner();
            Assert(State.Owner.Value != Context.Sender, "Current Address Is The Owner.");
            State.Owner.Value = new Address();
            return new Empty();
        }

        public override Empty PurchaseItems(PurchaseItemsInput input)
        {
            ItemsDAO items = State.ItemsList[input.ItemsId];
            Assert(items != null, "Items Not Found.");
            Assert(items.IsAvailable != false, "Items Is Not Available.");
            Assert(items.CanBuy != false, "Items Can Not Buy Now. Please try again.");
            Assert(State.PaymentTokens[input.PaymentToken] != null, "Payment Token Does Not Match.");

            long spenderBalance = State.TokenContract.GetBalance.Call(new GetBalanceInput
            {
                Symbol = _symbol,
                Owner = Context.Sender
            }).Balance;

            State.TokenContract.GetAllowance.Call(new GetAllowanceInput
            {
                Owner = Context.Sender,
                Spender = State.AdminWalletAddress.Value, 
                Symbol = "ELF"
            });

            Assert(spenderBalance >= input.PayableAmount, "Not Enough Token.");

            State.TokenContract.TransferFrom.Send(new TransferFromInput
            {
                From = Context.Sender,
                To = State.AdminWalletAddress.Value,
                Symbol = _symbol,
                Amount = input.PayableAmount * _decimal,
            });

            Context.Fire(new PurchaseItemsEvent
            {
                UserId = input.UserId,
                ItemsId = input.ItemsId,
                Spender = Context.Sender,
                PayableAmount = input.PayableAmount,
                PaymentToken = input.PaymentToken,
            });
            return new Empty();
        }

        public override StringValue Owner(Empty input)
        {
            return new StringValue { Value = Context.Sender.ToBase58() };
        }

        public override Int64Value BalanceOf(AddressInput input)
        {
            var balance = State.TokenContract.GetBalance.Call(new GetBalanceInput
            {
                Owner = input.Address,
                Symbol = _symbol
            }).Balance;

            return new Int64Value { Value = balance };
        }

        public override StringValue AdminWallet(Empty input)
        {
            return State.AdminWalletAddress.Value == null ? new StringValue() : new StringValue { Value = State.AdminWalletAddress.Value.ToBase58() };
        }

        public override BoolValue AvailablePaymentToken(AddressInput input)
        {
            return State.PaymentTokens[input.Address] != null ? new BoolValue { Value = true } : new BoolValue { Value = false };
        }

        private void AssertIsOwner()
        {
            Assert(Context.Sender == State.Owner.Value, "Unauthorized To Perform The Action.");
        }
    }
}