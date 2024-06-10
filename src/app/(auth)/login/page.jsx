"use client";
import RequiredInput from "@/components/form-groups/input-helper/RequiredInput";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
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
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <form onSubmit={handleSubmit} className={styles.loginForm}>

                <h2 style={{ marginBottom: '1rem' }}>Welcome to Techflix</h2>

                <div className='normalInput' style={{ width: '100%' }}>
                    <RequiredInput required labelFor={"email"}>Email</RequiredInput>
                    <input
                        name="email" id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                        required className='textField' autoComplete="username" style={{ width: '100%' }}
                    />
                </div>

                <div className='normalInput' style={{ width: '100%' }}>
                    <RequiredInput required labelFor={"password"}>Password</RequiredInput>
                    <div className={styles.passwordContainer}>
                        <input
                            name="password" id="password" type={passwordVisibility ? 'text' : 'password'} value={password}
                            onChange={(e) => setPassword(e.target.value)} required
                            className='textField' autoComplete="current-password" style={{ width: '100%' }}
                        />
                        <div onClick={() => setPasswordVisibility(!passwordVisibility)} className={styles.toggleButton}>
                            {passwordVisibility
                                ? <AiFillEyeInvisible />
                                : <AiFillEye />
                            }
                        </div>
                    </div>
                </div>

                <div className="formError" style={{ display: message ? 'block' : 'none' }}>
                    {message}
                </div>
                <button type="submit" className={styles.loginButton}>Sign In</button>
            </form>
        </div>
    );
}