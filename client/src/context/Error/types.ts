import { ApolloError } from "@apollo/client";
import { Dispatch, SetStateAction } from "react";

export interface GlobalErrorContextType {
  globalError: Array<ApolloError | undefined | Error>;
  setGlobalError: Dispatch<
    SetStateAction<Array<ApolloError | undefined | Error>>
  >;
  addError: (error: Array<ApolloError | undefined | Error>) => void;
}
