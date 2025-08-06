import React from 'react';

interface SuccessModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  visible,
  onClose,
  title,
  message
}) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#2F3136] p-6 rounded-lg shadow-xl text-white min-w-[400px] border border-[#4F545C]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-green-400">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            ×
          </button>
        </div>
        <div className="mb-6">
          <p className="text-gray-300">{message}</p>
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#5865F2] text-white rounded hover:bg-[#4752c4] transition"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};