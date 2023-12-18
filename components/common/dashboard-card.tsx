import { Card } from "@tremor/react"
import { ReactNode } from "react"

export default function DashboardCard({ children }: { children?: ReactNode }) {

    return (
        <Card className="p-2">
            {children}
        </Card>
    )
}