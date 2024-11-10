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
        private const string AdminAddress = "2U9EHbDw1g9jaTG4dRkaQicD2ejysj94CFVxHLengrBL3ijsQq";

        private const string _symbol = "ELF";

        public override BoolValue Initialize(Empty input)
        {
            Assert(State.Initialized.Value == false, "Already initialized.");

            State.Initialized.Value = true;
            State.Owner.Value = Context.Sender;
            State.AdminAddress.Value = Address.FromBase58(AdminAddress);
            State.TokenContract.Value = Address.FromBase58(TokenContractAddress);

            return new BoolValue { Value = true };
        }

        public override BoolValue SetAdminAddress(SetAdminAddressInput input)
        {
            AssertIsOwner();
            try
            {
                State.AdminAddress.Value = input.Address;
                return new BoolValue { Value = true };
            }
            catch (Exception)
            {
                return new BoolValue { Value = false };
            }
        }

        public override BoolValue AddPaymentToken(PaymentTokenInput input)
        {
            AssertIsOwner();
            try
            {
                if (State.PaymentTokenList[input.Address] != null) return new BoolValue { Value = true };
                State.PaymentTokenList[input.Address] = input.Address;
                return new BoolValue { Value = true };
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
                Assert(State.PaymentTokenList[input.PaymentToken] == null, "Does Not Support this Payment Token.");

                List<ItemsDAO> itemsList = State.ItemsList[input.PaymentToken];
                foreach (ItemsDAO items in itemsList)
                {
                    Assert(items.ItemsId != input.ItemsId, "Items Already Exists.");
                }

                itemsList.Add(new ItemsDAO
                {
                    ItemsId = input.ItemsId,
                    IsAvailable = input.IsAvailable,
                    CanBuy = input.CanBuy,
                    ItemsPrice = input.ItemsPrice
                });

                State.ItemsList[input.PaymentToken] = itemsList;

                return new BoolValue { Value = true };
            }
            catch (Exception)
            {
                return new BoolValue { Value = false };
            }
        }

        public override BoolValue RemoveItems(RemoveItemsInput input)
        {
            return new BoolValue { Value = true };
        }

        public override BoolValue PurchaseItems(PurchaseItemsInput input)
        {
            try
            {
                long spenderBalance = State.TokenContract.GetBalance.Call(new GetBalanceInput
                {
                    Symbol = _symbol,
                    Owner = Context.Sender
                }).Balance;

                State.TokenContract.GetAllowance.Call(new GetAllowanceInput
                {
                    Owner = Context.Sender, // The address that approved the tokens
                    Spender = State.AdminAddress.Value, // The contract address
                    Symbol = "ELF"
                });

                Assert(spenderBalance >= input.Amount, "Not Enough Token.");

                State.TokenContract.TransferFrom.Send(new TransferFromInput
                {
                    From = Context.Sender,
                    To = State.AdminAddress.Value,
                    Symbol = _symbol,
                    Amount = input.Amount,
                });

                Context.Fire(new PurchaseItemsEvent
                {
                    Spender = Context.Sender,
                    Price = input.Amount
                });
                return new BoolValue { Value = true };

            }
            catch (Exception)
            {
                return new BoolValue { Value = false };
            }
        }

        private void AssertIsOwner()
        {
            Assert(Context.Sender == State.Owner.Value, "Unauthorized to perform the action.");
        }

        public override Int64Value BalanceOf(BalanceOfInput input)
        {
            var balance = State.TokenContract.GetBalance.Call(new GetBalanceInput
            {
                Owner = input.Address,
                Symbol = _symbol
            }).Balance;

            return new Int64Value { Value = balance };
        }

        public override StringValue GetOwner(Empty input)
        {
            return new StringValue { Value = Context.Sender.ToBase58() };
        }

        public override StringValue GetAdminAddress(Empty input)
        {
            return State.AdminAddress.Value == null ? new StringValue() : new StringValue { Value = State.AdminAddress.Value.ToBase58() };
        }
    }
}