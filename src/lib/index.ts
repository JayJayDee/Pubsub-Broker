
import * as crypto from 'crypto';

import { PubsubBroker, Topic, PublishResult, TopicOptions } from '../../types';
import InMemoryDriver from './in-memory-driver';

export const Broker: PubsubBroker = {
  driver: new InMemoryDriver(),
  callbackMap: {},
  optionsMap: {},

  createTopic: async (topicExpr: string, opts?: TopicOptions): Promise<void> => {
    this.callbackMap[topicExpr] = {};
    return null;
  },

  listTopics: async (): Promise<Topic[]> => {
    return [];
  },

  subscribe: async (topicExpr: string, callback: (payload: any) => void): Promise<Topic> => {
    let signature = BrokerHelper.translateFunctionToSignature(callback);
    return null;
  },

  unsubscribe: async (subscriptionId: string): Promise<void> => {

  },

  publish: async (topicExpr: string, payload: any): Promise<PublishResult> => {
    return null;
  }
}

const BrokerHelper = {

  translateFunctionToSignature: (func: (payload: any) => void) => {
    let hashed = crypto.createHash('sha256').update(func.toString()).digest('hex');
    return hashed;
  }
}