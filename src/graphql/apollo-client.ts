import {ApolloClient, InMemoryCache} from "@apollo/client";
import { CONFIG } from "@config";

export const apolloClient = new ApolloClient({
  uri: CONFIG.GRAPHQL_URL,
  cache: new InMemoryCache(),
})

