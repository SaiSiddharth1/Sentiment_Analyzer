import React, { useState, useRef } from 'react';
import { Mic, MicOff, Volume2, Square, Loader2 } from 'lucide-react';
import { speakMessage } from '../services/api';

const VoiceControls = ({ onTranscript, textToRead }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const recognitionRef = useRef(null);

  const startRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition. Please use Chrome or Edge.");
      return;
    }
    
    // Create new instance if none exists
    if (!recognitionRef.current) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onstart = () => setIsRecording(true);
        
        recognitionRef.current.onresult = (event) => {
          let finalTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            }
          }
          if (finalTranscript && onTranscript) {
            onTranscript(finalTranscript);
          }
        };

        recognitionRef.current.onerror = (event) => {
          console.error("Speech recognition error", event.error);
          setIsRecording(false);
        };

        recognitionRef.current.onend = () => {
          setIsRecording(false);
        };
    }
    
    try {
        recognitionRef.current.start();
    } catch (e) {
        console.error(e);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const playText = async () => {
    if (!textToRead || isPlaying) return;
    
    try {
      setIsPlaying(true);
      const audioBlob = await speakMessage(textToRead);
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      audio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };
      
      audio.play();
    } catch (error) {
      console.error("Error playing audio", error);
      setIsPlaying(false);
      alert("Failed to play audio from backend.");
    }
  };

  return (
    <div className="flex gap-2">
      {!textToRead ? (
        <>
          {!isRecording ? (
            <button 
              onClick={startRecording}
              className="px-4 py-2 rounded-xl bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-sm transition-all flex items-center justify-center gap-2 font-medium text-sm"
            >
              <Mic size={18} className="text-brand-500" />
              <span>Start Recording</span>
            </button>
          ) : (
            <button 
              onClick={stopRecording}
              className="px-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 shadow-sm transition-all flex items-center justify-center gap-2 font-medium text-sm animate-pulse-slow"
            >
              <Square size={16} fill="currentColor" />
              <span>Stop Recording</span>
            </button>
          )}
        </>
      ) : (
        <button 
          onClick={playText}
          disabled={isPlaying}
          className="px-4 py-2 rounded-xl bg-brand-50 text-brand-600 hover:bg-brand-100 transition-all flex items-center justify-center gap-2 border border-brand-200 shadow-sm font-medium text-sm disabled:opacity-50"
        >
          {isPlaying ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Volume2 size={18} />
          )}
          <span>Play Rewritten Message</span>
        </button>
      )}
    </div>
  );
};

export default VoiceControls;
