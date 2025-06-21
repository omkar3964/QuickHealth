
import React, { useContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';
import SendIcon from '@mui/icons-material/Send';
import AddIcon from '@mui/icons-material/Add';
import { AppContext } from '../context/AppContext';
import * as pdfjsLib from 'pdfjs-dist';
import Tesseract from 'tesseract.js';

const ChatPanel = ({ onClose }) => {
  const { openAPIKey } = useContext(AppContext);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    { text: "👋 Hello! How can we help you today?", sender: "bot" },
  ]);

  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const extractTextFromFile = async (file) => {
    if (!file) return '';
    const fileType = file.type;

    if (fileType === 'application/pdf') {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';
      for (let i = 0; i < pdf.numPages; i++) {
        const page = await pdf.getPage(i + 1);
        const content = await page.getTextContent();
        const text = content.items.map(item => item.str).join(' ');
        fullText += text + '\n';
      }
      return fullText;
    }

    if (fileType.startsWith('image/')) {
      const result = await Tesseract.recognize(file, 'eng');
      return result.data.text;
    }

    return '';
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    if (!openAPIKey) {
      return;
    }

    const userMessage = { text: input, sender: "user" };
    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "mistralai/mistral-7b-instruct",
          messages: [
            { role: "system", content: "You are a knowledgeable medical assistant. Provide helpful, respectful, and accurate medical information, but never give a diagnosis or treatment recommendation. Always advise the user to consult a licensed doctor." },
            ...newMessages.map((msg) => ({
              role: msg.sender === "user" ? "user" : "assistant",
              content: msg.text,
            })),
          ],
        },
        {
          headers: {
            "Authorization": `Bearer ${openAPIKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      const reply = response.data.choices[0].message.content;
      setMessages((prev) => [...prev, { text: reply, sender: "bot" }]);
    } catch (err) {
      console.error("Error with OpenAI API:", err.response?.data || err.message || err);
      setMessages((prev) => [...prev, { text: "⚠️ Error contacting OpenAI", sender: "bot" }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  const handleFileUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setMessages((prev) => [...prev, { text: `📎 Uploaded: ${file.name}`, sender: "user" }]);
    setLoading(true);

    try {
      const extractedText = await extractTextFromFile(file);
      if (!extractedText.trim()) {
        setMessages((prev) => [...prev, { text: "⚠️ Could not extract readable text from the file.", sender: "bot" }]);
        return;
      }

      const userMessage = { text: extractedText, sender: "user" };
      const newMessages = [...messages, userMessage];
      setMessages(newMessages);

      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "mistralai/mistral-7b-instruct",
          messages: [
            { role: "system", content: "You are a knowledgeable medical assistant. Provide helpful, respectful, and accurate medical information, but never give a diagnosis or treatment recommendation. Always advise the user to consult a licensed doctor." },
            ...newMessages.map((msg) => ({
              role: msg.sender === "user" ? "user" : "assistant",
              content: msg.text,
            })),
          ],
        },
        {
          headers: {
            "Authorization": `Bearer ${openAPIKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      const reply = response.data.choices[0].message.content;
      setMessages((prev) => [...prev, { text: reply, sender: "bot" }]);
    } catch (err) {
      console.error("Error processing file or API:", err);
      setMessages((prev) => [...prev, { text: "⚠️ Failed to process file or fetch reply.", sender: "bot" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed top-[2px] bottom-[2px] right-0 w-full sm:w-[30%] h-[calc(100vh-4px)] bg-white shadow-lg z-[100] flex flex-col border rounded-md sm:rounded-l-lg transition-transform animate-slide-in">

      {/* Header */}
      <div className="p-4 border-b rounded-md flex justify-between items-center bg-primary text-white">
        <h2 className="text-lg font-semibold">Support Chat</h2>
        <button onClick={onClose} className="text-xl font-bold">×</button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-[80%] p-2 rounded-lg text-sm ${msg.sender === "user"
              ? "bg-blue-100 self-end text-right ml-auto"
              : "bg-gray-100 self-start text-left mr-auto"
              }`}
          >
            {msg.text}
          </div>
        ))}
        {loading && <p className="text-gray-500 text-sm">Thinking...</p>}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-2 border-t flex gap-2 items-center">
        {/* Hidden File Input */}
        <input
          type="file"
          accept="image/*,.pdf"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />

        {/* + Button */}
        <button
          onClick={handleFileUploadClick}
          className="bg-gray-200 hover:bg-gray-300 p-2 rounded"
        >
          <AddIcon />
        </button>

        {/* Text Input */}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type your message..."
          className="flex-1 border rounded px-3 py-2 outline-none"
        />

        {/* Send Button */}
        <button
          type="button"
          onClick={sendMessage}
          className="bg-primary text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={loading}
        >
          <SendIcon />
        </button>
      </div>
    </div>
  );
};

export default ChatPanel;
