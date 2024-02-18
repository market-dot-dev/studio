import Image from "next/image";

export default function ThanksPage() {
    return (
        <>
            <Image
            alt="Gitwallet"
            width={520}
            height={142}
            className="relative mx-auto h-12 w-auto dark:scale-110 dark:rounded-full dark:border dark:border-stone-400"
            src="/wordmark.png"
            />
            <p className="mt-2 text-center text-md text-stone-600 dark:text-stone-400">Click on the signin link sent to your email.</p>
          
            
        </>
    )
}