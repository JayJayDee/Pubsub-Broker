
import { PubsubBroker, Topic, PublishResult } from '../../types';

export const Broker: PubsubBroker = {
  driver: null,

  createTopic: async (topicExpr: string): Promise<void> => {
    return null;
  },

  listTopics: async (): Promise<Topic[]> => {
    return [];
  },

  subscribe: async (topicExpr: string, callback: (payload: any) => void): Promise<Topic> => {
    return null;
  },

  unsubscribe: async (subscriptionId: string): Promise<void> => {

  },

  publish: async (topicExpr: string, payload: any): Promise<PublishResult> => {
    return null;
  }
}