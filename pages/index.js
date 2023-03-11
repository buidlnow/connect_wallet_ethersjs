import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState } from 'react';
import { ethers } from 'ethers';
export default function Home() {
  const [addi, setPublickey] = useState();
  const [network, setNetwork] = useState();
  const [chainId, setChainId] = useState();
  const [msg, setMsg] = useState();

  const connectButton = async () => {
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    if (ethereum.isMetaMask) {
      const accounts = await provider.send("eth_requestAccounts", [])
      const { name, chainId } = await provider.getNetwork();
      setNetwork(name);
      setChainId(chainId);
      setPublickey(accounts[0]);
    } else {
      setMsg("Install MetaMask");
    }
  };

  const avlNetwork = {
    137: {
      chainId: `0x${Number(137).toString(16)}`,
      rpcUrls: ["https://polygon-rpc.com"],
      chainName: "Polygon Mainnet",
      nativeCurrency: {
        name: "MATIC",
        symbol: "MATIC",
        decimals: 18
      },
      blockExplorerUrls: ["https://polygonscan.com/"]
    },
    43114: {
      chainId: `0x${Number(43114).toString(16)}`,
      rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
      chainName: "Avalanche C-Chain",
      nativeCurrency: {
        name: "Avalanche",
        symbol: "AVAX",
        decimals: 18
      },
      blockExplorerUrls: ["https://snowtrace.io/"]
    }
  };

  const switchNetwork = async (chainId) => {
    try {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [avlNetwork[`${chainId}`]]
      });
      setNetwork(avlNetwork[`${chainId}`].chainName);
      setChainId(chainId);
    } catch (error) {
      setMsg(error);
    }
  };

  return (
    <>
      <Head>
        <title>buidlnow</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className={styles.main}>
      <div className="App">
      <h1>Connect with Ethers.JS</h1>
      <button onClick={connectButton}>Connect Wallet</button>
      <br />
      <button className="btn" onClick={() => switchNetwork(137)}>
        Connect Polygon
      </button>
      <br />
      <button className="btn" onClick={() => switchNetwork(43114)}>
        Connect Avalanche
      </button>
      <p>Address: {addi}</p>
      <p>Network: {network}</p>
      <p>Chain ID : {chainId}</p>
      {msg && <p>{msg}</p>}
    </div>
      </main>
    </>
  )
}
