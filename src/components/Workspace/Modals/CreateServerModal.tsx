
export default function CreateServerModal({ close }: {close: () => void }) {

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white dark:bg-[#2F3136] p-4 rounded-md shadow-lg w-[320px]">
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">설정</h3>

                <div className="space-y-2 mb-4">
                    <label className="text-sm text-gray-600 dark:text-gray-300">이름</label>
                    <input
                    type="text"
                    placeholder="서버 이름을 입력하세요"
                    className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#202225] text-gray-900 dark:text-white"
                    />
                </div>

                <div className="space-y-2 mb-4">
                    <label className="text-sm text-gray-600 dark:text-gray-300">소개</label>
                    <input
                        type="text"
                        placeholder="서버를 소개해주세요!"
                        className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#202225] text-gray-900 dark:text-white"
                    />
                </div>

                <div className="flex justify-end gap-2">
                    <button className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600" onClick={close}>취소</button>
                    <button className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">확인</button>
                </div>
            </div>
        </div>
    )
}