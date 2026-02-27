 "use client";
import useIsMobile from "@/hooks/useIsMobile";
import { useLocale } from "@/locales/use-locale";
import React, { createContext, useContext, useState } from "react";

type AudioContextValue = {
  isSpeaking: {
    state: boolean;
    text: string | null;
  };
  speak: (text: string, speed: number) => void;
  stopAudio: () => void;
};

const defaultAudioContextValue: AudioContextValue = {
  isSpeaking: { state: false, text: null },
  speak: () => {},
  stopAudio: () => {},
};

// Create the context (safe defaults when Provider missing)
const AudioContext = createContext<AudioContextValue>(defaultAudioContextValue);

export const useAudio = () => {
  return useContext(AudioContext);
};

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const [isSpeaking, setIsSpeaking] = useState<{
    state: boolean;
    text: string | null;
  }>({
    state: false,
    text: null,
  });

  const { t } = useLocale();

  const isMobile = useIsMobile();

  const speak = (text: string, speed: number) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    setIsSpeaking({
      state: true,
      text: text,
    });

    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);

    // Use BCP-47 language tag (works across browsers)
    utterance.lang = "ja-JP";

    const pickJapaneseVoice = (voices: SpeechSynthesisVoice[]) =>
      voices.find((v) => v.lang?.toLowerCase().startsWith("ja")) ??
      voices.find((v) => v.voiceURI?.includes("ja-JP")) ??
      voices.find((v) => v.name?.toLowerCase().includes("japanese"));

    const setVoiceIfAvailable = () => {
      const voices = synth.getVoices();
      const picked = pickJapaneseVoice(voices);
      if (picked) utterance.voice = picked;
      return voices.length > 0;
    };

    const speakNow = () => {
      synth.cancel();
      synth.speak(utterance);
    };

    // Some browsers (notably Safari) populate voices async.
    if (!setVoiceIfAvailable()) {
      const handleVoicesChanged = () => {
        setVoiceIfAvailable();
        speakNow();
        synth.removeEventListener("voiceschanged", handleVoicesChanged);
      };
      synth.addEventListener("voiceschanged", handleVoicesChanged);

      // Fallback: try shortly after even if event doesn't fire.
      window.setTimeout(() => {
        try {
          synth.removeEventListener("voiceschanged", handleVoicesChanged);
        } catch {}
        setVoiceIfAvailable();
        speakNow();
      }, 250);
      return;
    }

    utterance.rate = speed;

    utterance.onstart = () =>
      setIsSpeaking({
        state: true,
        text: text,
      });

    utterance.onend = () =>
      setIsSpeaking({
        state: false,
        text: null,
      });
    utterance.onerror = (e) => {
      if ((!e.error || e.error === "synthesis-failed") && !isMobile) {
        
      }
      setIsSpeaking({
        state: false,
        text: null,
      });
    };

    speakNow();
  };

  const stopAudio = React.useCallback(() => {
    window.speechSynthesis.cancel();
  }, []);

  const value = {
    isSpeaking,
    speak,
    stopAudio,
  };

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
};
