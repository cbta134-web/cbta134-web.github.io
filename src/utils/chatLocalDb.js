import { openDB } from "idb";

const DB_NAME = "cbta-chatbot";
const STORE_NAME = "kv";
const STATE_KEY = "chat_state_v1";

const getDb = () =>
  openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    }
  });

export const loadChatState = async () => {
  const db = await getDb();
  const state = await db.get(STORE_NAME, STATE_KEY);
  return (
    state || {
      conversations: [],
      activeId: null
    }
  );
};

export const saveChatState = async (state) => {
  const db = await getDb();
  await db.put(STORE_NAME, state, STATE_KEY);
};

export const createConversation = (title = "Nueva conversación") => {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return {
    id,
    title,
    createdAt: new Date().toISOString(),
    messages: []
  };
};

export const getActiveConversation = (state) =>
  state.conversations.find((conv) => conv.id === state.activeId) || null;

export const setActiveConversation = (state, id) => ({
  ...state,
  activeId: id
});

export const upsertConversation = (state, conversation) => {
  const exists = state.conversations.find((conv) => conv.id === conversation.id);
  const conversations = exists
    ? state.conversations.map((conv) => (conv.id === conversation.id ? conversation : conv))
    : [conversation, ...state.conversations];

  return {
    ...state,
    conversations
  };
};
