import React from 'react';
import { AnimatePresence } from "framer-motion";
import { ChatBox } from "@/components/Meeting/ChatBox";
import { AppModal } from "@/components/Meeting/AppModal";
import { ReplaceSplitModal } from "@/components/Meeting/ReplaceSplitModal";
import { InstanceManagementModal } from "@/components/Meeting/InstanceManagementModal";
import { ConfirmDeleteModal } from "@/components/Meeting/ConfirmDeleteModal";
import { SuccessModal } from "@/components/Meeting/SuccessModal";
import { OpenInstanceWarningModal } from "@/components/Meeting/OpenInstanceWarningModal";
import { MeetingDetailsModal } from "@/components/Meeting/MeetingDetailsModal";
import { UserDetailsModal } from "@/components/Meeting/UserDetailsModal";
import { OptionsModal } from "@/components/Meeting/OptionsModal";
import type { AppInstance } from '@/types/meeting';

interface MeetingModalsProps {
  // 채팅 관련
  chatOpen: boolean;
  messages: any[];
  input: string;
  setInput: (input: string) => void;
  onSendMessage: () => void;
  
  // 앱 모달 관련
  showAppModal: boolean;
  appType: string | null;
  appTitle: string;
  modalMode: 'select' | 'create';
  instances: AppInstance[];
  onAppModalClose: () => void;
  onAppTitleChange: (title: string) => void;
  onAppModalCreate: () => void;
  onSelectInstance: (instance: AppInstance) => void;
  onNewInstance: () => void;
  
  // 교체/분할 모달 관련
  replaceOrSplit: any;
  panelsLength: number;
  onReplaceOrSplit: (mode: 'replace' | 'split' | 'cancel') => void;
  
  // 인스턴스 관리 모달 관련
  showInstanceModal: boolean;
  selectedInstance: AppInstance | null;
  editingTitle: string;
  onInstanceModalClose: () => void;
  onInstanceTitleChange: (title: string) => void;
  onInstanceSave: () => void;
  onInstanceDelete: (instanceId: string) => void;
  showDeleteConfirm: boolean;
  onDeleteConfirm: () => void;
  onDeleteCancel: () => void;
  showSuccessModal: boolean;
  onSuccessClose: () => void;
  successMessage: string;
  showOpenInstanceWarning: boolean;
  onOpenInstanceWarningClose: () => void;
  
  // 회의방 상세 모달 관련
  showDetails: boolean;
  onDetailsClose: () => void;
  
  // 유저 상세 모달 관련
  selectedUser: string | null;
  onUserClose: () => void;
  
    // 옵션 모달 관련
  showOptions: boolean;
  audioInputDevices: MediaDeviceInfo[];
  audioOutputDevices: MediaDeviceInfo[];
  selectedInputDevice: string;
  selectedOutputDevice: string;
  isMicMuted: boolean;
  isHeadsetMuted: boolean;
  inputVolume: number;
  outputVolume: number;
  onOptionsClose: () => void;
  onOptionsSave: () => void;
  onMicMuteToggle: () => void;
  onHeadsetMuteToggle: () => void;
  onInputDeviceChange: (deviceId: string) => void;
  onOutputDeviceChange: (deviceId: string) => void;
  onInputVolumeChange: (volume: number) => void;
  onOutputVolumeChange: (volume: number) => void;
}

export const MeetingModals: React.FC<MeetingModalsProps> = ({
  // 채팅 관련
  chatOpen,
  messages,
  input,
  setInput,
  onSendMessage,
  
  // 앱 모달 관련
  showAppModal,
  appType,
  appTitle,
  modalMode,
  instances,
  onAppModalClose,
  onAppTitleChange,
  onAppModalCreate,
  onSelectInstance,
  onNewInstance,
  
  // 교체/분할 모달 관련
  replaceOrSplit,
  panelsLength,
  onReplaceOrSplit,
  
  // 인스턴스 관리 모달 관련
  showInstanceModal,
  selectedInstance,
  editingTitle,
  onInstanceModalClose,
  onInstanceTitleChange,
  onInstanceSave,
  onInstanceDelete,
  showDeleteConfirm,
  onDeleteConfirm,
  onDeleteCancel,
  showSuccessModal,
  onSuccessClose,
  successMessage,
  showOpenInstanceWarning,
  onOpenInstanceWarningClose,
  
  // 회의방 상세 모달 관련
  showDetails,
  onDetailsClose,
  
  // 유저 상세 모달 관련
  selectedUser,
  onUserClose,
  
    // 옵션 모달 관련
  showOptions,
  audioInputDevices,
  audioOutputDevices,
  selectedInputDevice,
  selectedOutputDevice,
  isMicMuted,
  isHeadsetMuted,
  inputVolume,
  outputVolume,
  onOptionsClose,
  onOptionsSave,
  onMicMuteToggle,
  onHeadsetMuteToggle,
  onInputDeviceChange,
  onOutputDeviceChange,
  onInputVolumeChange,
  onOutputVolumeChange
}) => {
  return (
    <>
      {/* 채팅창 */}
      <AnimatePresence>
        {chatOpen && (
          <ChatBox
            messages={messages}
            input={input}
            setInput={setInput}
            onSend={onSendMessage}
          />
        )}
      </AnimatePresence>

      {/* 앱 모달 */}
      <AppModal
        visible={showAppModal}
        appType={appType}
        appTitle={appTitle}
        modalMode={modalMode}
        instances={instances}
        onClose={onAppModalClose}
        onTitleChange={onAppTitleChange}
        onCreate={onAppModalCreate}
        onSelectInstance={onSelectInstance}
        onNewInstance={onNewInstance}
      />
      
      {/* 교체/분할 모달 */}
      <ReplaceSplitModal
        replaceOrSplit={replaceOrSplit}
        panelsLength={panelsLength}
        onAction={onReplaceOrSplit}
      />

      {/* 인스턴스 관리 모달 */}
      <InstanceManagementModal
        visible={showInstanceModal}
        selectedInstance={selectedInstance}
        editingTitle={editingTitle}
        onClose={onInstanceModalClose}
        onTitleChange={onInstanceTitleChange}
        onSave={onInstanceSave}
        onDelete={onInstanceDelete}
      />

      {/* 삭제 확인 모달 */}
      <ConfirmDeleteModal
        visible={showDeleteConfirm}
        onConfirm={onDeleteConfirm}
        onCancel={onDeleteCancel}
        title="인스턴스 삭제"
        message="정말로 이 인스턴스를 삭제하시겠습니까?"
      />

      {/* 성공 알림 모달 */}
      <SuccessModal
        visible={showSuccessModal}
        onClose={onSuccessClose}
        title="성공"
        message={successMessage}
      />

      {/* 열린 인스턴스 경고 모달 */}
      <OpenInstanceWarningModal
        visible={showOpenInstanceWarning}
        onClose={onOpenInstanceWarningClose}
      />

      {/* 회의방 상세 모달 */}
      <MeetingDetailsModal
        visible={showDetails}
        onClose={onDetailsClose}
        details="회의방 상세정보 입력"
      />

      {/* 유저 상세 모달 */}
      <UserDetailsModal
        visible={selectedUser !== null}
        onClose={onUserClose}
        user={selectedUser}
      />

      {/* 옵션 모달 */}
              <OptionsModal
          visible={showOptions}
          onClose={onOptionsClose}
          onSave={onOptionsSave}
          audioInputDevices={audioInputDevices}
          audioOutputDevices={audioOutputDevices}
          selectedInputDevice={selectedInputDevice}
          selectedOutputDevice={selectedOutputDevice}
          isMicMuted={isMicMuted}
          isHeadsetMuted={isHeadsetMuted}
          inputVolume={inputVolume}
          outputVolume={outputVolume}
          onMicMuteToggle={onMicMuteToggle}
          onHeadsetMuteToggle={onHeadsetMuteToggle}
          onInputDeviceChange={onInputDeviceChange}
          onOutputDeviceChange={onOutputDeviceChange}
          onInputVolumeChange={onInputVolumeChange}
          onOutputVolumeChange={onOutputVolumeChange}
        />
    </>
  );
};