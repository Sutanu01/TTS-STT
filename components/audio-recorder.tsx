'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Mic, Square, Play, Pause } from 'lucide-react'

interface AudioRecorderProps {
  onRecordingComplete: (blob: Blob) => void
}

export function AudioRecorder({ onRecordingComplete }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: 'audio/wav'
        })
        onRecordingComplete(audioBlob)
      }

      mediaRecorder.start()
      setIsRecording(true)
      setIsPaused(false)
      setRecordingTime(0)

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    } catch (error) {
      console.error('Error accessing microphone:', error)
    }
  }

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume()
        setIsPaused(false)
        timerRef.current = setInterval(() => {
          setRecordingTime(prev => prev + 1)
        }, 1000)
      } else {
        mediaRecorderRef.current.pause()
        setIsPaused(true)
        if (timerRef.current) {
          clearInterval(timerRef.current)
          timerRef.current = null
        }
      }
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setIsPaused(false)
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
        streamRef.current = null
      }
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  return (
    <div className="flex w-full flex-col items-center space-y-2 text-gray-100">
      <div className="flex w-full items-center justify-center">
        <div className="font-mono text-lg text-gray-100">
          {formatTime(recordingTime)}
        </div>
        {isRecording && !isPaused && (
          <div className="ml-3 h-3 w-3 animate-pulse rounded-full bg-red-500" />
        )}
      </div>

      <div className="flex space-x-4">
        {!isRecording ? (
          <Button
            onClick={startRecording}
            size="icon"
            variant="default"
            className="bg-[#2a2a2a] border-[#3a3a3a] text-gray-300 hover:bg-[#3a3a3a] hover:text-gray-100"
          >
            <Mic className="h-5 w-5 text-gray-100" />
          </Button>
        ) : (
          <>
            <Button
              onClick={pauseRecording}
              size="icon"
              variant="outline"
              className="border-[#3a3a3a] text-gray-300 bg-[#3a3a3a] 
              hover:bg-[#3a3a3a] hover:text-gray-100"
            >
              {isPaused ? (
                <Play className="h-5 w-5 text-gray-100" />
              ) : (
                <Pause className="h-5 w-5 text-gray-100" />
              )}
            </Button>

            <Button
              onClick={stopRecording}
              size="icon"
              variant="destructive"
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Square className="h-5 w-5 text-white" />
            </Button>
          </>
        )}
      </div>

      {/* Status Text */}
      {isRecording && (
        <div className="text-gray-400 text-sm">
          {isPaused ? 'Recording paused' : 'Recording...'}
        </div>
      )}
    </div>
  )
}
