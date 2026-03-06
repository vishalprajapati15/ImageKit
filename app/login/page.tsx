'use client'
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { use, useState } from 'react'

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const res = await signIn("credentials", {
            email,
            password,
            redirect: false
        });
        if (!res?.error) {
            console.log("Login Error : ", res?.error);
        }
        else {
            router.push('/');
        }

    };


    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
            <div>
                Don't have an account?
                <button onClick={() => router.push('/register')}>Register</button>
            </div>
        </div>
    )
}

export default LoginPage;