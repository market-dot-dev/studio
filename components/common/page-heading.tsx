export default function PageHeading({ title }: { title?: string }) {

    return (
        <div className="flex items-center justify-between mb-2">
            <h1 className="font-cal text-3xl font-bold dark:text-white">
                {title}
            </h1>
        </div>
    )
}