import React, {useState} from "react";
import {auth} from "utils/nhost";
import { useRouter } from "next/router";
import Link from "next/link";
import { Title } from "components/layout";
import Head from 'next/head';

export default function Register(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    async function handleSubmit(e){
        e.preventDefault();
        try {
            await auth.login({email, password});
        } catch (error) {
            return alert("Login failed");
        }
        router.push("/");
    }
    return( 
        <Title>
            <Head>
                <title>Reddit clone - login</title>
            </Head>
            <div className="flex flex-col max-w-xl mx-auto shadow p-4 my-12">
                <div className="text-center uppercase text-gray-700 pb-4">Login</div>
                    <form onSubmit={handleSubmit}> 
                        <div className="flex flex-col">
                        <input 
                            type="text"
                            placeholder="Email"
                            autoFocus
                            className="border rounded px-2 py-1 my-2"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input 
                            type="password"
                            placeholder="Password"
                            className="border rounded px-2 py-1 my-2"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <div className="flex justify-center">
                        <button className="bg-indigo-700 text-white uppercase px-4 py-2 text-sm">Login</button>
                        </div>
                          <div className="pt-6 text-center text-gray-700">
                            Don&apos;t have an account?&nbsp;&nbsp;
                            <Link href="/register"><a className="text-indigo-700 hover:underline">Register</a></Link>
                        </div>
                        </div>
                    </form>
            </div>
            </Title>
    );
}