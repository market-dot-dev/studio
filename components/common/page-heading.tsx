export default function PageHeading({ title, children }: { title?: string, children?: React.ReactNode}) {
    return (
        <div className="flex items-center justify-between mb-2">
            <h1 className="font-cal text-3xl font-bold dark:text-white">
                {title || children}
            </h1>
        </div>
    )
}