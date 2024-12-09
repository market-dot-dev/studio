export default function PageHeading({ title, children }: { title?: string, children?: React.ReactNode}) {
    return (
        <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-semibold dark:text-white tracking-[-0.0125em]">
                {title || children}
            </h1>
        </div>
    )
}