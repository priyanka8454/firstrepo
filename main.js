import { GoogleGenerativeAI } from 'https://esm.run/@google/generative-ai'; // in go to definition we get entire code of the library

const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const resetButton = document.getElementById('reset-button');

const API_KEY="AIzaSyBiyUAOAx7yjntnDulDyiikh0l3sOMZcfo"; // get your api key from https://aistudio.google.com/apikey
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

let chatSession;
async function initChat() {
    chatSession = model.startChat({
        generationConfig: {
            temperature: 1,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 8192,
        },
        history: [],
    });
    // Add initial greeting message
    addMessage("Hey, priyanka here how may I help you?", false);
}
function addMessage(message, isUser) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.classList.add(isUser ? 'user-message' : 'ai-message');
    
        if (isUser) {
            messageElement.textContent = message; 
        } else {
            messageElement.innerHTML = marked.parse(message); 
        }
    
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
}
function addLoadingMessage() {
        const loadingElement = document.createElement('div');
        loadingElement.classList.add('loading');
        loadingElement.textContent = 'AI is thinking...';
        chatMessages.appendChild(loadingElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return loadingElement;
}
async function getAIResponse(userMessage) {
    try {
        if (!chatSession) {
            await initChat();
        }
        const result = await chatSession.sendMessage(userMessage);
        return result.response.text();
    } catch (error) {
        console.error('Error getting AI response:', error);
        return 'Sorry, I encountered an error. Please try again.';
    }
}
async function sendMessage() {
    const message = userInput.value.trim();
    if (message) {
        addMessage(message, true);
        userInput.value = '';
        const loadingMessage = addLoadingMessage();
        const aiResponse = await getAIResponse(message);
        loadingMessage.remove();
        addMessage(aiResponse, false);
    }
}
function resetChat() {
    chatMessages.innerHTML = '';
    initChat();
}
sendButton.addEventListener('click', sendMessage);
resetButton.addEventListener('click', resetChat);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});
initChat();