// hooks/useWeb3Auth.ts
import { useState, useEffect } from 'react';
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { WALLET_ADAPTERS, CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import Web3 from "web3";

const clientId = "BH_7mS379FtqLTkrfZU8t62EizLazFcK0JxDiUhSQT5Aegn9v17ym_bPY4II4c0bU0TwNyZd_YNpk9Pbn_MEMwg";

export const useWeb3Auth = () => {
  const [web3auth, setWeb3auth] = useState<Web3AuthNoModal | null>(null);
  const [provider, setProvider] = useState<any>(null);
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [address, setAddress] = useState<string>("");
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isWeb3AuthReady, setIsWeb3AuthReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      console.log("Initializing Web3Auth...");
      try {
        const chainConfig = {
          chainNamespace: CHAIN_NAMESPACES.EIP155,
          chainId: "0x1", // Ethereum mainnet
          rpcTarget: "https://rpc.ankr.com/eth",
          displayName: "Ethereum Mainnet",
          blockExplorer: "https://etherscan.io",
          ticker: "ETH",
          tickerName: "Ethereum",
        };
        console.log("Chain config:", chainConfig);

        const web3auth = new Web3AuthNoModal({
          clientId,
          chainConfig,
          web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
        });
        console.log("Web3AuthNoModal instance created");

        const privateKeyProvider = new EthereumPrivateKeyProvider({ config: { chainConfig } });
        console.log("EthereumPrivateKeyProvider instance created");

        const openloginAdapter = new OpenloginAdapter({
          privateKeyProvider,
          adapterSettings: {
            uxMode: "popup",
            loginConfig: {
              jwt: {
                verifier: "worldcoin-verifier-google",
                typeOfLogin: "jwt",
                clientId: "7VNFaou1l4orIp3Wk5t9L2Dx02KvwAGD",
              },
            },
          },
        });
        console.log("OpenloginAdapter instance created");

        web3auth.configureAdapter(openloginAdapter);
        console.log("Adapter configured");

        setWeb3auth(web3auth);
        console.log("Web3auth state set");

        await web3auth.init();
        console.log("Web3Auth initialized");

        setIsWeb3AuthReady(true);
        console.log("Web3Auth is ready");

        if (web3auth.provider) {
        console.log("Provider is available");
        setProvider(web3auth.provider);
        const web3Instance = new Web3(web3auth.provider as any);
        setWeb3(web3Instance);
        console.log("Web3 instance created");
        try {
            const accounts = await web3Instance.eth.getAccounts();
            console.log("Accounts:", accounts);
            if (accounts && accounts.length > 0) {
            setAddress(accounts[0]);
            setIsConnected(true);
            console.log("Connected with address:", accounts[0]);
            } else {
            console.log("No accounts found");
            }
        } catch (error) {
            console.error("Error getting accounts:", error);
        }
        } else {
        console.log("Provider is not available");
        }
      } catch (error) {
        console.error("Error during initialization:", error);
      }
    };

    init();
  }, []);

  const login = async () => {
    console.log("Login function called");
    if (!web3auth) {
      console.log("Web3Auth not initialized");
      return;
    }
    if (!isWeb3AuthReady) {
      console.log("Web3Auth is not ready yet");
      return;
    }
    try {
      console.log("Attempting to connect...");
      const web3authProvider = await web3auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
        loginProvider: "jwt",
        extraLoginOptions: {
          domain: "https://dev-afmg3o6c36mhbq4x.us.auth0.com",
          verifierIdField: "sub",
        },
      });
      console.log("Connected successfully");
      setProvider(web3authProvider);
      const web3Instance = new Web3(web3authProvider as any);
      setWeb3(web3Instance);
      console.log("Web3 instance created");
      const accounts = await web3Instance.eth.getAccounts();
      console.log("Accounts:", accounts);
      setAddress(accounts[0]);
      setIsConnected(true);
      console.log("Login successful. Connected with address:", accounts[0]);
    } catch (error) {
      console.error("An error occurred during login:", error);
    }
  };

  const logout = async () => {
    console.log("Logout function called");
    if (!web3auth) {
      console.log("Web3Auth not initialized");
      return;
    }
    try {
      await web3auth.logout();
      console.log("Logged out from Web3Auth");
      setProvider(null);
      setWeb3(null);
      setAddress("");
      setIsConnected(false);
      console.log("Local state reset");
    } catch (error) {
      console.error("An error occurred during logout:", error);
    }
  };

  return { web3, address, isConnected, login, logout, isWeb3AuthReady };
};;;