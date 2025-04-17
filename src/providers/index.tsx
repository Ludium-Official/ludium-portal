import client from "@/apollo/client"
import { AuthProvider } from "@/providers/auth-provider"
import { ApolloProvider } from "@apollo/client"
import { BrowserRouter } from "react-router"

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <AuthProvider>
          {children}
        </AuthProvider>
      </BrowserRouter>
    </ApolloProvider>
  )
}

export default Providers