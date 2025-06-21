import { useState, useEffect, useRef } from 'react'
import Vapi from '@vapi-ai/web'
import { Mic, MicOff, Phone, PhoneOff, MessageSquare, Volume2, Clock, Send } from 'lucide-react'

// Get API key from environment variable
const VAPI_PUBLIC_KEY = import.meta.env.VITE_VAPI_PUBLIC_KEY

function App() {
  // Vapi instance
  const [vapi] = useState(() => new Vapi(VAPI_PUBLIC_KEY || ''))
  
  // Connection state
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [assistantIsSpeaking, setAssistantIsSpeaking] = useState(false)
  
  // UI state
  const [status, setStatus] = useState('Ready to start studying!')
  const [error, setError] = useState('')
  const [volumeLevel, setVolumeLevel] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  
  // Message history
  const [messages, setMessages] = useState([])
  const messagesEndRef = useRef(null)
  
  // Custom say functionality
  const [customSayText, setCustomSayText] = useState('')

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (!VAPI_PUBLIC_KEY || VAPI_PUBLIC_KEY === 'your_vapi_public_key_here') {
      setError('Please add your Vapi API key to .env file')
      return
    }

    // Set up Vapi event listeners
    vapi.on('call-start', () => {
      console.log('Call started')
      setIsConnected(true)
      setIsConnecting(false)
      setStatus('Connected! Start talking to your Study Buddy')
      setError('')
      addMessage('system', '📞 Call connected')
    })

    vapi.on('call-end', () => {
      console.log('Call ended')
      setIsConnected(false)
      setAssistantIsSpeaking(false)
      setVolumeLevel(0)
      setStatus('Ready to start studying!')
      addMessage('system', '📴 Call ended')
    })

    vapi.on('speech-start', () => {
      console.log('Assistant started speaking')
      setAssistantIsSpeaking(true)
      setStatus('🤖 Study Buddy is speaking...')
    })

    vapi.on('speech-end', () => {
      console.log('Assistant stopped speaking')
      setAssistantIsSpeaking(false)
      setStatus('🎤 Listening...')
    })

    vapi.on('volume-level', (volume) => {
      setVolumeLevel(volume)
    })

    vapi.on('message', (message) => {
      console.log('Received message:', message)
      
      // Handle different message types
      if (message.type === 'transcript') {
        if (message.transcriptType === 'final') {
          if (message.role === 'user') {
            addMessage('user', message.transcript)
          } else if (message.role === 'assistant') {
            addMessage('assistant', message.transcript)
          }
        }
      } else if (message.type === 'function-call') {
        addMessage('system', `🔧 Function called: ${message.functionCall.name}`)
      } else if (message.type === 'hang') {
        addMessage('system', '👋 Call ended by assistant')
      }
    })

    vapi.on('error', (error) => {
      console.error('Vapi error:', error)
      setError(error.message || 'An error occurred')
      setIsConnecting(false)
      addMessage('system', `❌ Error: ${error.message || error}`)
    })

    return () => {
      vapi.stop()
    }
  }, [vapi])

  const addMessage = (type, content) => {
    const newMessage = {
      id: Date.now(),
      type,
      content,
      time: new Date().toLocaleTimeString()
    }
    setMessages(prev => [...prev, newMessage])
  }

  const startConversation = async () => {
    try {
      setIsConnecting(true)
      setError('')
      setStatus('📞 Connecting to your Study Buddy...')
      addMessage('system', '🔄 Starting call...')

      await vapi.start({
        model: {
          provider: "openai",
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `You are a friendly and encouraging AI study buddy for students. Your personality is:
                - Warm, supportive, and motivating
                - Knowledgeable but not condescending
                - Good at explaining complex topics simply
                - Encouraging when students feel overwhelmed
                
                You can help with:
                1. Pomodoro study sessions (25 min work, 5 min break)
                2. Answering academic questions across various subjects
                3. Providing study tips and motivation
                4. Campus information (pretend you know about a typical university campus)
                5. Simple stress relief exercises
                
                Keep responses concise and conversational. If asked about starting a Pomodoro session, 
                acknowledge it and pretend to start a timer (you can't actually set a timer, but act as if you can).
                
                Always be encouraging and end with a question to keep the conversation going.`
            }
          ]
        },
        voice: {
          provider: "elevenlabs",
          voiceId: "rachel"
        },
        firstMessage: "Hey there! I'm your AI study buddy. I can help you with Pomodoro sessions, answer questions, or just chat about your studies. What would you like to do today?",
        endCallMessage: "Great study session! Remember, you've got this! Talk to you later!",
        endCallPhrases: ["goodbye", "bye", "end call", "see you later"],
        silenceTimeoutSeconds: 30,
        maxDurationSeconds: 600 // 10 minutes
      })
    } catch (error) {
      console.error('Failed to start conversation:', error)
      setError('Failed to connect. Please check your API key.')
      setIsConnecting(false)
    }
  }

  const stopConversation = async () => {
    try {
      await vapi.stop()
    } catch (error) {
      console.error('Failed to stop conversation:', error)
      setError('Failed to stop the call properly.')
    }
  }

  const toggleMute = () => {
    const newMutedState = !isMuted
    vapi.setMuted(newMutedState)
    setIsMuted(newMutedState)
    addMessage('system', newMutedState ? '🔇 Microphone muted' : '🔊 Microphone unmuted')
  }

  const sendCustomMessage = () => {
    if (!isConnected || !customSayText.trim()) return
    
    try {
      vapi.say(customSayText)
      addMessage('system', `💬 Manual say: "${customSayText}"`)
      setCustomSayText('')
    } catch (error) {
      console.error('Error with manual say:', error)
      addMessage('system', `❌ Error: ${error}`)
    }
  }

  const presetMessages = [
    "Let's start a 25-minute Pomodoro session!",
    "Can you explain this concept more simply?",
    "I'm feeling overwhelmed with my studies",
    "What are some good study tips?",
    "Tell me a motivational quote",
    "Let's take a quick break"
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 to-purple-700 p-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Control Panel */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-gray-800">
              🎓 AI Study Buddy
            </h1>
            <p className="text-gray-600">Your voice-powered study assistant</p>
          </div>

          {/* Status */}
          <div className={`p-4 rounded-xl text-center font-medium transition-all ${
            isConnected ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'
          }`}>
            {status}
          </div>

          {/* Connection Info */}
          {isConnected && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  {assistantIsSpeaking ? (
                    <Volume2 className="w-4 h-4 text-primary-600 animate-pulse" />
                  ) : (
                    <Mic className="w-4 h-4 text-primary-600" />
                  )}
                  <span className="font-medium">
                    {assistantIsSpeaking ? 'Speaking' : 'Listening'}
                  </span>
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  {isMuted ? (
                    <MicOff className="w-4 h-4 text-red-500" />
                  ) : (
                    <Mic className="w-4 h-4 text-green-500" />
                  )}
                  <span className="font-medium">
                    Mic: {isMuted ? 'Muted' : 'Active'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Volume Indicator */}
          {isConnected && (
            <div className="space-y-2">
              <label className="text-sm text-gray-600">Volume Level</label>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary-500 to-purple-600 transition-all duration-100"
                  style={{ width: `${volumeLevel * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              ❌ {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <div className="flex gap-3">
              {!isConnected ? (
                <button
                  onClick={startConversation}
                  disabled={isConnecting}
                  className="flex-1 flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-semibold rounded-full hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isConnecting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Phone className="w-5 h-5" />
                      Start Conversation
                    </>
                  )}
                </button>
              ) : (
                <>
                  <button
                    onClick={stopConversation}
                    className="flex-1 flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-full hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
                  >
                    <PhoneOff className="w-5 h-5" />
                    End Call
                  </button>
                  <button
                    onClick={toggleMute}
                    className={`px-6 py-3 rounded-full font-semibold transition-all ${
                      isMuted 
                        ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>
                </>
              )}
            </div>

            {/* Custom Say Input */}
            {isConnected && (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customSayText}
                  onChange={(e) => setCustomSayText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendCustomMessage()}
                  placeholder="Make the assistant say something..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                  onClick={sendCustomMessage}
                  disabled={!customSayText.trim()}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Preset Messages */}
          {isConnected && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Quick Commands:</p>
              <div className="flex flex-wrap gap-2">
                {presetMessages.map((message, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      vapi.say(message)
                      addMessage('system', `💬 Preset: "${message}"`)
                    }}
                    className="px-3 py-1 text-sm bg-primary-100 text-primary-700 rounded-full hover:bg-primary-200 transition-colors"
                  >
                    {message}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Conversation Display */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 flex flex-col h-[600px]">
          <div className="flex items-center gap-3 mb-6">
            <MessageSquare className="w-6 h-6 text-primary-600" />
            <h2 className="text-2xl font-bold text-gray-800">Conversation</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-3 mb-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-20">
                <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No messages yet.</p>
                <p className="text-sm">Start a call to begin the conversation.</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.type === 'user' 
                      ? 'bg-primary-600 text-white' 
                      : message.type === 'assistant'
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-yellow-50 text-yellow-800 text-sm'
                  }`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-xs">
                        {message.type === 'user' ? 'You' : message.type === 'assistant' ? 'Study Buddy' : 'System'}
                      </span>
                      <span className="text-xs opacity-70">{message.time}</span>
                    </div>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="max-w-6xl mx-auto mt-6 bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-white">
        <h3 className="font-semibold mb-3">💡 How to use:</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <li>• Click "Start Conversation" to begin talking</li>
          <li>• Speak naturally - your Study Buddy will respond</li>
          <li>• Use the mute button to temporarily disable your mic</li>
          <li>• Try the preset commands for common requests</li>
          <li>• Say "goodbye" or "end call" to finish</li>
          <li>• View your conversation history on the right</li>
        </ul>
      </div>
    </div>
  )
}

export default App 