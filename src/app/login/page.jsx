"use client";
import React, { useState } from "react";
import { useRouter } from 'next/router';
import styles from "./page.module.css";

export default function LoginPage() {
    const [passwordVisibility, setPasswordVisibility] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    async function handleSubmit(event) {
        event.preventDefault();
        const username = "Chris";
        try {
            await fetch('/api/add-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password })
            });
        } catch (error) {
            console.error(error);
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