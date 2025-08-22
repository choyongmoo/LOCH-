import React, { useState, useEffect } from 'react';
import { useAudioDevices } from '@/hooks/useAudioDevices';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMicMuted: boolean;
  isHeadsetMuted: boolean;
  onMicMuteToggle: () => void;
  onHeadsetMuteToggle: () => void;
  onSave?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  isMicMuted,
  isHeadsetMuted,
  onMicMuteToggle,
  onHeadsetMuteToggle,
  onSave
}) => {
  const {
    audioInputDevices,
    audioOutputDevices,
    selectedInputDevice,
    selectedOutputDevice,
    setSelectedInputDevice,
    setSelectedOutputDevice,
    loadAudioDevices
  } = useAudioDevices();

  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedVideoDevice, setSelectedVideoDevice] = useState('');
  const [inputVolume, setInputVolume] = useState(100);
  const [outputVolume, setOutputVolume] = useState(100);

  // 비디오 장치 로드
  const loadVideoDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = devices.filter(device => device.kind === 'videoinput');
      setVideoDevices(videoInputs);
      
      if (videoInputs.length > 0 && !selectedVideoDevice) {
        setSelectedVideoDevice(videoInputs[0].deviceId);
      }
    } catch (error) {
      console.error('비디오 장치를 가져오는데 실패했습니다:', error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadAudioDevices();
      loadVideoDevices();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveSettings = () => {
    if (onSave) {
      onSave();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-[#36393F] p-6 rounded-lg shadow-xl text-white w-96 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold">설정</h3>
          <button
            onClick={onClose}
            className="text-[#72767D] hover:text-[#DCDDDE] transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>

        {/* 오디오 입력 장치 */}
        <div className="mb-6">
          <h4 className="font-medium text-[#DCDDDE] mb-3">입력 장치</h4>
          {audioInputDevices.length > 0 ? (
            <select
              value={selectedInputDevice}
              onChange={(e) => setSelectedInputDevice(e.target.value)}
              className="w-full p-3 bg-[#40444B] text-[#DCDDDE] rounded-lg border border-[#202225] focus:outline-none focus:border-[#5865F2]"
            >
              {audioInputDevices.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || `마이크 ${device.deviceId.slice(0, 8)}`}
                </option>
              ))}
            </select>
          ) : (
            <div className="p-3 bg-[#40444B] text-[#72767D] rounded-lg border border-[#202225]">
              연결된 마이크가 없습니다
            </div>
          )}
        </div>

        {/* 입력 볼륨 */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-[#DCDDDE]">입력 볼륨</h4>
            <span className="text-sm text-[#72767D]">{inputVolume}%</span>
          </div>
          <div 
            className="relative w-full h-2 bg-[#40444B] rounded-lg cursor-pointer"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const percent = Math.round(((e.clientX - rect.left) / rect.width) * 100);
              setInputVolume(Math.max(0, Math.min(100, percent)));
            }}
          >
            <div 
              className="absolute top-0 left-0 h-2 bg-[#5865F2] rounded-lg"
              style={{ width: `${inputVolume}%` }}
            />
            <div 
              className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-[#5865F2] border-2 border-white rounded-full shadow-lg cursor-grab active:cursor-grabbing"
              style={{ left: `calc(${inputVolume}% - 8px)` }}
              onMouseDown={(e) => {
                e.preventDefault();
                const container = e.currentTarget.parentElement!;
                const handleMouseMove = (moveEvent: MouseEvent) => {
                  const rect = container.getBoundingClientRect();
                  const percent = Math.round(((moveEvent.clientX - rect.left) / rect.width) * 100);
                  setInputVolume(Math.max(0, Math.min(100, percent)));
                };
                const handleMouseUp = () => {
                  document.removeEventListener('mousemove', handleMouseMove);
                  document.removeEventListener('mouseup', handleMouseUp);
                };
                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', handleMouseUp);
              }}
            />
          </div>
        </div>

        {/* 입력 음소거 */}
        <div className="mb-6 flex justify-end">
          <button
            onClick={onMicMuteToggle}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              isMicMuted 
                ? 'bg-red-500 text-white' 
                : 'bg-[#5865F2] text-white'
            }`}
          >
            {isMicMuted ? '음소거 해제' : '음소거'}
          </button>
        </div>

        {/* 오디오 출력 장치 */}
        <div className="mb-6">
          <h4 className="font-medium text-[#DCDDDE] mb-3">출력 장치</h4>
          {audioOutputDevices.length > 0 ? (
            <select
              value={selectedOutputDevice}
              onChange={(e) => setSelectedOutputDevice(e.target.value)}
              className="w-full p-3 bg-[#40444B] text-[#DCDDDE] rounded-lg border border-[#202225] focus:outline-none focus:border-[#5865F2]"
            >
              {audioOutputDevices.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || `스피커 ${device.deviceId.slice(0, 8)}`}
                </option>
              ))}
            </select>
          ) : (
            <div className="p-3 bg-[#40444B] text-[#72767D] rounded-lg border border-[#202225]">
              연결된 스피커가 없습니다
            </div>
          )}
        </div>

        {/* 출력 볼륨 */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-[#DCDDDE]">출력 볼륨</h4>
            <span className="text-sm text-[#72767D]">{outputVolume}%</span>
          </div>
          <div 
            className="relative w-full h-2 bg-[#40444B] rounded-lg cursor-pointer"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const percent = Math.round(((e.clientX - rect.left) / rect.width) * 100);
              setOutputVolume(Math.max(0, Math.min(100, percent)));
            }}
          >
            <div 
              className="absolute top-0 left-0 h-2 bg-[#5865F2] rounded-lg"
              style={{ width: `${outputVolume}%` }}
            />
            <div 
              className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-[#5865F2] border-2 border-white rounded-full shadow-lg cursor-grab active:cursor-grabbing"
              style={{ left: `calc(${outputVolume}% - 8px)` }}
              onMouseDown={(e) => {
                e.preventDefault();
                const container = e.currentTarget.parentElement!;
                const handleMouseMove = (moveEvent: MouseEvent) => {
                  const rect = container.getBoundingClientRect();
                  const percent = Math.round(((moveEvent.clientX - rect.left) / rect.width) * 100);
                  setOutputVolume(Math.max(0, Math.min(100, percent)));
                };
                const handleMouseUp = () => {
                  document.removeEventListener('mousemove', handleMouseMove);
                  document.removeEventListener('mouseup', handleMouseUp);
                };
                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', handleMouseUp);
              }}
            />
          </div>
        </div>

        {/* 출력 음소거 */}
        <div className="mb-6 flex justify-end">
          <button
            onClick={onHeadsetMuteToggle}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              isHeadsetMuted 
                ? 'bg-red-500 text-white' 
                : 'bg-[#5865F2] text-white'
            }`}
          >
            {isHeadsetMuted ? '음소거 해제' : '음소거'}
          </button>
        </div>

        {/* 카메라 장치 */}
        <div className="mb-6">
          <h4 className="font-medium text-[#DCDDDE] mb-3">카메라 장치</h4>
          {videoDevices.length > 0 ? (
            <select
              value={selectedVideoDevice}
              onChange={(e) => setSelectedVideoDevice(e.target.value)}
              className="w-full p-3 bg-[#40444B] text-[#DCDDDE] rounded-lg border border-[#202225] focus:outline-none focus:border-[#5865F2]"
            >
              {videoDevices.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || `카메라 ${device.deviceId.slice(0, 8)}`}
                </option>
              ))}
            </select>
          ) : (
            <div className="p-3 bg-[#40444B] text-[#72767D] rounded-lg border border-[#202225]">
              연결된 카메라가 없습니다
            </div>
          )}
        </div>

        {/* 버튼들 */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#40444B] text-[#DCDDDE] rounded-lg hover:bg-[#4F545C] transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSaveSettings}
            className="px-4 py-2 bg-[#5865F2] text-white rounded-lg hover:bg-[#4752c4] transition-colors"
          >
            저장
          </button>
        </div>
      </div>


    </div>
  );
};
