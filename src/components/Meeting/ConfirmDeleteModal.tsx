import React from 'react';

interface ConfirmDeleteModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  visible,
  onConfirm,
  onCancel,
  title,
  message
}) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-md"
        onClick={onCancel}
      />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#2F3136] p-6 rounded-lg shadow-xl text-white min-w-[400px] border border-[#4F545C]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-white transition"
          >
            ×
          </button>
        </div>
        <div className="mb-6">
          <p className="text-gray-300">{message}</p>
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            예
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-[#4F545C] text-white rounded hover:bg-[#5D6268] transition"
          >
            아니오
          </button>
        </div>
      </div>
    </div>
  );
};