export default function FriendAddModal({ close }: { close: () => void }) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-800 text-white w-96 rounded-xl p-4 shadow-lg flex flex-col gap-3">
                {/* 타이틀 */}
                <h2 className="text-lg font-bold">친구 추가</h2>
                <p className="text-sm text-gray-400">이메일 또는 이름 일부를 입력하세요.</p>

                {/* 검색창 */}
                <div className="flex gap-2">
                    <input
                        className="flex-1 px-3 py-2 rounded-md bg-gray-700 border border-gray-600 outline-none"
                        placeholder="이메일 또는 이름"
                        readOnly
                    />
                    <button className="px-3 py-2 bg-blue-600 rounded-md font-semibold hover:bg-blue-500">
                        검색
                    </button>
                </div>

                {/* 검색 결과 */}
                <div className="max-h-64 overflow-y-auto flex flex-col gap-2">
                    <div className="text-center text-gray-400 text-sm">검색 결과가 없습니다.</div>
                </div>

                {/* 닫기 버튼 */}
                <div className="flex justify-end mt-2">
                    <button 
                        onClick={close}
                        className="px-3 py-2 bg-gray-600 rounded-md font-semibold hover:bg-gray-500">
                            닫기
                    </button>
                </div>
            </div>
        </div>
    );
}
