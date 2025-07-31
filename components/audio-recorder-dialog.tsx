'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { AudioRecorder } from '@/components/audio-recorder'

import { Download, Mic } from 'lucide-react'

export function AudioRecorderDialog({
  onLoad
}: {
  onLoad: (blob: Blob) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [audioData, setAudioData] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)

  const handleAudioRecorded = (blob: Blob) => {
    setAudioData(blob)
    const url = URL.createObjectURL(blob)
    setAudioUrl(url)
  }

  const handleLoad = () => {
    if (audioData && audioUrl) {
      onLoad(audioData)
      URL.revokeObjectURL(audioUrl)
      setAudioUrl(null)
      setAudioData(null)
      setIsOpen(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center space-x-2 bg-[#2a2a2a] border-[#3a3a3a] text-gray-300 hover:bg-[#3a3a3a] hover:text-gray-100 hover:border-[#4a4a4a]"
        >
          <Mic className="size-4 text-gray-200" />
          <span>Record</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-[#1a1a1a] border-[#2a2a2a] text-gray-100">
        <DialogHeader>
          <DialogTitle className="text-gray-100">Audio Recorder</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-start">
          <AudioRecorder onRecordingComplete={handleAudioRecorded} />

          {audioData && audioUrl && (
            <div className="mt-4 w-full bg-[#121212] border border-[#2f2f2f] rounded-lg p-4">
              <h3 className="mb-2 text-sm font-medium text-gray-300">
                Recorded Audio
              </h3>
              <audio
                className="w-full rounded-md bg-[#1f1f1f] text-white"
                controls
                style={{
                  accentColor: '#3b82f6'
                }}
              >
                <source src={audioUrl} type={audioData.type} />
              </audio>
            </div>
          )}
        </div>

        <DialogFooter className="mt-6">
          <Button
            type="button"
            size="sm"
            disabled={!audioData}
            onClick={handleLoad}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white border-0 disabled:bg-[#2a2a2a] disabled:text-gray-500"
          >
            <Download className="size-4 text-white" />
            <span>Load</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
