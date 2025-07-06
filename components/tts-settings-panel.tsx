"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import TTSVoiceSelector from "./tts-voice-selector"
import { ELEVENLABS_CONFIG } from "@/lib/config"

interface TTSSettingsPanelProps {
  onSettingsChange?: (settings: TTSSettings) => void
}

export interface TTSSettings {
  voice: string
  contentType: "educational" | "conversational" | "formal"
  stability: number
  similarityBoost: number
  speed: number
  useSpeakerBoost: boolean
}

export default function TTSSettingsPanel({ onSettingsChange }: TTSSettingsPanelProps) {
  const [settings, setSettings] = useState<TTSSettings>({
    voice: ELEVENLABS_CONFIG.DEFAULT_VOICE,
    contentType: "educational",
    stability: 0.4,
    similarityBoost: 0.9,
    speed: 1.0,
    useSpeakerBoost: true,
  })

  const handleSettingChange = (key: keyof TTSSettings, value: any) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    onSettingsChange?.(newSettings)
  }

  const resetToDefaults = () => {
    const defaultSettings: TTSSettings = {
      voice: ELEVENLABS_CONFIG.DEFAULT_VOICE,
      contentType: "educational",
      stability: 0.4,
      similarityBoost: 0.9,
      speed: 1.0,
      useSpeakerBoost: true,
    }
    setSettings(defaultSettings)
    onSettingsChange?.(defaultSettings)
  }

  const applyPreset = (preset: "educational" | "conversational" | "formal") => {
    const presetSettings =
      ELEVENLABS_CONFIG.CONTENT_VOICE_SETTINGS[
        preset.toUpperCase() as keyof typeof ELEVENLABS_CONFIG.CONTENT_VOICE_SETTINGS
      ]
    const newSettings = {
      ...settings,
      contentType: preset,
      ...presetSettings,
    }
    setSettings(newSettings)
    onSettingsChange?.(newSettings)
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Text-to-Speech Settings
          <Badge variant="secondary">ElevenLabs</Badge>
        </CardTitle>
        <CardDescription>
          Configure voice settings for optimal speech synthesis. Female voices are prioritized for educational content.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Voice Selection */}
        <TTSVoiceSelector
          selectedVoice={settings.voice}
          onVoiceChange={(voice) => handleSettingChange("voice", voice)}
          showOnlyFemale={true}
          showRecommended={true}
        />

        {/* Content Type Presets */}
        <div className="space-y-3">
          <Label>Content Type Presets</Label>
          <div className="flex gap-2">
            {(["educational", "conversational", "formal"] as const).map((preset) => (
              <Button
                key={preset}
                variant={settings.contentType === preset ? "default" : "outline"}
                size="sm"
                onClick={() => applyPreset(preset)}
                className="capitalize"
              >
                {preset}
              </Button>
            ))}
          </div>
          <p className="text-xs text-gray-500">Educational: Slower, clearer speech for learning content</p>
        </div>

        {/* Advanced Settings */}
        <div className="space-y-4">
          <Label className="text-base font-medium">Advanced Voice Settings</Label>

          {/* Stability */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="stability">Stability</Label>
              <span className="text-sm text-gray-500">{settings.stability}</span>
            </div>
            <Slider
              id="stability"
              min={0}
              max={1}
              step={0.1}
              value={[settings.stability]}
              onValueChange={([value]) => handleSettingChange("stability", value)}
            />
            <p className="text-xs text-gray-500">Lower values = more expressive, Higher values = more stable</p>
          </div>

          {/* Similarity Boost */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="similarity">Similarity Boost</Label>
              <span className="text-sm text-gray-500">{settings.similarityBoost}</span>
            </div>
            <Slider
              id="similarity"
              min={0}
              max={1}
              step={0.1}
              value={[settings.similarityBoost]}
              onValueChange={([value]) => handleSettingChange("similarityBoost", value)}
            />
            <p className="text-xs text-gray-500">Higher values = better voice consistency</p>
          </div>

          {/* Speed */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="speed">Speaking Speed</Label>
              <span className="text-sm text-gray-500">{settings.speed}x</span>
            </div>
            <Slider
              id="speed"
              min={0.5}
              max={2.0}
              step={0.1}
              value={[settings.speed]}
              onValueChange={([value]) => handleSettingChange("speed", value)}
            />
            <p className="text-xs text-gray-500">0.5x = Very slow, 1.0x = Normal, 2.0x = Very fast</p>
          </div>

          {/* Speaker Boost */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="speaker-boost">Speaker Boost</Label>
              <p className="text-xs text-gray-500">Enhances voice clarity and presence</p>
            </div>
            <Switch
              id="speaker-boost"
              checked={settings.useSpeakerBoost}
              onCheckedChange={(checked) => handleSettingChange("useSpeakerBoost", checked)}
            />
          </div>
        </div>

        {/* Reset Button */}
        <div className="pt-4 border-t">
          <Button variant="outline" onClick={resetToDefaults} className="w-full bg-transparent">
            Reset to Defaults
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
