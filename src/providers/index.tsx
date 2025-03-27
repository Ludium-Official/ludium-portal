import client from "@/apollo/client"
import { AuthProvider } from "@/providers/auth-provider"
import { ApolloProvider } from "@apollo/client"

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ApolloProvider>
  )
}

export default Providers