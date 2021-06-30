import React from "react";
import {auth} from "utils/nhost";
import { useRouter } from "next/router";
import { useAuth } from "@nhost/react-auth";
import Link from "next/link";
import gql from "graphql-tag";
import { useQuery } from "@apollo/client";
import { SvgLogout, SvgAvatar, SvgCreate, SvgLogo } from "components/svg";
import Head from 'next/head';



const GET_USER_DATA = gql`
query getUserData($user_id: uuid!){
    user: users_by_pk(id: $user_id){
        id
        display_name
    }
}
`;

export function UserHeader(){
    const router = useRouter();
    const{loading, error, data } = useQuery(GET_USER_DATA, {
        variables: {
            user_id: auth.getClaim("x-hasura-user-id"),
        },
    });

    if(loading && !data){
        return <div>Loading...</div>
    }

    if(error){
        console.error("error fetching users");
        console.error(error);
        <div>Error</div>
    }

    const { user } = data;

    return (
    <div className="flex items-center">
        <SvgAvatar className="w-6 h-6" /><div className="px-1">{user.display_name}</div>
        <div onClick={ () => {
                                                auth.logout();
                                                router.push("/login");
                                            }
                                            }
                                            className="cursor-pointer px-6"><SvgLogout  className="w-6 h-6" /></div>
    </div>
    )
}

export function Header(){
    const { signedIn } = useAuth();
    return(
        <div className="flex items-center justify-between bg-indigo-700 text-white p-4">
            <div className="flex items-center px-4"><Link href="/"><a><SvgLogo /></a></Link><div className="px-4"><Link href="/"><a>Reddit clone</a></Link></div></div>
            <div className="flex items-center">
                {signedIn && <div className="px-6"><Link href="/new"><a><SvgCreate className="w-6 h-6" /></a></Link></div>}
                <div>
                    {signedIn ? (
                            <UserHeader />
                    ) : (
                        <div>
                        <Link href="/login"><a className="px-4">Login</a></Link>
                        <Link href="/register"><a>Register</a></Link>
                        </div>
                    )}
                    </div>
            </div>
        </div>
    );
}

export function Header2(){
    return(
        <div className="flex items-center justify-between bg-indigo-700 text-white p-4">
            <div className="flex items-center px-4"><Link href="/"><a><SvgLogo /></a></Link><div className="px-4"><Link href="/"><a>Reddit clone</a></Link></div></div>
        </div>
    );
}

export function Main({children}){
    return <div className="container mx-auto">{children}</div>;
}
export function Layout ({children}){
    return(
        <div>
            <Head>
                <title>Reddit clone</title>
            </Head>
            <Header />
            {children}
        </div>
    ); 
}

export function Layout2({children}){
    return(
        <div>
            <Head>
                <title>Reddit clone</title>
            </Head>
            <Header2 />
            {children}
        </div>
    ); 
}