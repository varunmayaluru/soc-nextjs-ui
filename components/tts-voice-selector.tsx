"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ELEVENLABS_CONFIG } from "@/lib/config"

interface TTSVoiceSelectorProps {
  selectedVoice: string
  onVoiceChange: (voiceId: string) => void
  className?: string
  showOnlyFemale?: boolean
  showRecommended?: boolean
}

export default function TTSVoiceSelector({
  selectedVoice,
  onVoiceChange,
  className = "",
  showOnlyFemale = true,
  showRecommended = false,
}: TTSVoiceSelectorProps) {
  // Filter voices based on preferences
  let voices = Object.values(ELEVENLABS_CONFIG.ALL_VOICES)

  if (showOnlyFemale) {
    voices = voices.filter((voice) => voice.gender === "Female")
  }

  if (showRecommended) {
    voices = voices.filter((voice) => voice.recommended)
  }

  const selectedVoiceData = voices.find((voice) => voice.id === selectedVoice) || voices[0]

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700">Voice Selection</label>
        {showOnlyFemale && (
          <Badge variant="secondary" className="text-xs">
            Female Only
          </Badge>
        )}
        {showRecommended && (
          <Badge variant="outline" className="text-xs">
            Recommended
          </Badge>
        )}
      </div>

      <Select value={selectedVoice} onValueChange={onVoiceChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a voice">
            <div className="flex items-center gap-2">
              <span className="font-medium">{selectedVoiceData?.name}</span>
              <span className="text-xs text-gray-500">({selectedVoiceData?.accent})</span>
              {selectedVoiceData?.recommended && (
                <Badge variant="default" className="text-xs">
                  Recommended
                </Badge>
              )}
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {voices.map((voice) => (
            <SelectItem key={voice.id} value={voice.id}>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{voice.name}</span>
                  <span className="text-xs text-gray-500">({voice.accent})</span>
                  {voice.recommended && (
                    <Badge variant="default" className="text-xs">
                      Recommended
                    </Badge>
                  )}
                </div>
                <span className="text-xs text-gray-400">{voice.description}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Voice configuration info */}
      <div className="text-xs text-gray-500 mt-1">
        <p>
          <strong>Current:</strong> {selectedVoiceData?.name} - {selectedVoiceData?.description}
        </p>
        <p>
          <strong>Settings:</strong> Educational mode (slower, clearer speech)
        </p>
      </div>
    </div>
  )
}
