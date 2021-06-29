import gql from "graphql-tag";
import { useSubscription } from "@apollo/client";
import {auth} from "utils/nhost";
import { PostListed } from "./post-listed";


const S_GET_POSTS = gql`
subscription getPostsSignedIn($user_id: uuid!) {
  posts{
    id
    title
    description
    created_at
    user_id
    user {
      id
      display_name
    }
    post_upvotes (where: {user_id: {_eq: $user_id}}){
      vote_type
    }
    post_upvotes_aggregate {
      aggregate {
        sum {
          vote_type
        }
      }
    }
  }
}
`;

export function ListPostsSignedIn(){
  const { loading, error, data } = useSubscription(S_GET_POSTS, {
    variables: {
      user_id: auth.getClaim("x-hasura-user-id"),
    },
  });

  if(loading && !data){
    return <div>Post loading...</div>;
  }

  if(error){
    console.error(error);
    return <div>Error loading posts</div>;
  }

  const { posts } = data;

  return (
    <div className="my-8">
        {posts.map(post => {
          return  <PostListed key={post.id} post={post} signedIn={true} />;
        })}
    </div>
  );
}