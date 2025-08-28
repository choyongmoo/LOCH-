import type { ReplaceOrSplit } from '@/types/meeting';

interface ReplaceSplitModalProps {
  replaceOrSplit: ReplaceOrSplit | null;
  panelsLength: number;
  onAction: (mode: 'replace' | 'split' | 'cancel') => void;
}

export const ReplaceSplitModal = ({
  replaceOrSplit,
  panelsLength,
  onAction,
}: ReplaceSplitModalProps) => {
  if (!replaceOrSplit) return null;

  const isInstance = replaceOrSplit.sourceType === 'instance';

  return (
    <div>
      <div
        className="fixed inset-0 bg-opacity-20 backdrop-blur-sm z-50"
        onClick={() => onAction('cancel')}
      />
      <div
        className="fixed top-1/2 left-1/2 max-w-xs w-full bg-[#2F3136] p-6 rounded-2xl shadow-xl transform -translate-x-1/2 -translate-y-1/2 z-60 text-white"
      >
        {isInstance ? (
          <>
            <h2 className="text-lg font-semibold mb-4">
              이 화면을 "{replaceOrSplit.instance.title}"(으)로 교체할까요?
            </h2>
            <div className="flex flex-row gap-3 justify-center">
              <button
                className={`px-4 py-2 rounded-full transition ${
                  panelsLength >= 4 
                    ? 'bg-gray-600 text-gray-300 cursor-not-allowed' 
                    : 'bg-[#5865F2] text-white hover:bg-[#4752c4]'
                }`}
                onClick={() => onAction('split')}
                disabled={panelsLength >= 4}
              >
                분할
              </button>
              <button
                className="px-4 py-2 bg-[#5865F2] rounded-full hover:bg-[#4752c4] transition"
                onClick={() => onAction('replace')}
              >
                교체
              </button>
              <button
                className="px-4 py-2 bg-gray-500 rounded-full hover:bg-gray-600 transition"
                onClick={() => onAction('cancel')}
              >
                취소
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-lg font-semibold mb-4">어떻게 하시겠습니까?</h2>
            <div className="flex flex-col gap-3">
              <button
                className="px-4 py-2 bg-[#5865F2] rounded-full hover:bg-[#4752c4] transition disabled:bg-gray-600 disabled:cursor-not-allowed"
                onClick={() => onAction('split')}
                disabled={panelsLength >= 4}
              >
                화면 분할
              </button>
              <button
                className="px-4 py-2 bg-[#40444B] rounded-full hover:bg-[#5865F2] transition"
                onClick={() => onAction('replace')}
              >
                이 화면 교체
              </button>
              <button
                className="px-4 py-2 bg-gray-500 rounded-full hover:bg-gray-600 transition"
                onClick={() => onAction('cancel')}
              >
                취소
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}; 