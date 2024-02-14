'use client'
import { TextInput, Button } from "@tremor/react";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from 'next/navigation'

export default function CustomerLogin({ csrfToken }: { csrfToken?: string }) {
    
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [verificationEmail, setVerificationEmail] = useState<string>('');
    const [verificationCode, setVerificationCode] = useState<string>('');

    const router = useRouter();

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

        // const urlEncodedData = new URLSearchParams(formData as any).toString();
        
        // try {
        //     const response = await fetch('/api/auth/signin/email', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/x-www-form-urlencoded',
        //         },
        //         body: urlEncodedData
        //     });

            
        //     if (response.status === 200) {
        //         setIsSubmitted(true);
        //     } else {
        //         setError('Error submitting form. Please try again.');
        //     }
        // } catch (error) {
        //     console.error('Error submitting form:', error);
        //     setError('Error submitting form. Please try again.');
            
        // } finally {
        //     setIsSubmitting(false);
        // }
    };

    const handleVerification = async (e: any) => {
        e.preventDefault();

        if (!verificationEmail || !verificationCode) return;

        setIsSubmitting(true);

        // signIn('email', {
        //     email: verificationEmail,
        //     token: verificationCode,
        //     redirect: false,
        // }).then((res: any) => {
        //     console.log(res)
        //     if(res.error) {
        //         setError('Unable to verify code. Please try again.');
        //     }
        // }).catch(err => {
        //     console.error('Error verifying code:', err);
        //     setError('Unable to verify code. Please try again.');
        // }).finally(() => {
        //     setIsSubmitting(false);
        // });

        fetch(`/api/auth/callback/email?redirect=false&email=${encodeURIComponent(verificationEmail)}&token=${verificationCode}`).then(res => {
            if(res.status !== 200) {
                setError('Error verifying code. Please try again.');
            } else {
                router.push('/')
            }
        }).catch(err => {
            console.error('Error verifying code:', err);
            setError('Error verifying code. Please try again.');
        }).finally(() => {
            setIsSubmitting(false);
        });
    }

    return (
        <>
            {error ? <>
                <p className="text-red-500">{error}</p>
            </> : null}
            {!isSubmitted ? 
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
