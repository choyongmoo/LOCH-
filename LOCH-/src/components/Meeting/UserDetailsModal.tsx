import React from "react";
import type { UserDetailsModalProps } from "@/pages/Meeting/types";

export const UserDetailsModal = ({ visible, onClose, user }: UserDetailsModalProps) => {
  if (!visible) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-opacity-40 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      <div
        className="
          fixed top-1/2 left-1/2 max-w-sm w-full bg-[#2F3136] p-6 rounded-2xl shadow-xl
          transform -translate-x-1/2 -translate-y-1/2 z-50 text-white
        "
      >
        <h2 className="text-xl font-semibold mb-4">유저 정보</h2>
        <div className="mb-6 whitespace-pre-wrap text-center text-lg">
          {user}
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#5865F2] rounded-full hover:bg-[#4752c4] transition"
          >
            닫기
          </button>
        </div>
      </div>
    </>
  );
};
