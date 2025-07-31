import { pipeline } from '@xenova/transformers';

let synthesizer = null;

self.onmessage = async (e) => {
  const text = e.data;

  if (!synthesizer) {
    synthesizer = await pipeline('text-to-speech', 'Xenova/mms-tts-eng', {
      quantized: true,
    });
  }

  const result = await synthesizer(text, {
    vocoder: 'Xenova/mms-tts-melgan'
  });

  const wavBlob = float32ArrayToWavBlob(result.audio, result.sampling_rate);

  self.postMessage(wavBlob);
};

function float32ArrayToWavBlob(float32Array, sampleRate) {
  const bufferLength = float32Array.length * 2;
  const buffer = new ArrayBuffer(44 + bufferLength);
  const view = new DataView(buffer);

  const writeString = (offset, str) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + bufferLength, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, bufferLength, true);

  let offset = 44;
  for (let i = 0; i < float32Array.length; i++, offset += 2) {
    const sample = Math.max(-1, Math.min(1, float32Array[i]));
    view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
  }

  return new Blob([buffer], { type: 'audio/wav' });
}
