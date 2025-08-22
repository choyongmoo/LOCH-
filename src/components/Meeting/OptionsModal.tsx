import React from 'react';

interface OptionsModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
  audioInputDevices: MediaDeviceInfo[];
  audioOutputDevices: MediaDeviceInfo[];
  selectedInputDevice: string;
  selectedOutputDevice: string;
  isMicMuted: boolean;
  isHeadsetMuted: boolean;
  inputVolume: number;
  outputVolume: number;
  onMicMuteToggle: () => void;
  onHeadsetMuteToggle: () => void;
  onInputDeviceChange: (deviceId: string) => void;
  onOutputDeviceChange: (deviceId: string) => void;
  onInputVolumeChange: (volume: number) => void;
  onOutputVolumeChange: (volume: number) => void;
}

export const OptionsModal: React.FC<OptionsModalProps> = ({
  visible,
  onClose,
  onSave,
  audioInputDevices,
  audioOutputDevices,
  selectedInputDevice,
  selectedOutputDevice,
  isMicMuted,
  isHeadsetMuted,
  inputVolume,
  outputVolume,
  onMicMuteToggle,
  onHeadsetMuteToggle,
  onInputDeviceChange,
  onOutputDeviceChange,
  onInputVolumeChange,
  onOutputVolumeChange
}) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0"
        onClick={onClose}
      />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#2F3136] p-6 rounded-lg shadow-xl text-white min-w-[500px] max-h-[80vh] overflow-y-auto border border-[#4F545C]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">설정</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            ×
          </button>
        </div>
        <div className="space-y-6">
          {/* 오디오 설정 */}
          <div>
            <h3 className="text-lg font-medium mb-3 text-[#7289DA]">🎤 오디오 설정</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-2">입력 장치</label>
                <select 
                  className="w-full bg-[#40444B] border border-[#4F545C] rounded px-3 py-2 text-white focus:outline-none focus:border-[#5865F2]"
                  value={selectedInputDevice}
                  onChange={(e) => onInputDeviceChange(e.target.value)}
                >
                  {audioInputDevices.map(device => (
                    <option key={device.deviceId} value={device.deviceId}>
                      {device.label || `마이크 ${device.deviceId.slice(0, 8)}...`}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">출력 장치</label>
                <select 
                  className="w-full bg-[#40444B] border border-[#4F545C] rounded px-3 py-2 text-white focus:outline-none focus:border-[#5865F2]"
                  value={selectedOutputDevice}
                  onChange={(e) => onOutputDeviceChange(e.target.value)}
                >
                  {audioOutputDevices.map(device => (
                    <option key={device.deviceId} value={device.deviceId}>
                      {device.label || `스피커 ${device.deviceId.slice(0, 8)}...`}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">입력 음량</label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={inputVolume}
                    onChange={(e) => onInputVolumeChange(Number(e.target.value))}
                    className="flex-1 slider"
                    style={{ '--value': `${inputVolume}%` } as React.CSSProperties}
                  />
                  <span className="text-sm text-gray-300 min-w-[3rem] text-right">
                    {inputVolume}%
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">출력 음량</label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={outputVolume}
                    onChange={(e) => onOutputVolumeChange(Number(e.target.value))}
                    className="flex-1 slider"
                    style={{ '--value': `${outputVolume}%` } as React.CSSProperties}
                  />
                  <span className="text-sm text-gray-300 min-w-[3rem] text-right">
                    {outputVolume}%
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">마이크 음소거</span>
                  <button
                    onClick={onMicMuteToggle}
                    className={`px-4 py-2 rounded text-sm transition-colors ${
                      isMicMuted 
                        ? 'bg-red-600 hover:bg-red-700 text-white' 
                        : 'bg-gray-600 hover:bg-gray-700 text-white'
                    }`}
                  >
                    {isMicMuted ? '음소거됨' : '음소거 해제됨'}
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">헤드셋 음소거</span>
                  <button
                    onClick={onHeadsetMuteToggle}
                    className={`px-4 py-2 rounded text-sm transition-colors ${
                      isHeadsetMuted 
                        ? 'bg-red-600 hover:bg-red-700 text-white' 
                        : 'bg-gray-600 hover:bg-gray-700 text-white'
                    }`}
                  >
                    {isHeadsetMuted ? '음소거됨' : '음소거 해제됨'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 알림 설정 */}
          <div>
            <h3 className="text-lg font-medium mb-3 text-[#7289DA]">🔔 알림 설정</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">새 메시지 알림</span>
                <input type="checkbox" className="w-4 h-4 text-[#5865F2] bg-[#40444B] border-[#4F545C] rounded focus:ring-[#5865F2]" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">멤버 입장/퇴장 알림</span>
                <input type="checkbox" className="w-4 h-4 text-[#5865F2] bg-[#40444B] border-[#4F545C] rounded focus:ring-[#5865F2]" defaultChecked />
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onSave}
            className="px-4 py-2 bg-[#5865F2] rounded hover:bg-[#4752c4] transition"
          >
            저장
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700 transition"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};