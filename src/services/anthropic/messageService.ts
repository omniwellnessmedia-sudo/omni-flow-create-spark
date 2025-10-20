// src/services/anthropic/messageService.ts
import { getAnthropicClient } from './client';
import type { MessageParam, TextBlock } from '@anthropic-ai/sdk/resources/messages';

export interface MessageOptions {
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export interface StreamCallback {
  onStart?: () => void;
  onToken?: (token: string) => void;
  onComplete?: (fullText: string) => void;
  onError?: (error: Error) => void;
}

/**
 * Message Service for Anthropic Claude API
 * Handles both streaming and non-streaming message generation
 */
export class MessageService {
  private model: string = 'claude-sonnet-4-20250514';
  
  /**
   * Send a message to Claude and get a complete response
   */
  async sendMessage(
    userMessage: string,
    conversationHistory: MessageParam[] = [],
    options: MessageOptions = {}
  ): Promise<string> {
    const client = getAnthropicClient();
    
    const messages: MessageParam[] = [
      ...conversationHistory,
      {
        role: 'user',
        content: userMessage,
      },
    ];
    
    const response = await client.messages.create({
      model: this.model,
      max_tokens: options.maxTokens || 4096,
      temperature: options.temperature || 1.0,
      system: options.systemPrompt,
      messages,
    });
    
    // Extract text from response
    const textContent = response.content.find(
      (block): block is TextBlock => block.type === 'text'
    );
    
    return textContent?.text || '';
  }
  
  /**
   * Send a message with streaming response
   */
  async sendMessageStream(
    userMessage: string,
    conversationHistory: MessageParam[] = [],
    callbacks: StreamCallback,
    options: MessageOptions = {}
  ): Promise<void> {
    const client = getAnthropicClient();
    
    const messages: MessageParam[] = [
      ...conversationHistory,
      {
        role: 'user',
        content: userMessage,
      },
    ];
    
    try {
      callbacks.onStart?.();
      
      let fullText = '';
      
      const stream = await client.messages.create({
        model: this.model,
        max_tokens: options.maxTokens || 4096,
        temperature: options.temperature || 1.0,
        system: options.systemPrompt,
        messages,
        stream: true,
      });
      
      for await (const event of stream) {
        if (event.type === 'content_block_delta' && 
            event.delta.type === 'text_delta') {
          const token = event.delta.text;
          fullText += token;
          callbacks.onToken?.(token);
        }
      }
      
      callbacks.onComplete?.(fullText);
    } catch (error) {
      callbacks.onError?.(error as Error);
      throw error;
    }
  }
  
  /**
   * Create a conversation context from history
   */
  createConversationContext(
    messages: Array<{ role: 'user' | 'assistant'; content: string }>
  ): MessageParam[] {
    return messages.map(msg => ({
      role: msg.role,
      content: msg.content,
    }));
  }
}

export default new MessageService();