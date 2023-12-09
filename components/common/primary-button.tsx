import Link from "next/link";

export default function PrimaryButton({ label, href }: { label: string, href: string }) {

    return (
        <Link href={href}>
            <button type="button" className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 py-1.5 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
                {label}
            </button>
        </Link>
    )
}