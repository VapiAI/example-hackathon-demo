# 🚀 Quick Start Guide - Get Your AI Study Buddy Running in 5 Minutes

## Step 1: Get Your Vapi Account (2 min)

1. Open [https://vapi.ai](https://vapi.ai)
2. Click "Sign Up"
3. Verify your email
4. You now have $10 free credit! 💰

## Step 2: Get Your API Key (1 min)

1. In Vapi Dashboard, click your profile (top right)
2. Go to "Settings" → "API Keys"
3. Copy your **Public Key** (starts with `pk_`)
4. Keep this tab open!

## Step 3: Set Up the Project (2 min)

### Clone and Install

```bash
# Clone this repo (or download ZIP)
git clone [workshop-repo-url]
cd vapi-workshop

# Install dependencies
npm install
```

### Set Up Environment Variables

1. Copy the example env file:

   ```bash
   cp env.example .env
   ```

2. Open `.env` in your text editor
3. Replace `your_vapi_public_key_here` with your actual Vapi public key:

   ```
   VITE_VAPI_PUBLIC_KEY=pk_your_actual_key_here
   ```

4. Save the file!

## Step 4: Start the Development Server

```bash
npm run dev
```

The app will automatically open at <http://localhost:3000>

## Step 5: Test It! 🎉

### First Call

1. Click "Start Conversation"
2. Allow microphone access when prompted
3. Say "Hello!" to your Study Buddy
4. Watch your conversation appear in real-time on the right!

### Try These Features

#### 🎤 Voice Commands

- "Help me study for my math exam"
- "Start a Pomodoro session"
- "I'm feeling stressed about finals"
- "Give me a study tip"
- "Goodbye" (ends the call)

#### 🔇 Mute Button

- Click the Mute button to temporarily disable your mic
- Great for noisy environments
- The AI will wait for you to unmute

#### 💬 Preset Messages

- Click any preset button to make the AI say that phrase
- Use these for quick testing
- Great for demonstrating specific scenarios

#### ✍️ Custom Messages

- Type anything in the input field
- Press Enter or click Send
- The AI will say exactly what you typed!

#### 📊 Live Indicators

- **Volume Bar**: Shows your speaking volume
- **Status**: Shows if AI is listening or speaking
- **Mic Status**: Shows if microphone is active or muted

## ⚡ Pro Tips

### Testing Voice Quality

1. Try different distances from your microphone
2. Speak at a normal conversation pace
3. The AI handles interruptions naturally - try it!

### Exploring Features

1. **Conversation History**: All messages are saved on the right
2. **System Messages**: Yellow messages show system events
3. **Timestamps**: Each message shows when it was sent
4. **Auto-scroll**: Chat scrolls automatically with new messages

### Best Practices

- Use headphones to prevent echo
- Speak clearly but naturally
- Try interrupting the AI mid-sentence
- Test edge cases like silence and long responses

## ⚡ Troubleshooting

### "Please add your Vapi API key to .env file"

- Make sure you created the `.env` file (not just edited `env.example`)
- Check that your key starts with `pk_`
- Restart the dev server after adding the key

### "No audio / Can't hear anything"

- Check your browser allows microphone access
- Make sure your volume is up
- Try the Mute/Unmute button
- Use Chrome or Edge browser for best results

### "Failed to connect"

- Verify your API key is correct
- Check your internet connection
- Make sure you have credits in your Vapi account
- Check browser console (F12) for detailed errors

### "Messages not appearing"

- Refresh the page
- Check if JavaScript is enabled
- Look for errors in browser console

## 🎨 Customization Options

### Change the Voice

In `src/App.jsx`, find the voice configuration:

```javascript
voice: {
  provider: "elevenlabs",
  voiceId: "rachel"  // Try "josh", "adam", "bella", or others!
}
```

### Modify the Personality

Update the system prompt in `src/App.jsx` to change how your Study Buddy behaves:

- Make it more formal/casual
- Add specific subject expertise
- Change the language style

### Adjust Timing

```javascript
silenceTimeoutSeconds: 30,      // How long before timeout
maxDurationSeconds: 600         // Max call length (10 min)
```

### Style Changes

- Colors in `tailwind.config.js`
- Layout in the component JSX
- Animations with Tailwind classes

## 📁 What You're Looking At

When the app runs, you'll see:

- **Left Panel**: All controls and settings
- **Right Panel**: Live conversation history
- **Bottom Bar**: Instructions and tips

## 🚀 Next Steps

1. **Experiment**: Try all the buttons and features
2. **Customize**: Change the voice and personality
3. **Extend**: Add new features for your hackathon
4. **Deploy**: Use `npm run build` when ready
5. **Share**: Show off your creation!

## 🎯 Challenge Yourself

- Can you make the AI speak in a different accent?
- Add a button that makes the AI tell a joke
- Create a study timer that announces breaks
- Add a feature to save conversation history

---

**Need help?** Check the browser console (F12) for detailed logs, or ask in the workshop!

**Happy Hacking! 🚀**
