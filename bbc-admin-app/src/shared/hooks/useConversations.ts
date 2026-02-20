import { useState, useCallback } from 'react';
import type { Conversation, Message } from '../types';
import { getConversations, getConversation, addMessageToConversation, createConversation, closeConversation as storeClose } from '../store';

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>(getConversations);

  const refresh = useCallback(() => setConversations(getConversations()), []);

  const get = useCallback((id: string): Conversation | undefined => {
    return getConversation(id);
  }, []);

  const addMessage = useCallback((convId: string, msg: Omit<Message, 'id'>) => {
    const result = addMessageToConversation(convId, msg);
    refresh();
    return result;
  }, [refresh]);

  const create = useCallback((visitorName: string, visitorEmail: string, type: 'SALES' | 'SUPPORT') => {
    const conv = createConversation(visitorName, visitorEmail, type);
    refresh();
    return conv;
  }, [refresh]);

  const close = useCallback((convId: string) => {
    const result = storeClose(convId);
    refresh();
    return result;
  }, [refresh]);

  return { conversations, get, addMessage, create, close, refresh };
}
