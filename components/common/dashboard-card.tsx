import { Card } from "@tremor/react"
import { ReactNode } from "react"

export default function DashboardCard({ children, className }: { children?: ReactNode, className?: string }) {
    className = className + " p-3 mb-2";

    return (
        <Card className={className}>
            {children}
        </Card>
    )
}