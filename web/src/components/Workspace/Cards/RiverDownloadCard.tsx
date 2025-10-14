export default function RiverDownloadCard() {
    return (
        <div className="flex flex-col gap-6 pr-4 pt-2">
            {/* River 다운로드 블록 */}
            <div className="bg-white dark:bg-[#1a1d21] rounded-xl shadow-xl p-6 flex flex-col items-center text-center w-full ml-2 lg:ml-4 ">
                {/* 아이콘 */}
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    <svg
                        width="36"
                        height="36"
                        viewBox="0 0 36 36"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <circle cx="18" cy="18" r="18" fill="#2563eb" />
                        <path
                        d="M24.5 17.13V14.5C24.5 13.12 23.38 12 22 12H14C12.62 12 11.5 13.12 11.5 14.5V21.5C11.5 22.88 12.62 24 14 24H22C23.38 24 24.5 22.88 24.5 21.5V18.87L27.03 20.7C27.36 20.93 27.81 20.7 27.81 20.3V15.7C27.81 15.3 27.36 15.07 27.03 15.3L24.5 17.13Z"
                        fill="white"
                        />
                    </svg>
                </div>

                {/* 제목 */}
                <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-2">River</h2>

                {/* 설명 */}
                <p className="text-sm text-gray-500 dark:text-gray-300 mb-4">
                    River를 다운로드 하여 사용해보세요!
                </p>

                {/* 버튼 */}
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-5 py-2 mb-2" onClick={() => window.open("/download", "_blank")}>
                    River 다운로드
                </button>
            </div>
        </div>
    );
}
