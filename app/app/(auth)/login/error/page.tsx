import Image from "next/image";

export default function ErrorPage() {
    return (
        <>
            <Image
            alt="Gitwallet"
            width={520}
            height={142}
            className="relative mx-auto h-12 w-auto dark:scale-110 dark:rounded-full dark:border dark:border-stone-400"
            src="/wordmark.png"
            />
            <p className="mt-2 text-center text-md text-red-600 dark:text-red-400">An error occured.</p>
          
            
        </>
    )
}