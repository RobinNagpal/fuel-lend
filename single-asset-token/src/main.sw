// ERC20 equivalent in Sway.
contract;

use src3::SRC3;
use src5::{AccessError, SRC5, State};
use src20::SRC20;
use std::{
    asset::{
        burn,
        mint_to,
        transfer,
        mint,
    },
    call_frames::{
        contract_id,
        msg_asset_id,
    },
    constants::{
        DEFAULT_SUB_ID,
        ZERO_B256,
    },
    context::{
        msg_amount,
        balance_of,
    },
    string::String,
};

abi SingleAsset {
    #[storage(read, write)]
    fn constructor(owner_: Identity);

    #[storage(read)]
    fn get_asset_id() -> AssetId; // New function to return AssetId
    #[storage(read, write)]
    fn transferTo(to: Identity, amount: u64);
    fn heavyfn(asset: AssetId) -> String;
    fn getMsgSender() -> Identity;
    fn getBalance(target: ContractId) -> u64;
}

configurable {
    DECIMALS: u8 = 9u8,
    NAME: str[7] = __to_str_array("MyAsset"),
    SYMBOL: str[5] = __to_str_array("MYTKN"),
}

storage {
    total_supply: u64 = 0,
    owner: State = State::Uninitialized,
    symbol: str[5] = __to_str_array("MYTKN"),
}

impl SRC20 for Contract {
    #[storage(read)]
    fn total_assets() -> u64 {
        1
    }

    #[storage(read)]
    fn total_supply(asset: AssetId) -> Option<u64> {
        if asset == AssetId::default() {
            Some(storage.total_supply.read())
        } else {
            None
        }
    }

    #[storage(read)]
    fn name(asset: AssetId) -> Option<String> {
        if asset == AssetId::default() {
            Some(String::from_ascii_str(from_str_array(NAME)))
        } else {
            None
        }
    }

    #[storage(read)]
    fn symbol(asset: AssetId) -> Option<String> {
        if asset == AssetId::default() {
            Some(String::from_ascii_str("Hello World"))
        } else {
            None
        }
    }

    #[storage(read)]
    fn decimals(asset: AssetId) -> Option<u8> {
        if asset == AssetId::default() {
            Some(DECIMALS)
        } else {
            None
        }
    }
}

#[storage(read)]
fn require_access_owner() {
    require(
        storage
            .owner
            .read() == State::Initialized(msg_sender().unwrap()),
        AccessError::NotOwner,
    );
}

impl SingleAsset for Contract {
    #[storage(read, write)]
    fn constructor(owner_: Identity) {
        require(
            storage
                .owner
                .read() == State::Uninitialized,
            "owner-initialized",
        );
        storage.owner.write(State::Initialized(owner_));
    }

    #[storage(read)]
    fn get_asset_id() -> AssetId {
        AssetId::default() // Return the default AssetId
    }

    #[storage(read, write)]
    fn transferTo(to: Identity, amount: u64) {
        mint(ZERO_B256, amount);
        transfer(to, AssetId::default(), amount);
    }

    fn getBalance(target: ContractId) -> u64 {
        balance_of(target, AssetId::default())
    }

    fn heavyfn(asset: AssetId) -> String {
        String::from_ascii_str(from_str_array(SYMBOL))
    }

    fn getMsgSender() -> Identity {
        msg_sender().unwrap()
    }
}

impl SRC5 for Contract {
    #[storage(read)]
    fn owner() -> State {
        storage.owner.read()
    }
}

impl SRC3 for Contract {
    #[storage(read, write)]
    fn mint(recipient: Identity, sub_id: SubId, amount: u64) {
        require(sub_id == DEFAULT_SUB_ID, "incorrect-sub-id");
        require_access_owner();

        storage
            .total_supply
            .write(amount + storage.total_supply.read());
        mint_to(recipient, DEFAULT_SUB_ID, amount);
    }

    #[storage(read, write)]
    fn burn(sub_id: SubId, amount: u64) {
        require(sub_id == DEFAULT_SUB_ID, "incorrect-sub-id");
        require(msg_amount() >= amount, "incorrect-amount-provided");
        require(
            msg_asset_id() == AssetId::default(),
            "incorrect-asset-provided",
        );
        require_access_owner();

        storage
            .total_supply
            .write(storage.total_supply.read() - amount);
        burn(DEFAULT_SUB_ID, amount);
    }
}
