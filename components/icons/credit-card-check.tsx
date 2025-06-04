export function CreditCardCheck({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className={className}
    >
      <path d="M12 19H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5" />
      <path d="m16 18 2 2 4-4" />
      <path d="M2 10h20" />
    </svg>
  );
}

// Alternate export name
export { CreditCardCheck as CreditCardCheckIcon };
