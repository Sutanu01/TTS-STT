import { Transcriber } from '@/lib/types'

interface Props {
  transcriber: Transcriber
}

export default function Transcript({ transcriber }: Props) {
  const output = transcriber.output
  const isProcessing = transcriber.isProcessing

  return (
    <div className='bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl shadow-lg p-6'>
      <h2 className='text-xl font-semibold text-gray-100 mb-4'>Transcription</h2>
      
      <div className='bg-[#121212] border border-[#2a2a2a] rounded-lg p-4 min-h-[120px] max-h-64 overflow-auto'>
        {isProcessing ? (
          <div className='flex flex-col space-y-3'>
            <div className='flex items-center gap-2'>
              <div className='w-2 h-2 bg-blue-500 rounded-full animate-pulse'></div>
              <span className='text-sm text-gray-400'>Processing audio...</span>
            </div>
            <div className='space-y-2'>
              <div className='h-3 animate-pulse rounded bg-[#2a2a2a] w-3/4'></div>
              <div className='h-3 animate-pulse rounded bg-[#2a2a2a] w-1/2'></div>
              <div className='h-3 animate-pulse rounded bg-[#2a2a2a] w-2/3'></div>
            </div>
          </div>
        ) : output ? (
          <div className='space-y-2'>
            <div className='flex items-center gap-2 mb-3'>
              <div className='w-2 h-2 bg-emerald-500 rounded-full'></div>
              <span className='text-sm text-gray-400 font-medium'>Transcription complete</span>
            </div>
            <p className='text-gray-200 leading-relaxed'>{output.text}</p>
          </div>
        ) : (
          <div className='flex items-center justify-center h-full text-gray-500'>
            <div className='text-center'>
              <div className='w-12 h-12 border-2 border-[#2a2a2a] border-dashed rounded-lg mx-auto mb-3 flex items-center justify-center'>
                <span className='text-2xl'>🎤</span>
              </div>
              <p className='text-sm text-gray-400'>No transcription available</p>
              <p className='text-xs text-gray-500 mt-1'>Record or upload audio to see transcription</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}