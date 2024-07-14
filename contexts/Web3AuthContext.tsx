// contexts/Web3AuthContext.tsx

import React, { createContext, useContext } from 'react';
import { useWeb3Auth } from '../hooks/useWeb3Auth';

type Web3AuthContextType = ReturnType<typeof useWeb3Auth>;

const Web3AuthContext = createContext<Web3AuthContextType | null>(null);

export function Web3AuthProvider({ children }: { children: React.ReactNode }) {
  const web3AuthState = useWeb3Auth();
  
  return (
    <Web3AuthContext.Provider value={web3AuthState}>
      {children}
    </Web3AuthContext.Provider>
  );
}

export function useWeb3AuthContext() {
  const context = useContext(Web3AuthContext);
  if (context === null) {
    throw new Error("useWeb3AuthContext must be used within a Web3AuthProvider");
  }
  return context;
}