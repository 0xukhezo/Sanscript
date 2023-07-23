import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const API_URL =
  "https://api.studio.thegraph.com/query/50131/sanscrip/version/v0.0.9";

export const client = new ApolloClient({
  uri: API_URL,
  cache: new InMemoryCache(),
});

export const NewsLetters = (queryBody: string) => gql(queryBody);
