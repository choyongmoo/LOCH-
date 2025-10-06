const cardClass = "bg-white dark:bg-[#1a1d21] rounded-xl shadow-xl p-8 flex flex-col";

export default function IntroCard() {
    return (
        <div className={`${cardClass} min-h-[160px] `}>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                회의 제목
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-300 whitespace-pre-line">
                회의 설명이나 참여자 소개를 여기에 표시합니다.
                <br />
                여러 줄 예시 텍스트입니다.
            </p>
        </div>
    );
}