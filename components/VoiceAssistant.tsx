import React, { useState, useCallback, useRef } from 'react';
import { generateMotivationalSpeech } from '../services/geminiService';
import { MicrophoneIcon, SpeakerWaveIcon } from './icons';
import { decode, decodeAudioData } from '../utils/audio';

const VoiceAssistant: React.FC = () => {
    const [status, setStatus] = useState<'idle' | 'speaking' | 'error'>('idle');
    const [error, setError] = useState<string | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);

    const handleActivate = useCallback(async () => {
        if (status !== 'idle') return;

        setStatus('speaking');
        setError(null);

        try {
            // Lazy initialization of AudioContext
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            }
            const audioContext = audioContextRef.current;

            const base64Audio = await generateMotivationalSpeech();
            const audioBytes = decode(base64Audio);
            const audioBuffer = await decodeAudioData(audioBytes, audioContext, 24000, 1);
            
            const source = audioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioContext.destination);
            source.start();

            source.onended = () => {
                setStatus('idle');
            };

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            console.error(errorMessage);
            setError(errorMessage);
            setStatus('error');
            // Reset after 4 seconds to allow user to see the error state
            setTimeout(() => setStatus('idle'), 4000);
        }
    }, [status]);

    const getIcon = () => {
        switch (status) {
            case 'speaking':
                // Use a colored, animated icon for the speaking state
                return <SpeakerWaveIcon className="text-purple-400" />;
            case 'error':
                 return <MicrophoneIcon className="text-red-500" />;
            case 'idle':
            default:
                return <MicrophoneIcon />;
        }
    };
    
    let buttonTitle: string;
    let buttonDynamicClasses = '';

    switch (status) {
        case 'speaking':
            buttonTitle = "Speaking...";
            // Add a glowing ring effect to the button for better feedback
            buttonDynamicClasses = "ring-2 ring-purple-500/70 shadow-lg shadow-purple-500/30";
            break;
        case 'error':
            buttonTitle = `Error: ${error || 'Failed'}. Please try again.`;
             // Add a red ring for error state
            buttonDynamicClasses = "ring-2 ring-red-500/70";
            break;
        case 'idle':
        default:
            buttonTitle = "Get a motivational boost";
            break;
    }


    return (
        <button
            onClick={handleActivate}
            disabled={status !== 'idle'}
            className={`p-2 rounded-full text-gray-400 hover:text-purple-400 hover:bg-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-wait ${buttonDynamicClasses}`}
            aria-label="Activate Motivational Voice Assistant"
            title={buttonTitle}
        >
            {getIcon()}
            {error && <span className="sr-only">Error: {error}</span>}
        </button>
    );
};

export default VoiceAssistant;