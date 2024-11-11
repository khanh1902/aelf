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

        public override BoolValue Initialize(Empty input)
        {
            Assert(State.Initialized.Value == false, "Already initialized.");

            State.Initialized.Value = true;
            State.Owner.Value = Context.Sender;
            State.AdminWalletAddress.Value = Address.FromBase58(AdminWalletAddress);
            State.TokenContract.Value = Address.FromBase58(TokenContractAddress);

            return new BoolValue { Value = true };
        }

        public override BoolValue SetAdminWallet(Address address)
        {
            AssertIsOwner();
            try
            {
                State.AdminWalletAddress.Value = address;
                return new BoolValue { Value = true };
            }
            catch (Exception)
            {
                return new BoolValue { Value = false };
            }
        }

        public override BoolValue AddPaymentTokens(PaymentTokenInput input)
        {
            AssertIsOwner();
            try
            {
                bool added = false;
                foreach (Address address in input.Address)
                {
                    if (State.PaymentTokens[address] != null) continue;
                    State.PaymentTokens[address] = address;
                    added = true;
                }
                return added == true ? new BoolValue { Value = true } : new BoolValue { Value = false };
            }
            catch (Exception)
            {
                return new BoolValue { Value = false };
            }
        }

        public override BoolValue RemovePaymentTokens(PaymentTokenInput input)
        {
            AssertIsOwner();
            try
            {
                bool removed = false;
                foreach (Address address in input.Address)
                {
                    if (State.PaymentTokens[address] != null) continue;
                    State.PaymentTokens.Remove(address);
                    removed = true;
                }
                return removed == true ? new BoolValue { Value = true } : new BoolValue { Value = false };
            }
            catch (Exception)
            {
                return new BoolValue { Value = false };
            }
        }

        public override BoolValue AddItems(AddItemsInput input)
        {
            AssertIsOwner();
            try
            {
                Assert(State.PaymentTokens[input.PaymentToken] == null, "Does Not Support This Payment Token.");

                Assert(State.ItemsList[input.ItemsId] == null, "Items Already Exists.");

                State.ItemsList[input.ItemsId] = new ItemsDAO
                {
                    ItemsId = input.ItemsId,
                    IsAvailable = input.IsAvailable,
                    CanBuy = input.CanBuy,
                    ItemsPrice = input.ItemsPrice
                };

                return new BoolValue { Value = true };
            }
            catch (Exception)
            {
                return new BoolValue { Value = false };
            }
        }

        public override BoolValue RemoveItems(StringValue itemsId)
        {
            AssertIsOwner();
            Assert(State.ItemsList[itemsId.Value] == null, "Items Not Found");
            State.ItemsList.Remove(itemsId.Value);
            return new BoolValue { Value = true };
        }

        public override BoolValue AvailableItems(StringValue itemsId)
        {
            AssertIsOwner();
            ItemsDAO items = State.ItemsList[itemsId.Value];

            if (items == null || items.IsAvailable == false) return new BoolValue { Value = false };
            return new BoolValue { Value = true };
        }

        public override BoolValue RenounceOwnership(Empty input)
        {
            AssertIsOwner();
            State.Owner.Value = Address.FromBase58("");
            return new BoolValue { Value = true };
        }

        public override BoolValue TransferOwnership(Address address)
        {
            AssertIsOwner();
            Assert(State.Owner.Value != Context.Sender, "Current Address Is The Owner.");
            State.Owner.Value = Context.Sender;
            return new BoolValue { Value = true };
        }

        public override BoolValue PurchaseItems(PurchaseItemsInput input)
        {
            try
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
                    Owner = Context.Sender, // The address that approved the tokens
                    Spender = State.AdminWalletAddress.Value, // The contract address
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
                return new BoolValue { Value = true };

            }
            catch (Exception)
            {
                return new BoolValue { Value = false };
            }
        }

        public override StringValue Owner(Empty input)
        {
            return new StringValue { Value = Context.Sender.ToBase58() };
        }

        public override BoolValue IsOwner(Empty input)
        {
            return Context.Sender == State.Owner.Value ? new BoolValue { Value = true } : new BoolValue { Value = false };
        }

        public override Int64Value BalanceOf(Address address)
        {
            var balance = State.TokenContract.GetBalance.Call(new GetBalanceInput
            {
                Owner = address,
                Symbol = _symbol
            }).Balance;

            return new Int64Value { Value = balance };
        }

        public override StringValue AdminWallet(Empty input)
        {
            return State.AdminWalletAddress.Value == null ? new StringValue() : new StringValue { Value = State.AdminWalletAddress.Value.ToBase58() };
        }

        public override BoolValue AvailablePaymentToken(Address address)
        {
            return State.PaymentTokens[address] != null ? new BoolValue { Value = true } : new BoolValue { Value = false };

        }

        private void AssertIsOwner()
        {
            Assert(Context.Sender == State.Owner.Value, "Unauthorized To Perform The Action.");
        }
    }
}