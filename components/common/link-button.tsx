import Link from "next/link";

type LinkButtonProps = {
  label?: string;
  href?: string;
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
};

export default function LinkButton({
  label,
  href,
  children,
  className,
  disabled,
  onClick,
}: LinkButtonProps) {
  const buttonClass = `text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 py-1.5 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 ${
    className || ""
  } ${disabled ? "opacity-50 pointer-events-none cursor-not-allowed" : ""}`;

  if (href) {
    return (
      <Link href={href}>
        <button type="button" className={buttonClass} onClick={onClick}>
          {children || label}
        </button>
      </Link>
    );
  }

  return (
    <button type="button" className={buttonClass} onClick={onClick} disabled={disabled}>
      {children || label}
    </button>
  );
}