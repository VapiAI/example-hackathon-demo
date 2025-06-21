import { useState, useEffect, useRef } from 'react'
import { vapi } from './vapi'
import { studyBuddyAssistant } from './assistants/studyBuddy.assistant'
import { Mic, MicOff, Phone, PhoneOff, MessageSquare, Volume2, Clock, Send, Loader2 } from 'lucide-react'

// Get API key from environment variable for validation
const VAPI_PUBLIC_KEY = import.meta.env.VITE_VAPI_PUBLIC_KEY

// Call status enum-like object
const CALL_STATUS = {
  INACTIVE: 'inactive',
  ACTIVE: 'active',
  LOADING: 'loading'
}

function App() {
  // Call state
  const [callStatus, setCallStatus] = useState(CALL_STATUS.INACTIVE)
  const [assistantIsSpeaking, setAssistantIsSpeaking] = useState(false)
  
  // UI state
  const [error, setError] = useState('')
  const [volumeLevel, setVolumeLevel] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  
  // Message state
  const [messages, setMessages] = useState([])
  const [activeTranscript, setActiveTranscript] = useState(null)
  const messagesEndRef = useRef(null)
  
  // Custom say functionality
  const [customSayText, setCustomSayText] = useState('')

  // Computed states
  const isLoading = callStatus === CALL_STATUS.LOADING
  const isActive = callStatus === CALL_STATUS.ACTIVE

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, activeTranscript])

  useEffect(() => {
    if (!VAPI_PUBLIC_KEY || VAPI_PUBLIC_KEY === 'your_vapi_public_key_here') {
      setError('Please add your Vapi API key to .env file')
      return
    }

    // Set up Vapi event listeners
    const onCallStart = () => {
      console.log('Call started')
      setCallStatus(CALL_STATUS.ACTIVE)
      setError('')
      addMessage('system', '📞 Call connected')
    }

    const onCallEnd = () => {
      console.log('Call ended')
      setCallStatus(CALL_STATUS.INACTIVE)
      setAssistantIsSpeaking(false)
      setVolumeLevel(0)
      setActiveTranscript(null)
      addMessage('system', '📴 Call ended')
    }

    const onSpeechStart = () => {
      console.log('Speech started')
      setAssistantIsSpeaking(true)
    }

    const onSpeechEnd = () => {
      console.log('Speech ended')
      setAssistantIsSpeaking(false)
    }

    const onVolumeLevel = (volume) => {
      setVolumeLevel(volume)
    }

    const onMessage = (message) => {
      console.log('Received message:', message)
      
      if (message.type === 'transcript') {
        if (message.transcriptType === 'partial') {
          // Handle partial transcripts separately for real-time feedback
          setActiveTranscript({
            role: message.role,
            text: message.transcript,
            timestamp: Date.now()
          })
        } else if (message.transcriptType === 'final') {
          // Add final transcript to messages
          setActiveTranscript(null)
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
    }

    const onError = (error) => {
      console.error('Vapi error:', error)
      setError(error.message || 'An error occurred')
      setCallStatus(CALL_STATUS.INACTIVE)
      addMessage('system', `❌ Error: ${error.message || error}`)
    }

    // Register event listeners
    vapi.on('call-start', onCallStart)
    vapi.on('call-end', onCallEnd)
    vapi.on('speech-start', onSpeechStart)
    vapi.on('speech-end', onSpeechEnd)
    vapi.on('volume-level', onVolumeLevel)
    vapi.on('message', onMessage)
    vapi.on('error', onError)

    // Cleanup
    return () => {
      vapi.off('call-start', onCallStart)
      vapi.off('call-end', onCallEnd)
      vapi.off('speech-start', onSpeechStart)
      vapi.off('speech-end', onSpeechEnd)
      vapi.off('volume-level', onVolumeLevel)
      vapi.off('message', onMessage)
      vapi.off('error', onError)
    }
  }, [])

  const addMessage = (type, content) => {
    const newMessage = {
      id: Date.now(),
      type,
      content,
      time: new Date().toLocaleTimeString()
    }
    setMessages(prev => [...prev, newMessage])
  }

  const start = async () => {
    setCallStatus(CALL_STATUS.LOADING)
    setError('')
    addMessage('system', '🔄 Starting call...')

    try {
      const response = await vapi.start(studyBuddyAssistant)
      console.log('Call response:', response)
    } catch (error) {
      console.error('Failed to start call:', error)
      setError('Failed to connect. Please check your API key and internet connection.')
      setCallStatus(CALL_STATUS.INACTIVE)
    }
  }

  const stop = () => {
    setCallStatus(CALL_STATUS.LOADING)
    vapi.stop()
  }

  const toggleCall = () => {
    if (callStatus === CALL_STATUS.ACTIVE) {
      stop()
    } else if (callStatus !== CALL_STATUS.LOADING) {
      start()
    }
  }

  const toggleMute = () => {
    const newMutedState = !isMuted
    vapi.setMuted(newMutedState)
    setIsMuted(newMutedState)
    addMessage('system', newMutedState ? '🔇 Microphone muted' : '🔊 Microphone unmuted')
  }

  const sendCustomMessage = () => {
    if (!isActive || !customSayText.trim()) return
    
    try {
      vapi.say(customSayText)
      addMessage('system', `💬 Manual say: "${customSayText}"`)
      setCustomSayText('')
    } catch (error) {
      console.error('Error with manual say:', error)
      addMessage('system', `❌ Error: ${error}`)
    }
  }

  const sendAddMessage = (content) => {
    // Send a system message to the assistant
    vapi.send({
      type: "add-message",
      message: {
        role: "system",
        content: content
      }
    })
    addMessage('system', `📝 Context added: "${content}"`)
  }

  const presetMessages = [
    "Let's start a 25-minute Pomodoro session!",
    "Can you explain this concept more simply?",
    "I'm feeling overwhelmed with my studies",
    "What are some good study tips?",
    "Tell me a motivational quote",
    "Let's take a quick break"
  ]

  // Dynamic button style with audio level shadow
  const buttonShadowStyle = isActive ? {
    boxShadow: `0 0 ${20 + volumeLevel * 50}px ${10 + volumeLevel * 20}px rgba(239, 68, 68, ${0.4 + volumeLevel * 0.6})`
  } : {}

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

          {/* Main Call Button */}
          <div className="flex justify-center py-8">
            <button
              onClick={toggleCall}
              disabled={isLoading}
              className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all transform hover:scale-105 ${
                isActive 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : isLoading 
                  ? 'bg-yellow-500' 
                  : 'bg-green-500 hover:bg-green-600'
              } text-white disabled:cursor-not-allowed`}
              style={buttonShadowStyle}
            >
              {isLoading ? (
                <Loader2 className="w-8 h-8 animate-spin" />
              ) : isActive ? (
                <PhoneOff className="w-8 h-8" />
              ) : (
                <Phone className="w-8 h-8" />
              )}
            </button>
          </div>

          {/* Status Display */}
          <div className={`p-4 rounded-xl text-center font-medium transition-all ${
            isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'
          }`}>
            {isLoading ? '🔄 Connecting...' : 
             isActive ? (assistantIsSpeaking ? '🤖 Study Buddy is speaking...' : '🎤 Listening...') : 
             'Ready to start studying!'}
          </div>

          {/* Connection Info */}
          {isActive && (
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
                <button
                  onClick={toggleMute}
                  className="w-full flex items-center gap-2 hover:bg-gray-100 rounded p-1 -m-1 transition-colors"
                >
                  {isMuted ? (
                    <MicOff className="w-4 h-4 text-red-500" />
                  ) : (
                    <Mic className="w-4 h-4 text-green-500" />
                  )}
                  <span className="font-medium">
                    Mic: {isMuted ? 'Muted' : 'Active'}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Volume Indicator */}
          {isActive && (
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

          {/* Custom Say Input */}
          {isActive && (
            <div className="space-y-4">
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

              {/* Preset Messages */}
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

              {/* System Message Button */}
              <button
                onClick={() => sendAddMessage("The user wants to focus on a different topic now.")}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                📝 Send Context Update
              </button>
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
            {messages.length === 0 && !activeTranscript ? (
              <div className="text-center text-gray-500 mt-20">
                <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No messages yet.</p>
                <p className="text-sm">Start a call to begin the conversation.</p>
              </div>
            ) : (
              <>
                {messages.map((message) => (
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
                ))}
                
                {/* Active Transcript (Partial) */}
                {activeTranscript && (
                  <div className={`flex ${activeTranscript.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-2 opacity-60 ${
                      activeTranscript.role === 'user' 
                        ? 'bg-primary-600 text-white' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-xs">
                          {activeTranscript.role === 'user' ? 'You' : 'Study Buddy'}
                        </span>
                        <span className="text-xs">...</span>
                      </div>
                      <p className="whitespace-pre-wrap italic">{activeTranscript.text}</p>
                    </div>
                  </div>
                )}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Instructions */}
      {!isActive && (
        <div className="max-w-6xl mx-auto mt-6 bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-white">
          <h3 className="font-semibold mb-3">💡 How to use:</h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <li>• Click the big button to start/stop conversation</li>
            <li>• Speak naturally - your Study Buddy will respond</li>
            <li>• Click the mic status to mute/unmute</li>
            <li>• Try the preset commands for common requests</li>
            <li>• Say "goodbye" or "end call" to finish</li>
            <li>• Watch partial transcripts update in real-time</li>
          </ul>
        </div>
      )}
    </div>
  )
}

export default App 