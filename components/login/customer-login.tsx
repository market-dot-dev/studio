'use client'
import { TextInput, Button } from "@tremor/react";
import { useRef, useState } from "react";
import { signIn, signOut } from "next-auth/react";
import { useRouter } from 'next/navigation'
import { userExists, setSignUp } from "@/app/services/registration-service";
import OTPInputElement from "./otp-input-element"
import useCurrentSession from "@/app/hooks/use-current-session";


// usign a local variable to avoid state update delays

export function CustomerLoginComponent({ redirect, signup = false } : { redirect?: string, signup?: boolean }) {
    let handlingVerificationRef = useRef(false);

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [verificationEmail, setVerificationEmail] = useState<string>('');
    const { refreshSession, currentUser, isSignedIn } = useCurrentSession();
    
    const [isSignUp, setIsSignUp] = useState(signup); 
    const [name, setName] = useState<string>('');
    
    const router = useRouter();

    const handleLogout = async () => {
        setIsSubmitting(true);
        try {
            await signOut({ redirect: false });
            window.location.reload();
        } catch(err) {
            console.error('Error logging out:', err);
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleEmail = async (e: any) => {
        
        if( !verificationEmail ) {
            setError('Please enter your email.');
            return;
        };

        // check for email format
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if( !re.test(String(verificationEmail).toLowerCase())) {
            setError('Please enter a valid email.');
            return;
        }

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
                const res = await setSignUp({
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
                console.log('res', res)
                setError('Error submitting form. Please try again.');
            }
        }).catch(err => {
            setError(`There was an error beginning registration. ${err}`);
            setIsSubmitted(false);

        }).finally(() => {
            setIsSubmitting(false);
        });
    };
 
    const handleVerification = async (verificationCode: string) => {
        // e.preventDefault();
        
        if (!verificationEmail || !verificationCode) return;
        
        if(handlingVerificationRef.current || isSubmitting) return;
        handlingVerificationRef.current = true;

        setIsSubmitting(true);

        const verificationUrl = `/api/auth/callback/email?email=${encodeURIComponent(verificationEmail)}&token=${verificationCode}`;

        fetch(verificationUrl).then(async (res) => {
            if(res.status === 200 || res.status === 302 || res.status === 0) {
                if(redirect) {
                    router.push( redirect )
                } else {
                    window.location.reload();
                }
                setError(null);
            } else {
                setError(`The code you entered is invalid. Please check your email and try again.`);
                console.log(`Error verifying code. Please try again. ${res.status}`);
                console.log(res);
            }
        }).catch(err => {
            console.error('Error verifying code:', err);
            setError('Error verifying code. Please try again.');
        }).finally(() => {
            setIsSubmitting(false);
            handlingVerificationRef.current = false;
        });
    }

    const toggleSignUp = () => setIsSignUp(!isSignUp);

    return (
        <>
            {error && (
                <div className="flex justify-center w-full text-md">
                    <p className="text-red-500">{error}</p>
                </div>
            )}
            {currentUser ? (
                <div className="flex flex-row justify-between w-full items-center">
                    <span>You are logged in as {currentUser.name} ({currentUser.email}).</span>
                    <Button variant="secondary" onClick={handleLogout} loading={isSubmitting} disabled={isSubmitting} className="p-1 h-min">Logout</Button>
                </div>
            ) : !isSubmitted ? (
                <div>
                    {isSignUp ? (
                        <>
                        <div className="mb-4">
                            <div className="mb-4 text-center">Enter your details to create an account.</div>

                            <strong>Name:</strong>
                            <TextInput placeholder="Enter your name" value={name} onChange={(e) => {
                                setName(e.target.value)
                                setError(null);
                            }} autoFocus />
                        </div>
                        </>
                    ) :
                    <div className="mb-4 text-center">Please enter your email to receive a verification code.</div>
                    }
                    
                    <div className="flex flex-col gap-4 w-full">
                        <div className="items-center w-full">
                            <strong>Email:</strong>
                            <TextInput 
                                placeholder="Your email address"
                                autoFocus={!isSignUp}
                                value={verificationEmail} 
                                onChange={(e) => {
                                    setVerificationEmail(e.target.value)
                                    setError(null);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleEmail(e);
                                    }
                                }}  />
                        </div> 
                        <div className="items-center">
                            <Button onClick={handleEmail} loading={isSubmitting} disabled={isSubmitting} className="w-full">Continue →</Button>
                        </div>
                    </div>
                    <p className="mt-4 text-center text-md text-slate-500 cursor-pointer underline" onClick={toggleSignUp}>
                        {isSignUp ? "Already have an account? Sign in here" : "Don't have an account? Sign up here"}
                    </p>
                </div>
            ) : (
                <div>
                    <label className="block text-md text-slate-500 text-center mb-4">A verification code has been sent to your email. Please enter the value here.</label>
                    <div className="flex flex-col gap-4 w-full items-center">
                        <div className="items-center w-full">

                            <OTPInputElement
                                verifying={isSubmitting}
                                
                                onComplete={(code: any) => {
                                    setError(null);
                                    handleVerification(code);
                                    
                                }}

                                onInput={(e: any) => {
                                    setError(null);
                                }}

                                onPaste={(e: any) => {
                                    
                                    setTimeout(() => {
                                        handleVerification(e.target.value)
                                    }, 0)
                                    
                                    setError(null);
                                }}


                             />

                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default function CustomerLogin() {
    return (
        <CustomerLoginComponent redirect='/' />
    );
}