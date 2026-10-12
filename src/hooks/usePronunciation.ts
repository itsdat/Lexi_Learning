import { useRef, useState } from "react";

const audioCache = new Map<string, string | null>();

const VOICERSS_API_KEY = import.meta.env.VITE_VOICERSS_API_KEY;

export function usePronunciation() {
  const [loading, setLoading] = useState(false);
  const currentAudio = useRef<HTMLAudioElement | null>(null);

  const fetchDictionaryAudio = async (
    word: string,
  ): Promise<string | null> => {
    try {
      const res = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(
          word,
        )}`,
      );

      if (!res.ok) return null;

      const data = await res.json();

      for (const entry of data) {
        for (const p of entry.phonetics || []) {
          if (p.audio) {
            return p.audio.startsWith("http")
              ? p.audio
              : `https:${p.audio}`;
          }
        }
      }

      return null;
    } catch {
      return null;
    }
  };

  const fetchVoiceRSSUrl = (text: string) =>
    `https://api.voicerss.org/?key=${VOICERSS_API_KEY}&hl=en-us&src=${encodeURIComponent(
      text,
    )}&f=44khz_16bit_stereo`;

  const speakFallback = (text: string) => {
    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    const utter = new SpeechSynthesisUtterance(text);

    utter.lang = "en-US";
    utter.rate = 0.9;

    window.speechSynthesis.speak(utter);
  };

  const playUrl = (url: string) =>
    new Promise<boolean>((resolve) => {
      currentAudio.current?.pause();

      const audio = new Audio(url);

      currentAudio.current = audio;

      audio.onplaying = () => resolve(true);

      audio.onerror = () => resolve(false);

      audio.play().catch(() => resolve(false));
    });

  const speak = async (text: string, isWordOnly = true) => {
    setLoading(true);

    try {
      const cached = audioCache.get(text);

      if (cached) {
        if (await playUrl(cached)) return;
      }

      if (isWordOnly) {
        const url = await fetchDictionaryAudio(text);

        if (url && (await playUrl(url))) {
          audioCache.set(text, url);
          return;
        }
      }

      if (VOICERSS_API_KEY) {
        const url = fetchVoiceRSSUrl(text);

        if (await playUrl(url)) {
          audioCache.set(text, url);
          return;
        }
      }

      audioCache.set(text, null);

      speakFallback(text);
    } finally {
      setLoading(false);
    }
  };

  return {
    speak,
    loading,
  };
}