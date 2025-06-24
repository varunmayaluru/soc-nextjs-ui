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
    <div className="flex gap-1">
      <button
        onClick={handlePlayPause}
        className={`p-1.5 rounded-full transition-colors ${isCurrent
            ? "bg-green-500 hover:bg-green-600 text-white"
            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
        title={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? <Pause size={14} /> : <Play size={14} />}
      </button>

      <button
        onClick={handleReset}
        className={`p-1.5 rounded-full transition-colors ${isCurrent
            ? "bg-red-500 hover:bg-red-600 text-white"
            : "bg-gray-100 hover:bg-gray-200 text-gray-500"
          }`}
        disabled={!isCurrent}
        title="Reset"
      >
        <RotateCcw size={14} />
      </button>
    </div>
  );
}
