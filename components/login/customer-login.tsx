'use client'
import { TextInput, Button } from "@tremor/react";
import { useEffect, useState } from "react";
import { signIn, signOut } from "next-auth/react";
import { useRouter } from 'next/navigation'
import useCurrentSession, { CurrentSessionProvider } from "@/app/contexts/current-user-context";

export function CustomerLoginComponent({ redirect } : { redirect?: string }) {
    
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [verificationEmail, setVerificationEmail] = useState<string>('');
    const [verificationCode, setVerificationCode] = useState<string>('');
    

    const { currentSession, refreshCurrentSession } = useCurrentSession();

    const { user } = currentSession;

    const router = useRouter();


    const handleLogout = () => {
        setIsSubmitting(true);
        signOut({ callbackUrl: '/customer-login'});
    }

    const handleEmail = async (e: any) => {
        
        if( !verificationEmail ) return;

        setIsSubmitting(true);
        
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

    return (
        <>
            {error ? <>
                <p className="text-red-500">{error}</p>
            </> : null}
            { user ? <>
                <div className="items-center w-full">
                    <p>Logged in as {user.email}</p>
                    <Button onClick={handleLogout} loading={isSubmitting} disabled={isSubmitting} className="w-full">Logout</Button>
                </div>
            </> :
                !isSubmitted ? 
                    <div>
                        <label className="block text-sm text-slate-400 text-center mb-4">Enter your email to receive a verification code.</label>
                        <div className="flex flex-row gap-4 w-full">
                            <div className="items-center w-full">
                                <TextInput placeholder="Enter your email" value={verificationEmail} onChange={(e) => setVerificationEmail(e.target.value)} autoFocus />
                            </div>
                            <div className="items-center">
                                <Button onClick={handleEmail} loading={isSubmitting} disabled={isSubmitting}>Get Link</Button>
                            </div>
                        </div>
                    </div>
                : 
                
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
            }
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