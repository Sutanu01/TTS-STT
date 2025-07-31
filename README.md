# TTS-STT: Speech-to-Text and Text-to-Speech Application

A full-stack web application that provides real-time speech-to-text transcription and text-to-speech synthesis capabilities, built with Next.js and modern web technologies.

## 📋 Project Overview

This application demonstrates advanced speech processing capabilities by combining:

- **Speech-to-Text (STT)**: Real-time audio transcription using Whisper AI models
- **Text-to-Speech (TTS)**: AI-powered voice synthesis for generated responses
- **AI Integration**: Intelligent response generation using Groq's LLaMA model
- **Modern UI/UX**: Dark-themed, responsive interface with smooth animations

## 🚀 Key Features

### Audio Input Methods

- **Live Recording**: Record audio directly through the browser's microphone
- **File Upload**: Support for various audio file formats
- **URL Import**: Import audio from web URLs

### Speech Processing

- **Real-time Transcription**: Converts speech to text using Xenova Transformers' Whisper models
- **Browser Model Caching**: Whisper models are cached locally for offline speech recognition
- **Multi-channel Audio Support**: Handles both mono and stereo audio inputs
- **Progress Tracking**: Visual feedback during model loading and processing
- **Streaming Processing**: Live audio chunks processed in Web Workers for optimal performance

### AI-Powered Responses

- **Intelligent Analysis**: Generates contextual responses to transcribed content
- **Markdown Support**: Rich text formatting for enhanced readability
- **Voice Synthesis**: Converts AI responses back to speech

### User Experience

- **Responsive Design**: Optimized for desktop and mobile devices
- **Real-time Updates**: Live transcription and processing status
- **Audio Playback Controls**: Play, pause, and control synthesized speech

## 🛠️ Technology Stack

### Frontend

- **Next.js 15.2.4**: React framework with App Router
- **React 19**: Latest React with concurrent features
- **TypeScript**: Type-safe development
- **Tailwind CSS 4.0**: Utility-first styling with custom animations
- **Radix UI**: Accessible component primitives

### AI & Machine Learning

- **@xenova/transformers**: Client-side Whisper models for speech recognition with browser caching
- **Groq SDK**: Fast LLM inference with LLaMA-3-70B model for intelligent responses
- **Web Workers**: Non-blocking ML model processing in dedicated threads
- **Model Caching**: Automatic browser caching of Whisper and TTS models for offline operation

### Audio Processing

- **Web Audio API**: Browser-native audio manipulation
- **MediaRecorder API**: Real-time audio recording
- **AudioContext**: Advanced audio processing and resampling

### Development Tools

- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting with Tailwind CSS plugin
- **PNPM**: Fast, disk space efficient package manager

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Sutanu01/TTS-STT.git
   cd TTS-STT
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:

   ```env
   GROQ_API_KEY=your_groq_api_key_here 
   ```

4. **Run the development server**

   ```bash
   npm dev
   ```

5. **Open the application**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser

## 🔧 Configuration

### Environment Variables

- `GROQ_API_KEY`: Required for AI response generation (get from [Groq Console](https://console.groq.com/))

### Model Caching & Offline Operation

- **First Load**: Models are downloaded and cached automatically in the browser
- **Subsequent Loads**: Application runs entirely offline except for Groq API calls
- **Cache Storage**: Uses browser's IndexedDB for persistent model storage
- **Progressive Download**: Models load with visual progress indicators
- **Cache Validation**: Automatic cache invalidation for model updates

### Audio Settings

- Sample Rate: 16kHz (automatically resampled)
- Supported Formats: WAV, MP3, M4A, OGG
- Max File Size: Browser-dependent

## 📱 Usage

### Recording Audio

1. Click the "Record" button to start voice recording
2. Speak clearly into your microphone
3. Click "Stop" to end recording and begin transcription

### Uploading Files

1. Click "Upload File" to select an audio file
2. Choose from supported audio formats
3. Wait for automatic transcription to complete

### Getting AI Responses

1. After transcription is complete, click "Generate Response"
2. The AI will analyze your speech and provide relevant responses
3. Click the speaker icon to hear the response read aloud

## 🏗️ Project Structure

```text
├── app/
│   ├── api/get-response/route.ts    # Groq API integration
│   ├── layout.tsx                   # App layout and providers
│   └── page.tsx                     # Main application page
├── components/
│   ├── audio-manager.tsx            # Audio input management
│   ├── audio-recorder.tsx           # Recording functionality
│   ├── transcript.tsx               # Transcription display
│   ├── voice-response.tsx           # AI response and TTS
│   └── ui/                          # Reusable UI components
├── hooks/
│   ├── useTranscriber.ts            # Speech recognition logic
│   └── useWorker.ts                 # Web Worker management
├── lib/
│   ├── worker.js                    # Speech processing worker
│   ├── tts-worker.js                # Text-to-speech worker
│   └── types.ts                     # TypeScript definitions
└── public/                          # Static assets
```

## 🔄 Available Scripts

- `npm dev`: Start development server
- `npm build`: Build for production
- `npm start`: Start production server
- `npm lint`: Run ESLint

## 🌐 API Endpoints

### POST `/api/get-response`

Generates AI responses based on transcribed text.

**Request Body:**

```json
{
  "query": "transcribed text content"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Questions generated successfully.",
  "data": "AI-generated response in markdown format"
}
```

## 🎯 Technical Highlights

### Offline-First Architecture

- **Model Caching**: Whisper STT and TTS models cached in browser storage after first download
- **Progressive Web App**: Optimized for offline operation with cached resources
- **Web Workers**: Dedicated threads for ML processing to maintain UI responsiveness
- **Hybrid Approach**: Local processing for STT/TTS, cloud API for intelligent responses

### Performance Optimizations

- **Client-side ML**: Models run directly in the browser using Xenova Transformers
- **Model Caching**: Whisper and TTS models are cached in the browser after first load for offline operation
- **Web Workers**: Non-blocking audio processing in dedicated workers
- **Progressive Loading**: Models are downloaded and cached incrementally with progress tracking
- **Lazy Loading**: Components and models loaded on demand
- **Efficient Bundling**: Optimized build with Next.js
- **Offline-First**: Application runs offline after initial model download except for Groq API calls

### Response Time Optimization

- **Target Latency**: < 1.2s total response time on good networks
- **STT Processing**: Real-time transcription with live feedback
- **API Integration**: Fast Groq inference for intelligent responses
- **TTS Synthesis**: Local audio generation for immediate playback
- **Parallel Processing**: Concurrent model operations where possible

## 📄 License

This project is developed as part of a coding assessment and is intended for educational and evaluation purposes.

## 🙋‍♂️ Author

Sutanu Jana

- GitHub: [@Sutanu01](https://github.com/Sutanu01)
- Repository: [TTS-STT](https://github.com/Sutanu01/TTS-STT)

---

*This application demonstrates modern web development practices, AI integration, and real-time audio processing capabilities in a production-ready Next.js environment.*
