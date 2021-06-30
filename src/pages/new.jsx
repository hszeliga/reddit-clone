import { useState } from "react";
import { Layout, Main } from "components/layout";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import Head from 'next/head';

const INSERT_POST = gql`
mutation insertPost($post: posts_insert_input!){
  insert_posts(objects: [$post]){
    affected_rows
  }
}
`

export default function New() {
  const[title, setTitle] = useState("");
  const[description, setDescription] = useState("");
  const router = useRouter();
  const[createPost] = useMutation(INSERT_POST);

  async function handleSumbit(e){
    e.preventDefault();
    try {
      await createPost({
        variables: {
          post: {
            title,
            description,
          },
        },
      }); 
    } catch (error) {
      console.error("Inserting post failed")
      return console.error(error);
      
    }

    router.push("/");
  }

  return(
    <Layout>
      <Head>
          <title>Reddit clone - create post</title>
        </Head>
      <Main>
        <form onSubmit={handleSumbit}>
          <div className="py-2">
            <input
              type="text"
              placeholder="Title"
              className="border rounded px-2 py-1 my-2 w-full"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              />
          </div>
          <div className="py-2">
            <textarea
              placeholder="Description"
              className="border rounded px-2 py-1 my-2 w-full"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              />
          </div>
          <div className="py-2">
            <button className="bg-indigo-700 text-white uppercase px-4 py-2 text-sm">
              Create post
            </button>
          </div>
        </form>
      </Main>
    </Layout>
  );
  
}