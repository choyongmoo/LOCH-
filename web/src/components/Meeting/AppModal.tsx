import type { AppInstance, ModalMode } from '@/types/meeting';

interface AppModalProps {
  visible: boolean;
  appType: string | null;
  appTitle: string;
  modalMode: ModalMode;
  instances: AppInstance[];
  onClose: () => void;
  onTitleChange: (title: string) => void;
  onCreate: () => void;
  onSelectInstance: (instance: AppInstance) => void;
  onNewInstance: () => void;
}

export const AppModal = ({
  visible,
  appType,
  appTitle,
  modalMode,
  instances,
  onClose,
  onTitleChange,
  onCreate,
  onSelectInstance,
  onNewInstance,
}: AppModalProps) => {
  if (!visible || !appType) return null;

  return (
    <div>
      <div
        className="fixed inset-0 bg-opacity-20 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      <div
        className="fixed top-1/2 left-1/2 max-w-md w-full bg-[#2F3136] p-6 rounded-2xl shadow-xl transform -translate-x-1/2 -translate-y-1/2 z-50 text-white"
      >
        <h2 className="text-xl font-semibold mb-4">어플리케이션 생성</h2>
        {modalMode === "select" && (
          <>
            <div className="mb-4">
              <div className="mb-2 font-semibold text-[#7289DA]">기존 인스턴스 선택</div>
              <div className="flex flex-row gap-2 flex-wrap">
                {instances.filter(i => i.type === appType).length === 0 ? (
                  <div className="text-gray-400 text-sm">생성된 인스턴스 없음</div>
                ) : (
                  instances.filter(i => i.type === appType).map(i => (
                    <button
                      key={i.id}
                      onClick={() => onSelectInstance(i)}
                      className="bg-[#40444B] px-3 py-1 rounded text-white hover:bg-[#5865F2] transition-colors text-sm max-w-[120px] truncate"
                    >
                      {i.title}
                    </button>
                  ))
                )}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={onNewInstance}
                className="px-4 py-2 bg-[#5865F2] rounded-full hover:bg-[#4752c4] transition"
              >
                새로 만들기
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-500 rounded-full hover:bg-gray-600 transition"
              >
                취소
              </button>
            </div>
          </>
        )}
        {modalMode === "create" && (
          <>
            <div className="mb-4">
              <label className="block mb-2">제목</label>
              <input
                type="text"
                value={appTitle}
                onChange={e => onTitleChange(e.target.value)}
                className="w-full px-3 py-2 rounded bg-[#40444B] text-white focus:outline-none"
                placeholder="제목을 입력하세요"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={onCreate}
                className="px-4 py-2 bg-[#5865F2] rounded-full hover:bg-[#4752c4] transition"
              >
                생성
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-500 rounded-full hover:bg-gray-600 transition"
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