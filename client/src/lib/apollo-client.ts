import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { registerApolloClient } from "@apollo/experimental-nextjs-app-support/rsc";

export const { getClient } = registerApolloClient(() => {
  return new ApolloClient({
    credentials: "include",
    cache: new InMemoryCache(),
    headers: {
      withCredentials: "true",
    },
    link: new HttpLink({
      credentials: "include",
      uri: "http://localhost:4000/graphql",
    }),
  });
});
