import RecordTableRow from "./RecordTableRow";

interface Props {
      records: { id: string; title: string; author: string; createdAt: string }[];
}

export default function RecordTable({ records }: Props) {
    return (
        <div>
            {/* 테이블 헤더 */}
            <div className="flex items-center px-2 py-2 text-gray-500 dark:text-gray-400 text-sm border-b border-gray-200 dark:border-[#23242e]">
                <div className="w-8"></div>
                <div className="flex-1">제목</div>
                <div className="w-32 text-center">작성자</div>
                <div className="w-32 text-center">작성일</div>
            </div>

            {/* 테이블 내용 */}
            {records.map((record) => (
                <RecordTableRow
                key={record.id}
                title={record.title}
                author={record.author}
                createdAt={record.createdAt}
                />
            ))}
        </div>
    )
}