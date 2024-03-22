import { ApolloError } from "@apollo/client";
import { useEffect } from "react";

interface ErrorStackParams {
  addError: (error: (ApolloError | Error | undefined)[]) => void;
  logoutError: ApolloError | undefined;
  userError: ApolloError | undefined;
  scheduleError: ApolloError | undefined;
}

export const useErrorStack = ({
  addError,
  logoutError,
  scheduleError,
  userError,
}: ErrorStackParams) => {
  useEffect(() => {
    const errorStack: Array<ApolloError | undefined> = [];
    if (logoutError) errorStack.push(logoutError);
    if (scheduleError) errorStack.push(scheduleError);
    if (userError) errorStack.push(userError);
    addError(errorStack);
  }, [logoutError, scheduleError, userError]);
};
