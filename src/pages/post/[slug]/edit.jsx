import React, {useState} from "react";
import { useRouter } from 'next/router';
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/client";
import { Layout, Main } from "components/layout";
import Head from 'next/head';

const GET_POST = gql`
query getPost($post_id: uuid!) {
  post: posts_by_pk(id: $post_id){
    id
    title
    description
  }
}
`;

const UPDATE_POST = gql`
mutation updatePost($post_id: uuid!, $post: posts_set_input!) {
  update_posts_by_pk(pk_columns: {id: $post_id}, _set: $post){
      id
      title
      description
  }
}
`;

function EditPost({post}){
    const [title, setTitle] = useState(post.title);
    const [description, setDescription] = useState(post.description);
    const router = useRouter();


    const [updatePost] = useMutation(UPDATE_POST); 

    async function handleSubmit(e){
        e.preventDefault();
        try {
            await updatePost({
                variables: {
                    post_id: post.id,
                    post: {
                        title,
                        description,
                    },
                },
            });
        } catch (error) {
            console.error(error);
            return alert("Failed to update post");
        }
        router.push("/");
    }

    return (
        <Layout>
        <Head>
          <title>Reddit clone - edit post</title>
        </Head>
        <Main>
            <form onSubmit={handleSubmit}>
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
                Edit post
                </button>
            </div>
            </form>
        </Main>
        </Layout>
    );
}

export default function Edit(){
    const router = useRouter()
    const { slug } = router.query;

    const { loading, error, data } = useQuery(GET_POST, {
        variables: {
            post_id: slug,
        },    
    });

    if(loading){
        return <div>Loading...</div>;
    }

    if(error){
        console.error(error);
        return <div>Error...</div>;
    }

    const { post } = data;

    return <EditPost post={post} />;
}