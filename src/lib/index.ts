
import * as crypto from 'crypto';

import { SubscriptionLimitExceedError } from './errors';
import { PubsubBroker, Topic, PublishResult, TopicOptions } from '../../types';
import InMemoryDriver from './in-memory-driver';

export const Broker: PubsubBroker = {
  driver: new InMemoryDriver(),
  callbackMap: {},
  optionsMap: {},

  createTopic: async function(topicExpr: string, opts?: TopicOptions): Promise<void> {
    this.callbackMap[topicExpr] = {};
    if (opts) {
      this.optionsMap[topicExpr] = opts;
    }
    return null;
  },

  listTopics: async function(): Promise<Topic[]> {
    return this.callbackMap.keys();
  },

  subscribe: async function(topicExpr: string, callback: (payload: any) => void): Promise<Topic> {
    let signature = BrokerHelper.generateCallbackSignature(callback);
    let options: TopicOptions = this.optionsMap[topicExpr];

    if (!options) {
      options = {
        maxSubscribers: -1
      };
    }

    if (!this.callbackMap[topicExpr]) {
      this.callbackMap[topicExpr] = {};
    }

    if (Object.keys(this.callbackMap[topicExpr]).length >= options.maxSubscribers &&
          options.maxSubscribers !== -1) {
      throw new SubscriptionLimitExceedError(topicExpr);
    }

    //TODO: connect to driver.
    
    return null;
  },

  unsubscribe: async function(subscriptionId: string): Promise<void> {

  },

  publish: async function(topicExpr: string, payload: any): Promise<PublishResult> {
    return null;
  }
}

const BrokerHelper = {

  generateCallbackSignature: (func: (payload: any) => void) => {
    let hashed = crypto.createHash('sha256').update(func.toString()).digest('hex');
    return hashed;
  }
}