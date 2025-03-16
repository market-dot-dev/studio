export default function PageHeading({ title, children, className }: { title?: string, children?: React.ReactNode, className?: string }) {
    return (
        <div className={`flex items-center justify-between mb-2 ${className || ''}`}>
            <h1 className="text-3xl font-bold dark:text-white tracking-[-0.015em]">
                {title || children}
            </h1>
        </div>
    )
}