# 🎯 Vapi Workshop Instructor Guide

This guide will help you run a successful Vapi workshop for hackathon participants using React, Vite, and Tailwind CSS.

## 📅 Pre-Workshop Preparation

### 1. Test Everything

- Create your own Vapi account and test the example
- Run the React app locally and ensure all features work
- Test microphone, mute button, and preset messages
- Verify conversation history displays correctly
- Test with different browsers (Chrome recommended)
- Verify npm/node is installed on workshop machines

### 2. Prepare Resources

- Workshop slides (optional)
- This repository cloned and ready
- Backup API keys in case students have issues
- Have the React DevTools extension installed
- Prepare demo scenarios to showcase

### 3. Set Up Demo Assistant

Create a working assistant in your Vapi account to demonstrate the final result with all features.

## 🚀 Workshop Flow

### Part 1: Introduction (15 minutes)

#### Opening Hook (3 min)

"Imagine building a professional voice AI application with full conversation history, real-time controls, and beautiful UI in just 90 minutes. Let's do it!"

#### Demo the Final Product (7 min)

Show the complete application:

- Start a conversation
- Show real-time transcription
- Demonstrate mute functionality
- Use preset messages
- Type custom messages
- Show conversation history
- End the call naturally

#### Tech Stack Overview (5 min)

- Vapi for voice AI
- React for modern UI
- Vite for fast development
- Tailwind CSS for beautiful styling
- Real-time event handling

#### Workshop Overview (2 min)

- What we'll build: AI Study Buddy with React
- What you'll learn: Voice AI, React hooks, modern web development

### Part 2: Hands-On Setup (20 minutes)

#### Step 1: Account & Environment Setup (10 min)

```bash
# Clone the repo
git clone [workshop-repo]
cd vapi-workshop

# Install dependencies
npm install

# Set up environment variables
cp env.example .env
```

#### Step 2: First Run (5 min)

```bash
npm run dev
```

- Ensure everyone's app loads
- Check for API key errors
- Test microphone permissions

#### Step 3: Code Tour (5 min)

Quick overview of `src/App.jsx`:

- State management section
- Event handlers
- UI components
- Message handling

### Part 3: Understanding Vapi Events (25 minutes)

#### Core Events (10 min)

Explain each event with live coding:

```javascript
// Connection events
vapi.on('call-start', () => {
  // Show in UI that call started
})

vapi.on('call-end', () => {
  // Reset UI state
})

// Speech events
vapi.on('speech-start', () => {
  // User or assistant speaking
})

vapi.on('volume-level', (volume) => {
  // Real-time volume updates
})
```

#### Message Handling (10 min)

Deep dive into message types:

```javascript
vapi.on('message', (message) => {
  if (message.type === 'transcript') {
    // Handle user/assistant speech
  } else if (message.type === 'function-call') {
    // Handle function calls
  }
})
```

#### Live Coding Exercise (5 min)

Have students:

1. Add a console.log to each event
2. Make a test call
3. Watch events fire in real-time

### Part 4: Building Advanced Features (20 minutes)

#### Conversation History (7 min)

Show how messages are stored and displayed:

- Message state array
- Adding messages with timestamps
- Different styling for user/assistant/system
- Auto-scrolling implementation

#### Mute Functionality (5 min)

Demonstrate mute feature:

```javascript
const toggleMute = () => {
  vapi.setMuted(!isMuted)
  // Update UI accordingly
}
```

#### Custom Say Feature (8 min)

Explain the power of `vapi.say()`:

- Making the assistant say anything
- Preset messages for quick testing
- Use cases for dynamic responses

### Part 5: UI/UX Excellence (10 minutes)

#### Tailwind Styling (5 min)

- Show the gradient backgrounds
- Explain the card layouts
- Demonstrate responsive design
- Show hover states and transitions

#### Real-time Feedback (5 min)

- Volume visualization
- Status updates
- Loading states
- Error handling

### Part 6: Deployment & Extensions (10 minutes)

#### Quick Deploy Demo (5 min)

```bash
# Build for production
npm run build

# Deploy to Vercel (if time)
npx vercel
```

#### Hackathon Ideas (5 min)

Inspire with possibilities:

1. **Voice-Controlled Game**: Simon Says or Trivia
2. **Language Learning**: Conversation practice
3. **Interview Simulator**: With feedback
4. **Voice Journal**: Transcribe and save thoughts
5. **Study Group Assistant**: Multi-user support

### Part 7: Web Integration (25 minutes)

#### Step 1: Get API Keys (3 min)

```
1. Go to Settings → API Keys
2. Copy your Public Key
3. Keep it safe (don't share in public repos!)
```

#### Step 2: Set Up the Web Interface (7 min)

```bash
# Students should:
1. Clone/download the workshop repo
2. Open index.html in a browser
3. Open app.js in their editor
4. Replace YOUR_VAPI_PUBLIC_KEY with their actual key
```

#### Step 3: Understanding the Code (10 min)

Walk through key parts:

**Initialization:**

```javascript
vapi = new Vapi(VAPI_PUBLIC_KEY);
```

**Event Handlers:**

```javascript
vapi.on('call-start', () => { /* Called when conversation starts */ });
vapi.on('speech-start', () => { /* User is speaking */ });
vapi.on('message', (message) => { /* Handle transcripts */ });
```

**Starting a Call:**

```javascript
await vapi.start({ assistant: { /* config */ } });
```

#### Step 4: Test & Debug (5 min)

Common issues:

- Microphone permissions (must allow)
- API key not set correctly
- Browser compatibility (use Chrome/Edge)

### Part 8: Advanced Features (15 minutes)

#### Custom Voices (5 min)

Show how to change voices in the dashboard:

- ElevenLabs voices
- PlayHT voices
- Voice cloning (mention but don't demo)

#### Adding Tools/Functions (5 min)

Explain concept:

```javascript
tools: [{
    name: "getStudyTip",
    description: "Get a random study tip",
    parameters: { /* ... */ }
}]
```

#### Analytics & Monitoring (5 min)

- Show call logs in dashboard
- Transcripts and recordings
- Cost tracking

## 💡 Teaching Tips

### Interactive Elements

- **Live Coding**: Make mistakes on purpose and fix them
- **Pair Programming**: Have students help each other
- **Mini Challenges**: "Add a button that makes the AI laugh"
- **Show & Tell**: Have students demo their customizations

### Common Teaching Points

#### When Someone's Mic Doesn't Work

1. Check browser permissions
2. Try incognito mode
3. Test with <https://webrtc.github.io/samples/>
4. Use headphones

#### When Explaining State Management

Use the analogy of a conversation:

- State = current moment in conversation
- Events = things that happen
- UI = visual representation

#### When Showing Real-time Features

- Emphasize the speed (sub-600ms)
- Show how natural interruptions work
- Demonstrate the volume indicator

## 🆘 Troubleshooting Guide

### Quick Fixes Table

| Issue | Solution | Teaching Moment |
|-------|----------|-----------------|
| No API key error | Check .env file | Environment variables security |
| Mic not working | Browser permissions | Web API permissions |
| Messages not showing | Check console errors | Debugging skills |
| Slow responses | Normal for first call | Cold start explanation |
| Can't hear assistant | Check system volume | Audio troubleshooting |

### Advanced Issues

#### "WebSocket connection failed"

- Check internet connection
- Firewall/VPN issues
- Try different network

#### "Transcript not updating"

- Check if `transcriptType === 'final'`
- Explain partial vs final transcripts

## 📊 Code Snippets for Workshop

### Add Emotion Detection

```javascript
// Quick enhancement
if (message.transcript.includes('stressed')) {
  addMessage('system', '💚 Sending virtual hug!')
}
```

### Add Call Timer

```javascript
const [callDuration, setCallDuration] = useState(0)
// Update every second during call
```

### Save Conversation

```javascript
const downloadConversation = () => {
  const text = messages.map(m => `${m.type}: ${m.content}`).join('\n')
  // Download as text file
}
```

## 🎁 Bonus Content (If Time Permits)

### WebSocket Deep Dive

Explain how Vapi uses WebSockets for real-time communication

### Voice Cloning Demo

Show ElevenLabs voice cloning (if you have it set up)

### Multi-Language Support

Quick demo of changing language settings

## 📝 Post-Workshop Checklist

- [ ] Share GitHub repository
- [ ] Provide Discord/Slack channel
- [ ] Share recording (if made)
- [ ] Collect feedback form
- [ ] Share additional resources
- [ ] Announce office hours

## 🎯 Success Metrics

Workshop is successful if students can:

1. ✅ Make a basic voice call
2. ✅ See conversation history
3. ✅ Use mute functionality
4. ✅ Customize the assistant's personality
5. ✅ Deploy or plan their hackathon project

---

**Remember**: Focus on building confidence. Every student should leave feeling capable of creating voice AI applications. Keep it fun, interactive, and practical!
