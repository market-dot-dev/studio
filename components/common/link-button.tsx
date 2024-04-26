import Link from "next/link";

type LinkButtonProps = {
  label?: string;
  href: string
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export default function LinkButton({ label, href, children, className, disabled }: LinkButtonProps) {
  return (
    <Link href={href} className={ disabled ? 'opacity-50 pointer-events-none cursor-not-allowed' : ''}>
      <button type="button" className={`text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 py-1.5 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 ${className || ''}`}>
        {children || label}
      </button>
    </Link>
  )
}