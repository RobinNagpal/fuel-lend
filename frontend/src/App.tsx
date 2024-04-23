import { useEffect, useState } from "react";
import { useConnectUI, useIsConnected, useWallet } from "@fuels/react";
import { AssetId, Address } from "fuels";
// Import the contract factory -- you can find the name in src/contracts/contracts/index.ts.
// You can also do command + space and the compiler will suggest the correct name.
import type { SingleAssetTokenAbi } from "./sway-api";
import { SingleAssetTokenAbi__factory } from "./sway-api";

const CONTRACT_ID =
  "0x9db383b9edfb451bc8ebe052a97ec7897f0605d438dc734deffc55a28a7186cb";

export default function Home() {
  const [contract, setContract] = useState<SingleAssetTokenAbi>();
  const [assetID, setAssetId] = useState<string>();
  const { connect, isConnecting } = useConnectUI();
  const { isConnected } = useIsConnected();
  const { wallet } = useWallet();
  const owner =
    "0xd6c0984cd2a65029b2eeb10b123050dbbe6de0d019daf7129589c225019824da";

  const mintToAddress =
    "0x11244cd0ed3efa12dc828de3cf0b98716f894486a27eb7d801820665a94c27e3";

  const sub_id =
    "0x0000000000000000000000000000000000000000000000000000000000000000";

  useEffect(() => {
    async function getInitialCount() {
      console.log("isConnected", isConnected, wallet);
      if (isConnected && wallet) {
        const counterContract = SingleAssetTokenAbi__factory.connect(
          CONTRACT_ID,
          wallet
        );
        // await getCount(counterContract);
        setContract(counterContract);
      }
    }
    getInitialCount();
  }, [isConnected, wallet]);

  const onIncrementPressed = async () => {
    if (!contract) {
      return alert("Contract not loaded");
    }
    try {
      const valuee = await contract.functions
        .get_asset_id()
        .txParams({
          gasPrice: 1,
          gasLimit: 100_000,
        })
        .simulate();
      const astId: AssetId = { value: valuee.value.value.toString() };
      setAssetId(valuee.value.value.toString());

      const addr = Address.fromString(owner);
      const addrInput = { value: addr.toB256() };

      const addrForMinting = Address.fromString(mintToAddress);
      const AddrInputForMinting = { value: addrForMinting.toB256() };

      const bb = Address.fromString(mintToAddress);
      const addrInputForMinting = { value: bb.toB256() };

      // This Call is to mint the token to a specific address

      // const minting = await contract.functions
      //   .mint({ Address: AddrInputForMinting }, sub_id, 5)
      //   .txParams({
      //     gasPrice: 1,
      //     gasLimit: 200_000,
      //   })
      //   .call();


      // This call is to the constructor to set the owner of the contract

      // const cons = await contract.functions
      //   .constructor({ Address: addrInput })
      //   .txParams({
      //     gasPrice: 1,
      //     gasLimit: 200_000,
      //   })
      //   .call();

      // All this address stuff I'm still trying, will clean up once I am done
      const transferTo =
        "0x1e71782e1345ada5a381b7f0416f341b11ce23f69c033141a63e2263e835cfb9";

      const addrForTransferring = Address.fromString(transferTo);
      const AddrInputForTransferring = { value: addrForTransferring.toB256() };

      // Call to transfer token to an Address and Contract

      // const transferTokens = await contract.functions
      //   .transferTo({ Address: AddrInputForTransferring }, 3)
      //   .txParams({
      //     gasPrice: 1,
      //     gasLimit: 200_000,
      //   })
      //   .call();

      // Currently working on this call to get the balance of the contract
      const balance = await contract.functions
        .getBalance({ value: transferTo.toString() })
        .txParams({
          gasPrice: 1,
          gasLimit: 200_000,
        })
        .call();

      console.log("balance: ", balance);

      // const value = await contract.functions.owner().simulate();
      const ts = await contract.functions.total_supply(astId).simulate();
      // console.log("tranfer: ", transferTokens);

      // const ownerr = await contract.functions.getMsgSender().call();
      console.log("total supply", ts);

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={styles.root}>
      <div style={styles.container}>
        {isConnected ? (
          <>
            <h3 style={styles.label}>Counter</h3>
            <div style={styles.counter}>{assetID ?? 0}</div>
            <button onClick={onIncrementPressed} style={styles.button}>
              Increment Counter
            </button>
          </>
        ) : (
          <button
            onClick={() => {
              connect();
            }}
            style={styles.button}
          >
            {isConnecting ? "Connecting" : "Connect"}
          </button>
        )}
      </div>
    </div>
  );
}

const styles = {
  root: {
    display: "grid",
    placeItems: "center",
    height: "100vh",
    width: "100vw",
    backgroundColor: "black",
  } as React.CSSProperties,
  container: {
    color: "#ffffffec",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  } as React.CSSProperties,
  label: {
    fontSize: "28px",
  },
  counter: {
    color: "#a0a0a0",
    fontSize: "48px",
  },
  button: {
    borderRadius: "8px",
    marginTop: "24px",
    backgroundColor: "#707070",
    fontSize: "16px",
    color: "#ffffffec",
    border: "none",
    outline: "none",
    height: "60px",
    padding: "0 1rem",
    cursor: "pointer",
  },
};
