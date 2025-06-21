# 🧪 Test Your Setup

Follow these steps to ensure everything is working correctly:

## 1. Check Node.js Installation

```bash
node --version
# Should show v16.0.0 or higher
```

## 2. Check npm Installation

```bash
npm --version
# Should show 7.0.0 or higher
```

## 3. Install Dependencies

```bash
npm install
# Should complete without errors
```

## 4. Set Up Your API Key

```bash
# Copy the example environment file
cp env.example .env

# Edit .env and add your Vapi key
# VITE_VAPI_PUBLIC_KEY=pk_your_actual_key_here
```

## 5. Start the Development Server

```bash
npm run dev
# Should open browser at http://localhost:3000
```

## 6. Test the Application

1. **Visual Check**:
   - Beautiful gradient background ✓
   - White card with Study Buddy title ✓
   - Start Conversation button ✓
   - Feature list visible ✓

2. **Console Check**:
   - Open browser DevTools (F12)
   - Check Console tab for errors
   - Should see "Vapi initialized" or similar

3. **API Key Check**:
   - If you see "Please add your Vapi API key"
   - Make sure .env file exists
   - Make sure key starts with `pk_`
   - Restart dev server after adding key

4. **Microphone Check**:
   - Click "Start Conversation"
   - Browser should ask for microphone permission
   - Allow microphone access

## ✅ Success Indicators

- No red error messages in the UI
- Button changes to "Connecting..." when clicked
- Browser asks for microphone permission
- Status changes to "Connected!" after allowing mic

## ❌ Common Issues

| Problem | Solution |
|---------|----------|
| "Command not found: npm" | Install Node.js from nodejs.org |
| "Cannot find module" | Run `npm install` again |
| "Port 3000 in use" | Kill the process or use different port |
| Blank white screen | Check browser console for errors |
| Tailwind styles not working | Restart dev server |

## 🎉 Ready for Workshop

If all tests pass, you're ready to build your AI Study Buddy!
