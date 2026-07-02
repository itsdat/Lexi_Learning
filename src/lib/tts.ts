export const speak = (text: string, lang: string = "en-US") => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 0.8; // chậm chút để dễ nghe
  window.speechSynthesis.speak(utterance);
};

export const stopSpeaking = () => {
  window.speechSynthesis.cancel();
};