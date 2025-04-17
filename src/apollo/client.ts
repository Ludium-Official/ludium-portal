import { ApolloClient, ApolloLink, InMemoryCache, concat } from '@apollo/client';
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';
// import { getMainDefinition } from '@apollo/client/utilities';

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

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: concat(authMiddleware, httpLink),
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
