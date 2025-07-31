import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Volume2, VolumeX, Loader } from 'lucide-react'
import { Transcriber } from '@/lib/types'
import axios from 'axios'
import MarkdownViewer from './MarkDownViewer'

interface Props {
  transcriber: Transcriber
}

export default function VoiceResponse({ transcriber }: Props) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSynthesizing, setIsSynthesizing] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [response, setResponse] = useState<string>('')

  const output = transcriber.output
  const workerRef = useRef<Worker | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const worker = new Worker(new URL('../lib/tts-worker.js', import.meta.url), {
        type: 'module',
      })
      workerRef.current = worker

      return () => {
        worker.terminate()
        workerRef.current = null
      }
    }
  }, [])

  const generateResponse = async () => {
    setIsGenerating(true)
    if (output) {
      try {
        const response = await axios.post('/api/get-response', {
          query: output.text
        })
        setResponse(response.data.data)
      } catch (error) {
        setResponse(
          `error occurred while fetching response from groq: ${error}`
        )
      } finally {
        setIsGenerating(false)
      }
    } else {
      setResponse('Please transcribe your questions first to get a result!')
      setIsGenerating(false)
    }
  }

  const playResponse = async () => {
    if (!response || !workerRef.current) return
    setIsSynthesizing(true)
    setIsPlaying(false)

    try {
      workerRef.current.postMessage(response)

      workerRef.current.onmessage = (event) => {
        const audioBlob = event.data
        const audioUrl = URL.createObjectURL(audioBlob)
        const audio = new Audio(audioUrl)

        setIsSynthesizing(false)
        setIsPlaying(true)
        audio.play()

        audio.onended = () => {
          setIsPlaying(false)
          URL.revokeObjectURL(audioUrl)
        }
      }
    } catch (err) {
      console.error('Audio playback error:', err)
      setIsPlaying(false)
      setIsSynthesizing(false)
    }
  }

  const stopPlayback = () => {
    setIsPlaying(false)
  }

  return (
    <div className='rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] p-6 shadow-lg'>
      <div className='mb-4 flex items-center justify-between'>
        <h2 className='text-xl font-semibold text-gray-100'>AI Response</h2>
        <div className='flex gap-2'>
          <Button
            onClick={generateResponse}
            disabled={isGenerating}
            className='rounded-lg border-0 bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700'
          >
            {isGenerating ? (
              <>
                <Loader className='mr-2 h-4 w-4 animate-spin' />
                Generating...
              </>
            ) : (
              'Generate Response'
            )}
          </Button>

          {response && (
            <Button
              onClick={isPlaying ? stopPlayback : playResponse}
              disabled={isSynthesizing}
              variant='outline'
              className='w-40 flex items-center gap-2 border-[#3a3a3a] bg-[#2a2a2a] text-gray-200 hover:bg-[#3a3a3a] hover:text-gray-100'
            >
              {isPlaying ? (
                <>
                  <VolumeX className='h-4 w-4' />
                  Stop
                </>
              ) : isSynthesizing ? (
                <>
                  <Loader className='h-4 w-4 animate-spin' />
                  Loading voice...
                </>
              ) : (
                <>
                  <Volume2 className='h-4 w-4' />
                  Play
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      <div className='max-h-64 min-h-[120px] overflow-auto rounded-lg border border-[#2a2a2a] bg-[#121212] p-4'>
        {isGenerating ? (
          <div className='flex flex-col space-y-3'>
            <div className='flex items-center gap-2'>
              <div className='h-2 w-2 animate-pulse rounded-full bg-emerald-500'></div>
              <span className='text-sm text-gray-400'>
                Generating AI response...
              </span>
            </div>
            <div className='space-y-2'>
              <div className='h-3 w-full animate-pulse rounded bg-[#2a2a2a]'></div>
              <div className='h-3 w-4/5 animate-pulse rounded bg-[#2a2a2a]'></div>
              <div className='h-3 w-3/4 animate-pulse rounded bg-[#2a2a2a]'></div>
            </div>
          </div>
        ) : response ? (
          <div className='space-y-2'>
            <div className='mb-3 flex items-center gap-2'>
              <div
                className={`h-2 w-2 rounded-full ${isPlaying ? 'animate-pulse bg-blue-500' : 'bg-emerald-500'}`}
              ></div>
              <span className='text-sm font-medium text-gray-400'>
                {isPlaying ? 'Playing response...' : 'Response ready'}
              </span>
            </div>
            <MarkdownViewer markdown={response}/>
          </div>
        ) : (
          <div className='flex h-full items-center justify-center text-gray-500'>
            <div className='text-center'>
              <div className='mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg border-2 border-dashed border-[#2a2a2a]'>
                <span className='text-2xl'>🤖</span>
              </div>
              <p className='text-sm text-gray-400'>No AI response yet</p>
              <p className='mt-1 text-xs text-gray-500'>
                Generate a response to see AI output
              </p>
            </div>
          </div>
        )}
      </div>

      {isPlaying && (
        <div className='mt-4 flex items-center justify-center gap-1'>
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className='w-1 animate-pulse rounded-full bg-blue-500'
              style={{
                height: `${Math.random() * 20 + 10}px`,
                animationDelay: `${i * 0.1}s`
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
