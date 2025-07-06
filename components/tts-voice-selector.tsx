"use client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ELEVENLABS_CONFIG } from "@/lib/config"

interface TTSVoiceSelectorProps {
  selectedVoice: string
  onVoiceChange: (voiceId: string) => void
  className?: string
}

export default function TTSVoiceSelector({ selectedVoice, onVoiceChange, className = "" }: TTSVoiceSelectorProps) {
  const voices = Object.values(ELEVENLABS_CONFIG.VOICES)

  const selectedVoiceData = voices.find((voice) => voice.id === selectedVoice) || voices[0]

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label className="text-sm font-medium text-gray-700">Voice Selection</label>
      <Select value={selectedVoice} onValueChange={onVoiceChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a voice">
            {selectedVoiceData.name} - {selectedVoiceData.description}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {voices.map((voice) => (
            <SelectItem key={voice.id} value={voice.id}>
              <div className="flex flex-col">
                <span className="font-medium">{voice.name}</span>
                <span className="text-xs text-gray-500">{voice.description}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
