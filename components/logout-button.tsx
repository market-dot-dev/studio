"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function LogoutButton({ redirect }: { redirect: string}) {
  return (
    <button
      onClick={() => signOut(
        { callbackUrl: redirect }
      )}
      className="rounded p-1 text-stone-600 transition-all duration-150 ease-in-out hover:bg-stone-200 active:bg-stone-300 dark:text-white dark:hover:bg-stone-700 dark:active:bg-stone-800"
    >
      <LogOut size={18} />
    </button>
  );
}
