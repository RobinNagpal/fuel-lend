import { useEffect, useState } from "react";
import { useConnectUI, useIsConnected, useWallet } from "@fuels/react";
// Import the contract factory -- you can find the name in src/contracts/contracts/index.ts.
// You can also do command + space and the compiler will suggest the correct name.
import type { SingleAssetTokenAbi } from "./sway-api";
import { SingleAssetTokenAbi__factory } from "./sway-api";

const CONTRACT_ID =
  "0xc5782a69c69cd7631858028c5f48edf5c7a3ef26adda9dd6fe9a40937cb56924";

export default function Home() {
  const [contract, setContract] = useState<SingleAssetTokenAbi>();
  const [assetID, setAssetId] = useState<string>();
  const { connect, isConnecting } = useConnectUI();
  const { isConnected } = useIsConnected();
  const { wallet } = useWallet();

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
    console.log("Hello");
    getInitialCount();
  }, [isConnected, wallet]);

  // const getCount = async (counterContract: SingleAssetTokenAbi) => {
  //   try {
  //     const { value } = await counterContract.functions
  //       .count()
  //       .txParams({
  //         gasPrice: 1,
  //         gasLimit: 100_000,
  //       })
  //       .get();
  //     setCounter(value.toNumber());
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const onIncrementPressed = async () => {
    if (!contract) {
      return alert("Contract not loaded");
    }
    try {
      const value = await contract.functions
        .get_asset_id()
        .txParams({
          gasPrice: 1,
          gasLimit: 100_000,
        })
        .get();
      console.log(value.value.value);
      setAssetId(value.toString());
      // await getCount(contract);
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
