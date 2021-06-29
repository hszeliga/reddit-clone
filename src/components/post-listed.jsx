import React from "react";
import {auth} from "utils/nhost";
import Link from "next/link";
import { SvgArrowUp, SvgArrowDown, SvgEdit, SvgDelete } from "components/svg";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import classNames from "classnames";

const DELETE_POST = gql`
mutation deletePost($post_id: uuid!){
    delete_posts_by_pk(id: $post_id){
        id
    }
}
`;

const UPSERT_POST_VOTE = gql`
mutation upsertPostVote($post_vote: post_votes_insert_input!){
    insert_post_votes_one(
        object: $post_vote
        on_conflict: {
            constraint: post_upvotes_post_id_user_id_key
            update_columns: vote_type
        }
    ) {
        id
    }
}
`;

export function PostListed({post, signedIn}){
    const [deletePost] = useMutation(DELETE_POST);
    const[upsertPostVote] = useMutation(UPSERT_POST_VOTE);

    const vote = post.post_upvotes ? post.post_upvotes[0] : null;

    const upVoteClasses = classNames([
        "cursor-pointer hover:bg-green-700 rounded-full hover:text-white p-2 transition-all ease-in-out duration-150",
        {
            "bg-green-200": vote?.vote_type===1,
        },
    ]);

    const downVoteClasses = classNames([
        "cursor-pointer hover:bg-red-700 rounded-full hover:text-white p-2 transition-all ease-in-out duration-150",
        {
            "bg-red-200": vote?.vote_type===-1,
        },
    ]);


    return (
        <div className="flex shadow-md p-6">
            <div className="flex flex-col items-center">
                <div>
                    <div className={upVoteClasses} onClick={async () => {
                        try {
                            await upsertPostVote({
                                variables: {
                                    post_vote: {
                                        post_id: post.id,
                                        vote_type: 1,
                                    },
                                },
                            });
                            
                        } catch (error) {
                            console.error(error)
                            return alert("You have to be logged in to upvote");
                        }
                    }}>
                    <SvgArrowUp className="w-6 h-6" /></div>
                </div>
                <div className="py-4"> 
                {post.post_upvotes_aggregate.aggregate.sum.vote_type ? 
                post.post_upvotes_aggregate.aggregate.sum.vote_type : 0}
                </div>
                <div>
                    <div className={downVoteClasses} onClick={async () => {
                        try {
                            await upsertPostVote({
                                variables: {
                                    post_vote: {
                                        post_id: post.id,
                                        vote_type: -1,
                                    },
                                },
                            });
                            
                        } catch (error) {
                            console.error(error)
                            return alert("You have to be logged in to downvote");
                        }
                    }}>
                    <SvgArrowDown className="w-6 h-6" />
                    </div>
                </div>
            </div>
            <div className="pl-6">
                <div className="text-3xl font-semibold">{post.title}</div>
                <div className="text-sm py-2">Created by {post.user.display_name}</div>
                <div className="text-gray-800 py-4">{post.description}</div>
                {signedIn && post.user_id === auth.getClaim("x-hasura-user-id") && (
                  <div className="flex items-center">
                    <div><Link href={`/post/${post.id}/edit`}><a><SvgEdit className="w-6 h-6" /></a></Link></div>
                    <div className="px-4">
                        <div className="cursor-pointer" onClick={ async() => {
                            console.log("delete post")
                            try {
                                await deletePost({
                                    variables: {
                                        post_id: post.id,
                                    },
                                });
                            } catch (error) {
                                console.error(error);
                                return alert("Failed to delete post");
                            }
                            }}>
                        <SvgDelete className="w-6 h-6" />
                        </div>
                    </div>
                    </div>  
                )
                }
                
            </div>  
        </div>
    );
}