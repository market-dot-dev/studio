import { Card } from "@tremor/react"

export default function DashboardCard(props: any) {
    const { children } = props;

    return (
        <Card className={`${props.className || ''} p-2`}>
            {children}
        </Card>
    )
}