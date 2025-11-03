import { useState, useEffect, useRef } from "react";

export function useMicrophone() {
    const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState(
        localStorage.getItem("selectedMic") || ""
    );
    const [isTesting, setIsTesting] = useState(false);
    const [volume, setVolume] = useState(0);

    const audioRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const animationRef = useRef<number | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const startTest = async (deviceId?: string) => {
        if (isTesting) return;
        try {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: { deviceId: deviceId || selectedDeviceId ? { exact: deviceId || selectedDeviceId } : undefined }
        });

        const audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;
        source.connect(analyser);

        audioRef.current = source;
        analyserRef.current = analyser;
        setIsTesting(true);

        const dataArray = new Uint8Array(analyser.fftSize);
        let currentVolume = 0;

        const SENSITIVITY = 3.5; // 🔹 감도 조절 상수

        const draw = () => {
            if (!canvasRef.current) return;
            const ctx = canvasRef.current.getContext("2d");
            if (!ctx) return;

            analyser.getByteTimeDomainData(dataArray);

            // RMS 계산
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
            const val = (dataArray[i] - 128) / 128;
            sum += val * val;
            }
            const rms = Math.sqrt(sum / dataArray.length);

            // 볼륨 처리: 감도 조절 + 자연스러운 반응
            const scaledRms = Math.min(rms * SENSITIVITY, 1);
            currentVolume = scaledRms > currentVolume ? scaledRms : currentVolume * 0.6;
            setVolume(currentVolume);

            // Canvas 초기화
            const canvas = canvasRef.current;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // 배경
            ctx.fillStyle = "#111827"; 
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // 가로 막대 그리기 (좌→우)
            ctx.fillStyle = "#3b82f6"; 
            const barWidth = currentVolume * canvas.width;
            ctx.fillRect(0, 0, barWidth, canvas.height);

            animationRef.current = requestAnimationFrame(draw);
        };

        draw();
        } catch (err) {
            console.error(err);
        }
    };

    const stopTest = () => {
            setIsTesting(false);
            setVolume(0);
            if (animationRef.current) cancelAnimationFrame(animationRef.current);

            if (canvasRef.current) {
                const ctx = canvasRef.current.getContext("2d");
                if (ctx) {
                ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                }
            }

            if (audioRef.current) {
                audioRef.current.mediaStream.getTracks().forEach((track) => track.stop());
                audioRef.current = null;
            }
        };

    const selectDevice = (deviceId: string) => {
        setSelectedDeviceId(deviceId);
        localStorage.setItem("selectedMic", deviceId);
    };

    useEffect(() => {
        navigator.mediaDevices.enumerateDevices().then((list) => {
            const mics = list.filter((d) => d.kind === "audioinput");
            setDevices(mics);
        });
    }, []);

    return { devices, selectedDeviceId, selectDevice, startTest, stopTest, isTesting, volume, canvasRef };
}
