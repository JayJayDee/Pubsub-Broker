
import * as crypto from 'crypto';
import * as minimatch from 'minimatch';
import * as _ from 'lodash';

import { SubscriptionLimitExceedError } from './errors';
import { PubsubBroker, Topic, PublishResult, TopicOptions, DriverPublishResult } from '../../types';
import InMemoryDriver from './in-memory-driver';

export const Broker: PubsubBroker = {
  driver: new InMemoryDriver(),
  callbackMap: {},
  optionsMap: {},

  createTopic: async function(topicExpr: string, opts?: TopicOptions): Promise<Topic> {
    this.callbackMap[topicExpr] = {};
    if (opts) {
      this.optionsMap[topicExpr] = opts;
    }
    return {
      topicExpr: topicExpr,
      options: opts,
      numSubscribers: 0
    };
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

    this.callbackMap[topicExpr][signature] = callback;
    //TODO: connect to driver.
    
    let topicOpts = this.optionsMap[topicExpr];
    if (!topicOpts) {
      topicOpts = null;
    }
    return {
      topicExpr: topicExpr,
      options: topicOpts,
      numSubscribers: Object.keys(this.callbackMap[topicExpr]).length
    };
  },

  unsubscribe: async function(subscriptionId: string): Promise<void> {

  },

  publish: async function(topicExpr: string, payload: any): Promise<PublishResult> {
    const self: PubsubBroker = this;
    let signatures: string[] = _.chain(Object.keys(this.callbackMap))
      .filter((elem: string) => minimatch(elem, topicExpr))
      .map((elem: string) => _.map(self.callbackMap[elem], (value: any, key: string) => key))
      .flatten()
      .value();
    let resp: DriverPublishResult = await this.driver.publish(signatures, payload);
    return {
      topicExpr: topicExpr,
      numPublished: resp.numPublished
    };
  }
}

const BrokerHelper = {

  generateCallbackSignature: (func: (payload: any) => void) => {
    let hashed = crypto.createHash('sha256').update(func.toString()).digest('hex');
    return hashed;
  }
}