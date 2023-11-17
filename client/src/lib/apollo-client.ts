import { HttpLink, InMemoryCache } from "@apollo/client";
import { registerApolloClient } from "@apollo/experimental-nextjs-app-support/rsc";
import { NextSSRApolloClient } from "@apollo/experimental-nextjs-app-support/ssr";

export const { getClient } = registerApolloClient(() => {
  return new NextSSRApolloClient({
    credentials: "include",
    cache: new InMemoryCache(),
    headers: {
      withCredentials: "true",
    },
    link: new HttpLink({
      credentials: "include",
      uri: `${process.env.SERVER_URL}/graphql`,
    }),
  });
});
