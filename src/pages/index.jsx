import { Layout, Main } from "components/layout";
import { useAuth } from "@nhost/react-auth";
import { ListPostsSignedIn } from "components/list-posts-signed-in";
import { ListPostsSignedOut } from "components/list-posts-signed-out";
import Head from 'next/head';

export default function Home() {

  const {signedIn} = useAuth();

  return (
    <Layout>
      <Head>
          <title>Reddit clone - home</title>
        </Head>
      <Main>{signedIn ? <ListPostsSignedIn /> : <ListPostsSignedOut />}</Main>
    </Layout>
  );
}
