import { useEffect } from "react";
import { useSpeech } from "./SpeechProvider";
import { Play, Pause, RotateCcw } from "lucide-react";

interface Props {
  id: string;
  message: string;
}

export default function TextToSpeech({ id, message }: Props) {
  const { currentId, isPaused, speak, pause, resume, reset } = useSpeech();

  const isCurrent = currentId === id;
  const isPlaying = isCurrent && !isPaused;
  const isPausedCurrent = isCurrent && isPaused;

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else if (isPausedCurrent) {
      resume();
    } else {
      speak(id, message); // this will cancel previous automatically
    }
  };

  const handleReset = () => {
    if (isCurrent) reset();
  };

  return (
    <div className="flex gap-2 ml-2 ">
      <button
        onClick={handlePlayPause}
        className={`p-1.5 rounded-full transition-colors ${
          isCurrent
            ? "bg-green-600 hover:bg-green-700"
            : "bg-yellow-100  hover:bg-yellow-200"
        }`}
        title={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? <Pause size={16} /> : <Play size={16} />}
      </button>

      <button
        onClick={handleReset}
        className={`p-1.5 rounded-full transition-colors ${
          isCurrent
            ? "bg-red-600 hover:bg-red-700"
            : "bg-gray-600 opacity-50 cursor-not-allowed"
        }`}
        disabled={!isCurrent}
        title="Reset"
      >
        <RotateCcw size={16} />
      </button>
    </div>
  );
}
