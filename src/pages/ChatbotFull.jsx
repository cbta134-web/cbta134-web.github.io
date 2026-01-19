import React, { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import ChatbotPrompt from "../components/ChatbotPrompt";
import {
  loadChatState,
  saveChatState,
  createConversation,
  getActiveConversation,
  upsertConversation,
  setActiveConversation
} from "../utils/chatLocalDb";
import "../styles/ChatbotFull.css";

const ChatbotFull = () => {
  const [chatState, setChatState] = useState({ conversations: [], activeId: null });
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatbotConfig, setChatbotConfig] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const initChat = async () => {
      const state = await loadChatState();
      if (!state.conversations.length) {
        const conversation = createConversation("Camaleón IA");
        conversation.messages.push({
          id: `msg-${Date.now()}`,
          text: "¡Hola! Soy **Camaleón IA**, tu asistente virtual del CBTA 134. ¿En qué puedo ayudarte hoy?",
          sender: "bot",
          createdAt: new Date().toISOString()
        });
        const nextState = { conversations: [conversation], activeId: conversation.id };
        setChatState(nextState);
        await saveChatState(nextState);
      } else {
        setChatState(state);
      }
    };

    initChat();
  }, []);

  useEffect(() => {
    if (chatState.conversations.length) {
      saveChatState(chatState);
    }
  }, [chatState]);

  useEffect(() => {
    const fetchChatbotConfig = async () => {
      const { data, error } = await supabase
        .from("chatbot_config")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error) {
        setChatbotConfig(data || null);
      }
    };

    fetchChatbotConfig();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatState, isLoading]);

  const activeConversation = useMemo(() => getActiveConversation(chatState), [chatState]);

  const formatText = (text) => {
    if (!text) return "";
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/\n/g, "<br />");
  };

  const stripHtml = (htmlText) => htmlText.replace(/<[^>]*>/g, "");

  const getBaseUrl = (provider, customBaseUrl) => {
    if (customBaseUrl) return customBaseUrl.replace(/\/$/, "");
    if (provider === "groq") return "https://api.groq.com/openai/v1";
    if (provider === "gemini") return "https://generativelanguage.googleapis.com/v1beta";
    return "https://api.groq.com/openai/v1";
  };

  const getApiKey = (provider) => {
    if (provider === "groq") return chatbotConfig?.groq_api_key || chatbotConfig?.api_key || "";
    if (provider === "gemini") return chatbotConfig?.gemini_api_key || chatbotConfig?.api_key || "";
    return chatbotConfig?.api_key || "";
  };

  const getChatbotContext = async () => {
    if (!chatbotConfig?.enable_db_context) return "";
    const { data, error } = await supabase.rpc("get_chatbot_context");
    if (error) return "";
    return JSON.stringify(data || {}, null, 2);
  };

  const callProvider = async ({ providerToUse, fullSystemPrompt, historyMessages }) => {
    const apiKey = getApiKey(providerToUse);
    if (!apiKey) throw new Error(`No hay API key configurada para ${providerToUse}.`);

    const baseUrl = getBaseUrl(providerToUse, chatbotConfig?.base_url || "");
    const model = chatbotConfig?.model || (providerToUse === "gemini" ? "gemini-3.0-flash" : "llama-3.1-8b-instant");
    const apiUrl =
      providerToUse === "gemini"
        ? `${baseUrl}/models/${model}:generateContent?key=${apiKey}`
        : `${baseUrl}/chat/completions`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(providerToUse === "gemini" ? {} : { Authorization: `Bearer ${apiKey}` })
      },
      body: JSON.stringify(
        providerToUse === "gemini"
          ? {
              contents: [
                {
                  parts: [
                    {
                      text: `${fullSystemPrompt}\n\nHistorial de la conversación:\n${historyMessages
                        .map((msg) => `${msg.role === "user" ? "Usuario" : "Chatbot"}: ${msg.content}`)
                        .join("\n")}\n\nUsuario: ${input}`
                    }
                  ]
                }
              ]
            }
          : {
              model,
              messages: [
                { role: "system", content: fullSystemPrompt },
                ...historyMessages,
                { role: "user", content: input }
              ],
              temperature: 0.3
            }
      )
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error de la API (${providerToUse}): ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    if (providerToUse === "gemini" && data.candidates?.[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    }

    if (data.choices?.[0]?.message?.content) {
      return data.choices[0].message.content;
    }

    if (data.error) {
      throw new Error(data.error.message);
    }

    throw new Error("Respuesta no válida del proveedor.");
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !activeConversation) return;
    if (chatbotConfig && chatbotConfig.enabled === false) return;

    const userMessage = {
      id: `msg-${Date.now()}`,
      text: input,
      sender: "user",
      createdAt: new Date().toISOString()
    };

    // Guardar pregunta en BD (solo texto)
    try {
      await supabase.from("chatbot_questions").insert([
        {
          question_text: input,
          source_page: window.location.pathname,
          conversation_id: activeConversation.id,
          user_agent: navigator.userAgent
        }
      ]);
    } catch {
      // silencioso
    }

    setChatState((prev) => {
      const active = getActiveConversation(prev);
      if (!active) return prev;
      const updated = { ...active, messages: [...active.messages, userMessage] };
      return upsertConversation(prev, updated);
    });

    setInput("");
    setIsLoading(true);

    try {
      const contextText = await getChatbotContext();
      const systemPrompt = (chatbotConfig?.system_prompt || ChatbotPrompt).trim();
      const fullSystemPrompt = contextText
        ? `${systemPrompt}\n\nContexto de la base de datos (JSON):\n${contextText}`
        : systemPrompt;

      const historyMessages = activeConversation.messages.slice(-10).map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: stripHtml(msg.text)
      }));

      const configuredProvider = (chatbotConfig?.provider || "groq").toLowerCase();
      const primaryProvider = (chatbotConfig?.primary_provider || configuredProvider || "groq").toLowerCase();
      const fallbackEnabled = chatbotConfig?.fallback_enabled === true;
      const secondaryProvider = primaryProvider === "groq" ? "gemini" : "groq";

      let botResponse = null;
      try {
        botResponse = await callProvider({
          providerToUse: fallbackEnabled ? primaryProvider : configuredProvider,
          fullSystemPrompt,
          historyMessages
        });
      } catch (primaryError) {
        if (fallbackEnabled) {
          botResponse = await callProvider({
            providerToUse: secondaryProvider,
            fullSystemPrompt,
            historyMessages
          });
        } else {
          throw primaryError;
        }
      }

      const botMessage = {
        id: `msg-${Date.now()}`,
        text: botResponse,
        sender: "bot",
        createdAt: new Date().toISOString()
      };

      setChatState((prev) => {
        const active = getActiveConversation(prev);
        if (!active) return prev;
        const updated = { ...active, messages: [...active.messages, botMessage] };
        return upsertConversation(prev, updated);
      });
    } catch (error) {
      const botMessage = {
        id: `msg-${Date.now()}`,
        text: `Error: ${error.message}`,
        sender: "bot",
        createdAt: new Date().toISOString()
      };

      setChatState((prev) => {
        const active = getActiveConversation(prev);
        if (!active) return prev;
        const updated = { ...active, messages: [...active.messages, botMessage] };
        return upsertConversation(prev, updated);
      });
    }

    setIsLoading(false);
  };

  const handleNewChat = () => {
    const conversation = createConversation("Nueva conversación");
    const nextState = {
      conversations: [conversation, ...chatState.conversations],
      activeId: conversation.id
    };
    setChatState(nextState);
  };

  const handleSelectChat = (id) => {
    setChatState((prev) => setActiveConversation(prev, id));
  };

  return (
    <div className="chatbot-full">
      <aside className="chatbot-sidebar">
        <div className="sidebar-header">
          <h2>Camaleón IA</h2>
          <button onClick={handleNewChat}>Nueva</button>
        </div>
        <div className="chat-list">
          {chatState.conversations.map((conv) => (
            <button
              key={conv.id}
              className={`chat-list-item ${conv.id === chatState.activeId ? "active" : ""}`}
              onClick={() => handleSelectChat(conv.id)}
            >
              <span>{conv.title}</span>
              <small>{conv.messages.length} mensajes</small>
            </button>
          ))}
        </div>
      </aside>

      <main className="chatbot-main">
        <header className="chatbot-main-header">
          <div>
            <h3>{activeConversation?.title || "Camaleón IA"}</h3>
            <p>Asistente institucional CBTa 134</p>
          </div>
          <button onClick={() => window.close()} className="close-full">Cerrar</button>
        </header>

        <section className="chatbot-main-messages">
          {activeConversation?.messages.map((msg) => (
            <div key={msg.id} className={`full-message ${msg.sender}`}>
              <div dangerouslySetInnerHTML={{ __html: formatText(msg.text) }} />
            </div>
          ))}
          {isLoading && <div className="full-message bot">Escribiendo...</div>}
          <div ref={messagesEndRef} />
        </section>

        <form className="chatbot-main-input" onSubmit={handleSend}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu mensaje..."
          />
          <button type="submit" disabled={isLoading}>Enviar</button>
        </form>
      </main>
    </div>
  );
};

export default ChatbotFull;
