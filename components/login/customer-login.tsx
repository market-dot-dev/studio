'use client'
import { TextInput, Button } from "@tremor/react";
import { useState } from "react";

export default function CustomerLogin({ csrfToken }: { csrfToken?: string }) {
    const [message, setMessage] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.target);
        const urlEncodedData = new URLSearchParams(formData as any).toString();
        
        try {
            const response = await fetch('/api/auth/signin/email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: urlEncodedData
            });

            setIsSubmitted(true);
            if (response.status === 200) {
                setMessage('A login link has been sent to your email.');
            } else {
                setIsError(true);
                setMessage('An error has occurred.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setIsSubmitted(true);
            setIsError(true);
            setMessage('An error has occurred.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {!isSubmitted ? (
                <form onSubmit={handleSubmit}>
                    <input name="csrfToken" type="hidden" value={csrfToken} />
                    <label className="block text-sm text-slate-400 text-center mb-4">Enter your email to receive a magic link.</label>
                    <div className="flex flex-row gap-4 w-full">
                        <div className="items-center w-full">
                            <TextInput placeholder="Enter your work email" id="input-email-for-email-provider" name="email" autoFocus />
                        </div>
                        <div className="items-center">
                            <Button type="submit" id="submitButton" loading={isSubmitting} disabled={isSubmitting}>Get Link</Button>
                        </div>
                    </div>
                </form>
            ) : (
                <div className={`text-center mt-4 ${isError ? 'text-red-500' : 'text-black'}`}>
                    {message}
                </div>
            )}
        </>
    );
}
