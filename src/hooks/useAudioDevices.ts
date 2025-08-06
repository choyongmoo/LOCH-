import { useState, useEffect } from 'react';

export const useAudioDevices = () => {
  const [audioInputDevices, setAudioInputDevices] = useState<MediaDeviceInfo[]>([]);
  const [audioOutputDevices, setAudioOutputDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedInputDevice, setSelectedInputDevice] = useState('');
  const [selectedOutputDevice, setSelectedOutputDevice] = useState('');

  const loadAudioDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      
      // Windows 시스템에서 생성하는 가상 장치들을 제거하고 실제 하드웨어만 필터링
      const uniqueInputs = devices
        .filter(device => device.kind === 'audioinput')
        // 기본값, 커뮤니케이션 등 Windows 가상 장치 제거 (deviceId 기준)
        .filter(device => device.deviceId !== 'default' && device.deviceId !== 'communications')
        // 라벨 기준으로도 필터링
        .filter(device => {
          const label = device.label || '';
          return !label.includes('기본값 -') && 
                 !label.includes('커뮤니케이션 -') && 
                 !label.includes('Default -') && 
                 !label.includes('Communication -');
        });
      
      const uniqueOutputs = devices
        .filter(device => device.kind === 'audiooutput')
        // 기본값, 커뮤니케이션 등 Windows 가상 장치 제거 (deviceId 기준)
        .filter(device => device.deviceId !== 'default' && device.deviceId !== 'communications')
        // 라벨 기준으로도 필터링
        .filter(device => {
          const label = device.label || '';
          return !label.includes('기본값 -') && 
                 !label.includes('커뮤니케이션 -') && 
                 !label.includes('Default -') && 
                 !label.includes('Communication -');
        });
      
      setAudioInputDevices(uniqueInputs);
      setAudioOutputDevices(uniqueOutputs);
      
      if (uniqueInputs.length > 0 && !selectedInputDevice) {
        setSelectedInputDevice(uniqueInputs[0].deviceId);
      }
      if (uniqueOutputs.length > 0 && !selectedOutputDevice) {
        setSelectedOutputDevice(uniqueOutputs[0].deviceId);
      }
    } catch (error) {
      console.error('오디오 장치를 가져오는데 실패했습니다:', error);
    }
  };

  useEffect(() => {
    loadAudioDevices();
    
    // 장치 변경 이벤트 리스너 추가
    const handleDeviceChange = () => {
      loadAudioDevices();
    };
    
    navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange);
    
    // 클린업 함수
    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', handleDeviceChange);
    };
  }, []);

  return {
    audioInputDevices,
    audioOutputDevices,
    selectedInputDevice,
    selectedOutputDevice,
    setSelectedInputDevice,
    setSelectedOutputDevice,
    loadAudioDevices
  };
}; 