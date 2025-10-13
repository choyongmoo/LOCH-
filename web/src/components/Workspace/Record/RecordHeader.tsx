export default function RecordHeader() {
    const buttonClass = "flex items-center gap-2 border border-gray-200 dark:border-[#23242e] rounded-lg px-4 py-2 bg-white dark:bg-[#23242e] hover:bg-gray-50 dark:hover:bg-[#23242e]/80 text-gray-800 dark:text-gray-100 text-base font-medium";

    return (
        <div className="flex gap-4 mb-8 flex-wrap">
            <button className={buttonClass}>새 문서</button>
            <button className={buttonClass}>가져오기</button>
        </div>
    )
}