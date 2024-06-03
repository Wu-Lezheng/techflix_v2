"use client";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./page.module.css";

export default function LoginPage(props) {

    const router = useRouter();
    const { data: session, status } = useSession();

    const [passwordVisibility, setPasswordVisibility] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const error = props.searchParams && props.searchParams.error;
    const callbackUrl = props.searchParams && props.searchParams.callbackUrl;

    async function handleSubmit(event) {
        event.preventDefault();
        const res = await signIn("credentials", {
            email: email,
            password: password,
            redirect: false,
        });
        if (!res?.error) {
            router.push(callbackUrl ? callbackUrl : "/home");
        } else {
            setMessage('Authentication failed. Check if you are using the correct email and if the password matches the provided email.');
        }
    }

    return (
        <form onSubmit={handleSubmit} className={styles.loginForm}>
            <label className={styles.loginLabel}>
                <p>Email:</p>
                <input
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={styles.loginInput}
                    autoComplete="username"
                />
            </label>
            <label className={styles.loginLabel}>
                <p>Password:</p>
                <div className={styles.passwordContainer}>
                    <input
                        name="password"
                        type={passwordVisibility ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={styles.loginInput}
                        autoComplete="current-password"
                    />
                    <button type="button" onClick={() => setPasswordVisibility(!passwordVisibility)} className={styles.toggleButton}>
                        {passwordVisibility ? "hide" : "show"}
                    </button>
                </div>
            </label>
            <div className={styles.message} style={{ display: message ? 'block' : 'none' }}>
                {message}
            </div>
            <button type="submit" className={styles.loginButton}>Submit</button>
        </form>
    );
}