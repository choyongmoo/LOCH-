import React from 'react';
import type { AppInstance } from '@/types/meeting';

interface InstanceManagementModalProps {
  visible: boolean;
  selectedInstance: AppInstance | null;
  editingTitle: string;
  onClose: () => void;
  onTitleChange: (title: string) => void;
  onSave: () => void;
  onDelete: (instanceId: string) => void;
}

export const InstanceManagementModal: React.FC<InstanceManagementModalProps> = ({
  visible,
  selectedInstance,
  editingTitle,
  onClose,
  onTitleChange,
  onSave,
  onDelete
}) => {
  if (!visible || !selectedInstance) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#2F3136] p-6 rounded-lg shadow-xl text-white min-w-[400px] border border-[#4F545C]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">인스턴스 관리</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            ×
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              인스턴스 이름
            </label>
            <input
              type="text"
              value={editingTitle}
              onChange={(e) => onTitleChange(e.target.value)}
              className="w-full px-3 py-2 bg-[#40444B] border border-[#4F545C] rounded-md text-white focus:outline-none focus:border-[#5865F2]"
              placeholder="인스턴스 이름을 입력하세요"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  onSave();
                }
              }}
            />
          </div>
          <div className="text-sm text-gray-400">
            <p>타입: {selectedInstance.type}</p>
            <p>ID: {selectedInstance.id}</p>
          </div>
        </div>
        <div className="flex justify-between mt-6">
          <button
            onClick={() => onDelete(selectedInstance.id)}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            삭제
          </button>
          <div className="flex gap-3">
            <button
              onClick={onSave}
              className="px-4 py-2 bg-[#5865F2] text-white rounded hover:bg-[#4752c4] transition"
            >
              저장
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#4F545C] text-white rounded hover:bg-[#5D6268] transition"
            >
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};