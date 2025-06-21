# 🎓 Vapi Workshop: Build Your AI Study Buddy

Welcome to the Vapi Voice AI Workshop! In this hands-on session, you'll build a modern AI-powered study assistant using React, Vite, and Tailwind CSS that students can talk to via phone or web.

## 🚀 What We're Building

An AI Study Buddy with professional voice AI features:

- 🎙️ Real-time voice conversations with AI
- 💬 Full conversation history display
- 🔇 Mute/unmute functionality
- 📊 Live volume level indicators
- 💡 Preset message shortcuts
- 🎯 Custom message injection
- ⏰ Pomodoro study sessions
- 📚 Academic Q&A capabilities

## 🛠️ Tech Stack

- **React** - Modern UI framework
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Vapi SDK** - Voice AI integration
- **Environment Variables** - Secure API key management

## 📋 Prerequisites

- Basic JavaScript/React knowledge
- Node.js installed (v16+)
- A Vapi account (we'll create one together)
- A phone for testing (optional)
- Chrome or Edge browser (recommended)

## 🚀 Quick Setup

```bash
# Clone the repository
git clone [your-repo-url]
cd vapi-workshop

# Install dependencies
npm install

# Copy environment variables
cp env.example .env

# Add your Vapi API key to .env
# VITE_VAPI_PUBLIC_KEY=your_key_here

# Start development server
npm run dev
```

## ✨ Key Features

### Voice AI Capabilities

- **Natural Conversations**: Sub-600ms response times
- **Smart Interruption Handling**: Natural turn-taking
- **Auto-end Phrases**: Say "goodbye" to end the call
- **Silence Detection**: 30-second timeout
- **Max Duration**: 10-minute sessions

### UI Features

- **Split View Layout**: Controls on left, conversation on right
- **Real-time Status**: See when AI is listening/speaking
- **Volume Visualization**: Live audio level display
- **Message History**: Full conversation transcript
- **Preset Commands**: Quick access to common requests
- **Custom Messages**: Make the AI say anything
- **Responsive Design**: Works on all screen sizes

## 📝 Workshop Agenda (90 minutes)

### Part 1: Introduction to Voice AI (15 min)

- What is Vapi?
- Voice AI use cases
- Demo of the complete application

### Part 2: Building Your First Voice Assistant (30 min)

- Understanding Vapi events
- Setting up voice configuration
- Testing with the web interface

### Part 3: React Integration (25 min)

- State management for voice AI
- Event handling patterns
- Real-time UI updates

### Part 4: Advanced Features (10 min)

- Message history implementation
- Mute functionality
- Custom say commands

### Part 5: Deployment & Extensions (10 min)

- Building for production
- Deployment options
- Hackathon project ideas

## 💡 Extension Ideas for Your Hackathon

1. **Multi-language Support**: Add language selection
2. **Voice Commands**: Add custom voice-triggered actions
3. **Study Analytics**: Track study session data
4. **Collaborative Study**: Multi-user study rooms
5. **AI Tutoring**: Subject-specific AI tutors
6. **Voice Notes**: Transcribe and save study notes

## 📁 Project Structure

```
vapi-workshop/
├── src/
│   ├── App.jsx          # Main React component with all features
│   ├── main.jsx         # React entry point
│   └── index.css        # Tailwind CSS imports
├── .env                 # Your API keys (create this!)
├── .gitignore           # Git ignore file
├── index.html           # Root HTML file
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind configuration
├── postcss.config.js    # PostCSS configuration
└── package.json         # Project dependencies
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎯 Using the Application

1. **Start a Conversation**: Click the start button to connect
2. **Allow Microphone**: Grant permission when prompted
3. **Speak Naturally**: The AI will respond in real-time
4. **Try Presets**: Use quick command buttons
5. **Mute When Needed**: Toggle microphone on/off
6. **Custom Messages**: Type and send custom AI responses
7. **End Call**: Say "goodbye" or click end button

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Please add your Vapi API key" | Create `.env` file with your key |
| No audio/microphone | Check browser permissions |
| Connection failed | Verify API key and internet |
| Messages not showing | Check browser console for errors |

## 📚 Resources

- [Vapi Documentation](https://docs.vapi.ai)
- [Vapi Discord Community](https://discord.gg/vapi)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Official Vapi Examples](https://github.com/VapiAI/example-web-sdk-app)

## 🆘 Need Help?

- During workshop: Raise your hand!
- After workshop: Join our Discord channel #vapi-workshop
- Email: <workshop@yourdomain.com>

---

**Happy Building! 🚀 Let's create something amazing together!**
