import { NhostAuthProvider } from "@nhost/react-auth";
import { NhostApolloProvider } from "@nhost/react-apollo";
import { auth } from "utils/nhost.js";
import "styles/tailwind.css";

function MyApp({ Component, pageProps }) {
  return(
    <NhostAuthProvider auth={auth}>
      <NhostApolloProvider
        auth={auth}
        gqlEndpoint={`https://hasura-9e2a9b0d.nhost.app/v1/graphql`}
      >
      <Component {...pageProps} />
      </NhostApolloProvider>
    </NhostAuthProvider>
  );
}

export default MyApp;
