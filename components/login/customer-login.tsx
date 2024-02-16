'use client'
import { TextInput, Button } from "@tremor/react";
import { useEffect, useState } from "react";
import { signIn, signOut } from "next-auth/react";
import { useRouter } from 'next/navigation'
import useCurrentSession, { CurrentSessionProvider } from "@/app/contexts/current-user-context";
import { userExists, signUpUser } from "@/app/services/registration-service";

export function CustomerLoginComponent({ redirect } : { redirect?: string }) {
    
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [verificationEmail, setVerificationEmail] = useState<string>('');
    const [verificationCode, setVerificationCode] = useState<string>('');
    const [isSignUp, setIsSignUp] = useState(false); 
    const [name, setName] = useState<string>('');
    

    const { currentSession, refreshCurrentSession } = useCurrentSession();

    const { user } = currentSession;

    const router = useRouter();


    const handleLogout = () => {
        setIsSubmitting(true);
        signOut({ callbackUrl: '/'});
    }

    const handleEmail = async (e: any) => {
        
        if( !verificationEmail ) {
            setError('Please enter your email.');
            return;
        };

        setIsSubmitting(true);

        // check if user exists
        const exists = await userExists(verificationEmail);

        if( isSignUp ) {
            
            if( !name ) {
                setError('Please enter your name.');
                setIsSubmitting(false);
                return;
            }
            try {
                const res = await signUpUser({
                    email: verificationEmail,
                    name,
                })

                if( res === false ) {
                    setError('User already exists. Please sign in.');
                    setIsSubmitting(false);
                    setIsSignUp(false);
                    return;
                }
            } catch(err) {
                console.error('Error signing up:', err);
                setError('Error signing up. Please try again.');
                setIsSubmitting(false);
                return;
            }

        } else {
            
            if( !exists ) {
                setError('User does not exist. Please sign up.');
                setIsSubmitting(false);
                setIsSignUp(true);
                return;
            }
        }
        
        signIn('email', {
            email: verificationEmail,
            redirect: false,
        }).then((res: any) => {
            if(res.ok) {
                setIsSubmitted(true);
            }
            if(res.error) {
                setError('Error submitting form. Please try again.');
            }
        }).catch(err => {
            
            console.error('Error signing in:', err);
            setError('Error submitting form. Please try again.');

        }).finally(() => {
            setIsSubmitting(false);
        });

    };

    const handleVerification = async (e: any) => {
        e.preventDefault();
        
        if (!verificationEmail || !verificationCode) return;

        setIsSubmitting(true);

        try {
            const res = await fetch(`/api/auth/callback/email?email=${encodeURIComponent(verificationEmail)}&token=${verificationCode}&host=${window.location.origin}`);
            
            if(res.status === 200) {
                if(redirect) {
                    router.push( redirect )
                } else {
                    refreshCurrentSession();
                    setError(null);
                }
            } else {
                setError('Error verifying code. Please try again.');
            }
    
        } catch(err) {
            console.error('Error verifying code:', err);
            setError('Error verifying code. Please try again.');
        } finally {
            setIsSubmitting(false);
        }

    }

    const toggleSignUp = () => setIsSignUp(!isSignUp);

    return (
        <>
            {error ? <div className="flex justify-center w-full text-sm">
                <p className="text-red-500">{error}</p>
                </div> : null}
            {user ? (
                <div className="items-center w-full">
                    <p>Logged in as {user.email}</p>
                    <Button onClick={handleLogout} loading={isSubmitting} disabled={isSubmitting} className="w-full">Logout</Button>
                </div>
            ) : !isSubmitted ? (
                <div>
                    {isSignUp ? (
                        <>
                        <label className="block text-sm text-slate-400 text-center mb-4">Enter your name and email to sign up.</label>
                        <div className="mb-4">
                            <TextInput placeholder="Enter your name" value={name} onChange={(e) => {
                                setName(e.target.value)
                                setError(null);
                            }} autoFocus />
                        </div>
                        </>
                    ) :
                    <label className="block text-sm text-slate-400 text-center mb-4">Enter your email to receive a verification code.</label>
                    }
                    
                    <div className="flex flex-row gap-4 w-full">
                        <div className="items-center w-full">
                            <TextInput placeholder="Enter your email" value={verificationEmail} onChange={(e) => setVerificationEmail(e.target.value)} />
                        </div>
                        <div className="items-center">
                            <Button onClick={handleEmail} loading={isSubmitting} disabled={isSubmitting}>Get Code</Button>
                        </div>
                    </div>
                    <p className="mt-4 text-center text-sm text-slate-500 cursor-pointer" onClick={toggleSignUp}>
                        {isSignUp ? "Already have an account? Sign in here" : "Don't have an account? Sign up here"}
                    </p>
                </div>
            ) : (
                <div>
                    <label className="block text-sm text-slate-400 text-center mb-4">A verification code has been sent to your email. Please enter the value here.</label>
                    <div className="flex flex-row gap-4 w-full">
                        <div className="items-center w-full">
                            <TextInput 
                                placeholder="000000"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                autoFocus />
                        </div>
                        <div className="items-center">
                            <Button onClick={handleVerification} loading={isSubmitting} disabled={isSubmitting}>Verify Code</Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default function CustomerLogin() {
    return (
        <CurrentSessionProvider>
            <CustomerLoginComponent redirect='/' />
        </CurrentSessionProvider>
    );
}