'use client'

import axios from 'axios'
import { Transcriber } from '@/lib/types'
import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import AudioPlayer from '@/components/audio-player'
import { AudioRecorderDialog } from '@/components/audio-recorder-dialog'
import {Loader,RotateCcw } from 'lucide-react'

export enum AudioSource {
  URL = 'URL',
  FILE = 'FILE',
  RECORDING = 'RECORDING'
}

interface AudioData {
  buffer: AudioBuffer
  url: string
  source: AudioSource
  mimeType: string
}

export default function AudioManager({
  transcriber
}: {
  transcriber: Transcriber
}) {
  const [audioData, setAudioData] = useState<AudioData | undefined>(undefined)
  const [url, setUrl] = useState<string | undefined>(undefined)

  const resetAudio = () => {
    transcriber.onInputChange()
    setAudioData(undefined)
    setUrl(undefined)
  }

  const setAudioFromRecording = async (data: Blob) => {
    resetAudio()

    const blobUrl = URL.createObjectURL(data)
    const fileReader = new FileReader()

    fileReader.onloadend = async () => {
      const audioCTX = new AudioContext({ sampleRate: 16000 })
      const arrayBuffer = fileReader.result as ArrayBuffer
      const decoded = await audioCTX.decodeAudioData(arrayBuffer)

      setAudioData({
        buffer: decoded,
        url: blobUrl,
        source: AudioSource.RECORDING,
        mimeType: data.type
      })
    }

    fileReader.readAsArrayBuffer(data)
  }

  const downloadAudioFromUrl = useCallback(
    async (
      url: string | undefined,
      requestAbortController: AbortController
    ) => {
      if (url) {
        try {
          setAudioData(undefined)

          const { data, headers } = (await axios.get(url, {
            signal: requestAbortController.signal,
            responseType: 'arraybuffer'
          })) as {
            data: ArrayBuffer
            headers: { 'content-type': string }
          }

          let mimeType = headers['content-type']
          if (!mimeType || mimeType === 'audio/wave') {
            mimeType = 'audio/wav'
          }

          const audioCTX = new AudioContext({ sampleRate: 16000 })
          const blobUrl = URL.createObjectURL(
            new Blob([data], { type: 'audio/*' })
          )

          const decoded = await audioCTX.decodeAudioData(data)

          setAudioData({
            buffer: decoded,
            url: blobUrl,
            source: AudioSource.URL,
            mimeType: mimeType
          })
        } catch (error) {
          console.log('Request failed or aborted', error)
        }
      }
    },
    []
  )

  useEffect(() => {
    if (url) {
      const requestAbortController = new AbortController()
      downloadAudioFromUrl(url, requestAbortController)
      return () => {
        requestAbortController.abort()
      }
    }
  }, [downloadAudioFromUrl, url])

  return (
    <div className='bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl shadow-lg p-6'>
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-xl font-semibold text-gray-100'>Voice Assistant</h2>
        <div className='flex items-center gap-2'>
          <div className='w-2 h-2 bg-emerald-500 rounded-full'></div>
          <span className='text-sm text-gray-400 font-medium'>Online</span>
        </div>
      </div>

      {/* Main Recording Interface */}
      <div className='flex flex-col items-center'>
        {/* Large Blue Microphone Button */}
        <div className='relative mb-4'>
          <div className='inline-block'>
            <AudioRecorderDialog
              onLoad={data => {
                transcriber.onInputChange()
                setAudioFromRecording(data)
              }}
            />
          </div>
        </div>

        {/* Recording Status */}
        <p className='text-gray-400 text-sm mb-4'>Click to start recording</p>

        {/* Audio Player and Buttons */}
        {audioData && (
          <div className='w-full space-y-3'>
            <AudioPlayer
              audioUrl={audioData.url}
              mimeType={audioData.mimeType}
            />

            <div className='flex gap-2'>
              <Button 
                onClick={() => transcriber.start(audioData.buffer)}
                className='flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium border-0'
                disabled={transcriber.isModelLoading || transcriber.isProcessing}
              >
                {transcriber.isModelLoading ? (
                  <>
                    <Loader className='animate-spin w-4 h-4 mr-2' />
                    Loading model
                  </>
                ) : transcriber.isProcessing ? (
                  <>
                    <Loader className='animate-spin w-4 h-4 mr-2' />
                    Transcribing
                  </>
                ) : (
                  'Transcribe'
                )}
              </Button>

              <Button 
                variant="outline" 
                onClick={resetAudio} 
                className='flex items-center gap-2 bg-[#2a2a2a] border-[#3a3a3a] text-gray-300 hover:bg-[#3a3a3a] hover:text-gray-100'
              >
                <RotateCcw className='w-4 h-4' />
                Reset
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}