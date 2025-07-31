'use client'

import Transcript from '@/components/transcript'
import AudioManager from '@/components/audio-manager'
import VoiceResponse from '@/components/voice-response'
import { useTranscriber } from '@/hooks/useTranscriber'

export default function Home() {
  const transcriber = useTranscriber()

  return (
    <div className='min-h-screen bg-[#0a0a0a] flex justify-center items-center'>
      <div className='container max-w-4xl mx-auto py-8 px-4'>
        {/* Main Content */}
        <div className='space-y-6'>
          {/* Recording and Transcription Row */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Audio Recording Section */}
            <AudioManager transcriber={transcriber} />
            
            {/* Transcription Section */}
            <Transcript transcriber={transcriber} />
          </div>
          
          {/* Voice Response Section */}
          <VoiceResponse transcriber={transcriber}/>
        </div>
      </div>
    </div>
  )
}