import Link from "next/link";
import { Button, ButtonVariant } from "@tremor/react";

export default function LinkButton({ label, href, variant }: { label: string, href: string, variant?: ButtonVariant }) {

    return (
        <Link href={href}>
            <Button variant={variant} size="xs">
                {label}
            </Button>
        </Link>
    )
}