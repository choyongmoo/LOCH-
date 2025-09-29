export default function SettingsCard() {
    return (
        <div className="bg-white dark:bg-[#1a1d21] rounded-xl shadow-xl p-6 flex flex-col">
            {/* 상단: 제목 */}
            <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-gray-800 dark:text-white">설정</span>
            </div>

            {/* 설명 텍스트 */}
            <div className="text-sm text-gray-500 dark:text-gray-300 mb-2">
                설정 버튼을 눌러 설정을 해보세요!
            </div>
        </div>
    );
}
