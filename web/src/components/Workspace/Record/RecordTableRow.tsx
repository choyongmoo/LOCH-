interface Props {
    title: string;
    author: string;
    createdAt: string;
}

export default function RecordTableRow({ title, author, createdAt }: Props) {
    return (
        <div className="flex items-center px-2 py-2 border-b border-gray-200 dark:border-[#23242e] text-gray-900 dark:text-gray-100 text-sm">
            <div className="w-8"></div>
            <div className="flex-1">{title}</div>
            <div className="w-32 text-center">{author}</div>
            <div className="w-32 text-center">{createdAt}</div>
        </div>
    )
}