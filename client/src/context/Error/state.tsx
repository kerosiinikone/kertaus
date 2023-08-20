"use client";

import { ApolloError } from "@apollo/client";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

export interface GlobalErrorContextType {
  globalError: Array<ApolloError | undefined>;
  setGlobalError: Dispatch<SetStateAction<Array<ApolloError | undefined>>>;
  addError: (error: Array<ApolloError | undefined>) => void;
}

const initialState: GlobalErrorContextType = {
  globalError: [],
  setGlobalError: () => {},
  addError: () => {},
};

export const GlobalErrorContext =
  createContext<GlobalErrorContextType>(initialState);

export const GlobalErrorContextProvider = ({
  children,
}: React.PropsWithChildren) => {
  const [globalError, setGlobalError] = useState<
    Array<ApolloError | undefined>
  >([]);

  const addError = (errors: Array<ApolloError | undefined>) => {
    const noMsg = errors.filter((e) => e?.message);
    if (errors.length >= 1 && noMsg) {
      setGlobalError((s) => {
        return [...s, ...errors];
      });
    }

    setTimeout(() => {
      setGlobalError([]);
    }, 5000);
  };

  return (
    <GlobalErrorContext.Provider
      value={{ globalError, setGlobalError, addError }}
    >
      {children}
    </GlobalErrorContext.Provider>
  );
};

export const useGlobalErrorContext = () => useContext(GlobalErrorContext);