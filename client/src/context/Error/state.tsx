"use client";

import { ApolloError } from "@apollo/client";
import { createContext, useContext, useState } from "react";
import { GlobalErrorContextType } from "./types";

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
    Array<ApolloError | undefined | Error>
  >([]);

  const addError = (errors: Array<ApolloError | undefined | Error>) => {
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
