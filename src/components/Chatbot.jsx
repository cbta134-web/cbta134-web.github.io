import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import ChatbotPrompt from "./ChatbotPrompt";
import {
  loadChatState,
  saveChatState,
  createConversation,
  getActiveConversation,
  upsertConversation
} from "../utils/chatLocalDb";
import "./Chatbot.css";

const Chatbot = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [chatState, setChatState] = useState({ conversations: [], activeId: null });
  const [isLoading, setIsLoading] = useState(false);
  const [chatbotConfig, setChatbotConfig] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(() => {
    // Cargar el estado de apertura del chatbot desde localStorage
    const savedChatState = localStorage.getItem("isChatOpen");
    return savedChatState ? JSON.parse(savedChatState) : false;
  });
  const contextCacheRef = useRef({ value: null, timestamp: 0 });

  // Cargar conversaciones desde la BD local (IndexedDB)
  useEffect(() => {
    const initChat = async () => {
      const state = await loadChatState();
      if (!state.conversations.length) {
        const welcomeMessage = {
          id: `msg-${Date.now()}`,
          text: "¡Hola! Soy **Camaleón IA**, tu asistente virtual del CBTA 134. Estoy aquí para ayudarte con información sobre nuestra institución, carreras, clubs y más. ¿En qué puedo ayudarte hoy?",
          sender: "bot",
          createdAt: new Date().toISOString()
        };
        const conversation = createConversation("Camaleón IA");
        conversation.messages.push(welcomeMessage);
        const nextState = {
          conversations: [conversation],
          activeId: conversation.id
        };
        setChatState(nextState);
        await saveChatState(nextState);
        return;
      }
      setChatState(state);
    };

    initChat();
  }, []);

  useEffect(() => {
    if (!chatState.conversations.length) return;
    saveChatState(chatState);
  }, [chatState]);

  // Guardar el estado de apertura del chatbot en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem("isChatOpen", JSON.stringify(isChatOpen));
  }, [isChatOpen]);

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

  // Función para formatear texto (negritas, cursivas, saltos de línea)
  const formatText = (text) => {
    text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"); // Negritas
    text = text.replace(/\*(.*?)\*/g, "<em>$1</em>"); // Cursivas
    text = text.replace(/\n/g, "<br />"); // Saltos de línea
    return text;
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

    const now = Date.now();
    const cacheMs = 5 * 60 * 1000;
    if (contextCacheRef.current.value && now - contextCacheRef.current.timestamp < cacheMs) {
      return contextCacheRef.current.value;
    }

    const { data, error } = await supabase.rpc("get_chatbot_context");
    if (error) {
      console.warn("No se pudo cargar contexto de BD:", error.message);
      return "";
    }

    const contextText = JSON.stringify(data || {}, null, 2);
    contextCacheRef.current = { value: contextText, timestamp: now };
    return contextText;
  };

  // Función para manejar el envío de mensajes
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (chatbotConfig && chatbotConfig.enabled === false) {
      const disabledMessage = { text: "El chatbot está deshabilitado temporalmente.", sender: "bot" };
      setChatState((prev) => {
        const active = getActiveConversation(prev);
        if (!active) return prev;
        const updated = {
          ...active,
          messages: [...active.messages, { ...disabledMessage, id: `msg-${Date.now()}`, createdAt: new Date().toISOString() }]
        };
        return upsertConversation(prev, updated);
      });
      return;
    }

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
          conversation_id: chatState.activeId || null,
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

      const activeConversation = getActiveConversation(chatState);
      const historyMessages = (activeConversation?.messages || []).slice(-10).map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: stripHtml(msg.text)
      }));

      const callProvider = async (providerToUse) => {
        const apiKey = getApiKey(providerToUse);
        if (!apiKey) {
          throw new Error(`No hay API key configurada para ${providerToUse}.`);
        }

        const baseUrl = getBaseUrl(providerToUse, chatbotConfig?.base_url || "");
        const model = chatbotConfig?.model || (providerToUse === "gemini" ? "gemini-3.0-flash" : "llama-3.1-8b-instant");
        const apiUrl = providerToUse === "gemini"
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
                  contents: [{
                    parts: [{
                      text: `${fullSystemPrompt}\n\nHistorial de la conversación:\n${historyMessages
                        .map((msg) => `${msg.role === "user" ? "Usuario" : "Chatbot"}: ${msg.content}`)
                        .join("\n")}
\n\nUsuario: ${input}`
                    }]
                  }]
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

        if (providerToUse === "gemini" && data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
          return data.candidates[0].content.parts[0].text;
        }

        if (data.choices && data.choices[0] && data.choices[0].message) {
          return data.choices[0].message.content;
        }

        if (data.error) {
          throw new Error(data.error.message);
        }

        throw new Error("Respuesta no válida del proveedor.");
      };

      const configuredProvider = (chatbotConfig?.provider || "groq").toLowerCase();
      const primaryProvider = (chatbotConfig?.primary_provider || configuredProvider || "groq").toLowerCase();
      const fallbackEnabled = chatbotConfig?.fallback_enabled === true;
      const secondaryProvider = primaryProvider === "groq" ? "gemini" : "groq";

      let botResponse = null;

      try {
        botResponse = await callProvider(fallbackEnabled ? primaryProvider : configuredProvider);
      } catch (primaryError) {
        if (fallbackEnabled) {
          botResponse = await callProvider(secondaryProvider);
        } else {
          throw primaryError;
        }
      }

      const formattedText = formatText(botResponse);
      const botMessage = {
        id: `msg-${Date.now()}`,
        text: formattedText,
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
      const botMessage = { text: `Error al conectar con Camaleón IA: ${error.message}. Verifica tu conexión a internet e intenta de nuevo.`, sender: "bot" };
      setChatState((prev) => {
        const active = getActiveConversation(prev);
        if (!active) return prev;
        const updated = {
          ...active,
          messages: [...active.messages, { ...botMessage, id: `msg-${Date.now()}`, createdAt: new Date().toISOString() }]
        };
        return upsertConversation(prev, updated);
      });
    }

    setIsLoading(false);
  };

  return (
    <div className={`chatbot-container ${isChatOpen ? "open" : ""}`}>
      {/* Burbuja del chatbot con el ícono de camaleón */}
      <div className="chatbot-bubble-wrapper">
        <div className="chatbot-bubble" onClick={() => setIsChatOpen(!isChatOpen)}>
          <img src="/images/camaleonicono.jpg" alt="Camaleón IA" className="camaleon-icon" />
        </div>
        <p className="chatbot-label">Camaleón IA</p>
      </div>

      {/* Ventana del chat */}
      {isChatOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h3>Camaleón IA</h3>
            <button
              className="open-full-btn"
              onClick={() => {
                navigate('/chatbot');
                window.location.hash = '#/chatbot';
              }}
              title="Abrir en pantalla completa"
              type="button"
            >
              ⤢
            </button>
            <button className="close-btn" onClick={() => setIsChatOpen(false)}>
              ×
            </button>
          </div>
          <div className="chatbot-messages">
            {getActiveConversation(chatState)?.messages.map((message) => (
              <div key={message.id} className={`message ${message.sender}`}>
                <div dangerouslySetInnerHTML={{ __html: formatText(message.text) }} />
              </div>
            ))}
            {isLoading && <div className="message bot">Escribiendo...</div>}
          </div>
          <form onSubmit={handleSubmit} className="chatbot-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu mensaje..."
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Enviando..." : "Enviar"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;