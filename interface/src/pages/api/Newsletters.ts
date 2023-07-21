import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const API_URL =
  "https://api.studio.thegraph.com/query/45707/treasurydao/version/latest";

export const client = new ApolloClient({
  uri: API_URL,
  cache: new InMemoryCache(),
});

export const NewsLetters = (queryBody: string) => gql(queryBody);
