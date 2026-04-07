import { useState, useRef } from "react";

const SpeechRecognition =
  (window as any).SpeechRecognition ||
  (window as any).webkitSpeechRecognition;

export const useSpeech = () => {
  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);

  // ✅ persistent instance
  const recognitionRef = useRef<any>(null);

  if (!recognitionRef.current && SpeechRecognition) {
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.lang = "en-US";
  }

  const startListening = () => {
    if (!recognitionRef.current) {
      alert("Speech Recognition not supported in this browser");
      return;
    }

    setListening(true);

    recognitionRef.current.start();

    recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setText(transcript);
      setListening(false);
    };

    recognitionRef.current.onerror = () => {
      setListening(false);
    };
  };

  return {
    text,
    setText,
    startListening,
    listening, // 👈 optional UI ke liye
  };
};