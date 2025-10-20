// src/services/anthropic/agentOrchestrator.ts
import messageService, { MessageOptions } from './messageService';
import type { MessageParam } from '@anthropic-ai/sdk/resources/messages';

export interface AgentConfig {
  name: string;
  systemPrompt: string;
  temperature?: number;
  maxTokens?: number;
}

export interface AgentResponse {
  agentName: string;
  response: string;
  timestamp: Date;
  tokensUsed?: number;
}

/**
 * Agent Orchestrator
 * Manages multiple Claude agents and routes requests appropriately
 */
export class AgentOrchestrator {
  private agents: Map<string, AgentConfig> = new Map();
  private conversationHistories: Map<string, MessageParam[]> = new Map();
  
  /**
   * Register a new agent with the orchestrator
   */
  registerAgent(config: AgentConfig): void {
    this.agents.set(config.name, config);
    this.conversationHistories.set(config.name, []);
  }
  
  /**
   * Send a message to a specific agent
   */
  async invokeAgent(
    agentName: string,
    userMessage: string,
    options: Partial<MessageOptions> = {}
  ): Promise<AgentResponse> {
    const agent = this.agents.get(agentName);
    
    if (!agent) {
      throw new Error(`Agent "${agentName}" not found. Please register it first.`);
    }
    
    const conversationHistory = this.conversationHistories.get(agentName) || [];
    
    const response = await messageService.sendMessage(
      userMessage,
      conversationHistory,
      {
        systemPrompt: agent.systemPrompt,
        temperature: options.temperature ?? agent.temperature ?? 1.0,
        maxTokens: options.maxTokens ?? agent.maxTokens ?? 4096,
      }
    );
    
    // Update conversation history
    conversationHistory.push(
      { role: 'user', content: userMessage },
      { role: 'assistant', content: response }
    );
    this.conversationHistories.set(agentName, conversationHistory);
    
    return {
      agentName,
      response,
      timestamp: new Date(),
    };
  }
  
  /**
   * Get conversation history for an agent
   */
  getAgentHistory(agentName: string): MessageParam[] {
    return this.conversationHistories.get(agentName) || [];
  }
  
  /**
   * Clear conversation history for an agent
   */
  clearAgentHistory(agentName: string): void {
    this.conversationHistories.set(agentName, []);
  }
  
  /**
   * Clear all conversation histories
   */
  clearAllHistories(): void {
    for (const agentName of this.agents.keys()) {
      this.conversationHistories.set(agentName, []);
    }
  }
  
  /**
   * Get list of registered agents
   */
  getRegisteredAgents(): string[] {
    return Array.from(this.agents.keys());
  }
  
  /**
   * Sequential agent workflow - invoke multiple agents in sequence
   */
  async runSequentialWorkflow(
    workflow: Array<{ agentName: string; message: string }>,
    shareContext: boolean = false
  ): Promise<AgentResponse[]> {
    const results: AgentResponse[] = [];
    let contextMessage = '';
    
    for (const step of workflow) {
      const message = shareContext 
        ? `${contextMessage}\n\n${step.message}` 
        : step.message;
      
      const result = await this.invokeAgent(step.agentName, message);
      results.push(result);
      
      if (shareContext) {
        contextMessage += `\n\nPrevious agent (${result.agentName}) response: ${result.response}`;
      }
    }
    
    return results;
  }
  
  /**
   * Parallel agent workflow - invoke multiple agents simultaneously
   */
  async runParallelWorkflow(
    tasks: Array<{ agentName: string; message: string }>
  ): Promise<AgentResponse[]> {
    const promises = tasks.map(task => 
      this.invokeAgent(task.agentName, task.message)
    );
    
    return Promise.all(promises);
  }
}

export default new AgentOrchestrator();