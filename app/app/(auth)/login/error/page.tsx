import Image from "next/image";

export default function ErrorPage() {
    return (
        <>
            <Image
            alt="market.dev"
            width={520}
            height={142}
            className="relative mx-auto h-12 w-auto dark:scale-110 dark:rounded-full dark:border dark:border-stone-400"
            src="/market-dot-dev-logo.svg"
            />
            <p className="mt-2 text-center text-md text-red-600 dark:text-red-400">An error occured.</p>
          
            
        </>
    )
}