import { ApolloClient, ApolloLink, InMemoryCache, concat, split } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';
// import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';
// import { split } from '@apollo/client';

const httpLink = createUploadLink({
  uri: `${import.meta.env.VITE_SERVER_URL}/graphql`,
  headers: {
    'Apollo-Require-Preflight': 'true',
  },
});

// const httpLink = new HttpLink({
//   uri: `${import.meta.env.VITE_SERVER_URL}/graphql`,
//   headers: {
//     'Apollo-Require-Preflight': 'true',
//   },
// });

const wsLink = new GraphQLWsLink(
  createClient({
    url: import.meta.env.VITE_SERVER_WS_URL ?? '',
    retryAttempts: Number.POSITIVE_INFINITY,
    connectionParams: () => {
      const token = localStorage.getItem('token');
      return {
        authorization: token ? `Bearer ${token}` : '',
      };
    },

    shouldRetry: () => {
      return true;
    },
    retryWait: async () => {
      await new Promise((resolve) => setTimeout(resolve, 3000 + Math.random() * 3000));
    },
  }),
);

const authMiddleware = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem('token');

  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }));

  return forward(operation);
});

// const splitLink = split(
//   ({ query }) => {
//     const definition = getMainDefinition(query);
//     return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
//   },
//   concat(authMiddleware, httpLink),
// );

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
  },
  wsLink,
  concat(authMiddleware, httpLink),
);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: splitLink,
  // link: concat(authMiddleware, httpLink),
  connectToDevTools: true,
  defaultOptions: {
    query: {
      fetchPolicy: 'network-only',
    },
    watchQuery: {
      fetchPolicy: 'network-only',
    },
  },
});

export default client;
