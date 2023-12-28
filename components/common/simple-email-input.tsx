'use client'
import { TextInput, Button } from "@tremor/react";
import { addUserToWaitlist } from "@/lib/waitlist/actions";
import { useState } from "react";
import Link from "next/link";


export default function SimpleEmailInputForm(props: any) {

    const [errors, setErrors] = useState<any>({});
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [email, setEmail] = useState(props?.email ?? "");
    const buttonLabel = isSaving ? "Saving..." : "Get Updates →";

    const validateForm = () => {
        if (!email) {
            setErrors({ ...errors, name: 'Please enter an email' });
            return false;
        }
        return true;
    }
    
    const onSubmit = async () => {
        if (!validateForm()) return;
        setIsSaving(true);
        try {
            await handleSubmit({ email });
        }
        catch (error) {
            console.log(error);
        }
        setIsSaving(false);
    }
    
    const handleSubmit = async (data : any) => {
        try {
            const result = await addUserToWaitlist(data) as any;
            if(result.id) {
                setIsSaved(true);
            }
    
        } catch (error) {
            console.log(error);
        }
    };    

    const successMessage = 
        <div className="mt-2 ms-2 text-sm text-green-300">
            <p>Thank you! We&apos;ll send you product updates. No spam, we promise.</p>
            <br />
            <p><b>Want to get involved?</b> <Link href="https://form.typeform.com/to/D8fpSsxs" target="_blank" className="underline underline-offset-2">Join our design partnership</Link> to get early access and help shape Gitwallet with other maintainers.</p>
            
        </div>;

    return (
        <>
        <div className="flex inline-flex gap-2 p-1 border-solid border-slate-700 hover:border-slate-200 border-2 rounded-xl">
            <TextInput placeholder={props.placeholder ?? ""} onChange={(e) => setEmail(e.target.value)} />
            <Button size="md" onClick={onSubmit}>
                {buttonLabel}
            </Button>
        </div>
        
        <div>
            {isSaved && successMessage}
        </div>
        </>

    )
}