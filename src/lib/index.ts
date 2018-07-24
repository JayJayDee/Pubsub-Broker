
import * as crypto from 'crypto';
import * as minimatch from 'minimatch';
import * as _ from 'lodash';

import { SubscriptionLimitExceedError } from './errors';
import { PubsubBroker, Topic, PublishResult, TopicOptions, DriverPublishResult, DriverPublishPayload, SubscribePayload, SubscriptionResult } from '../../types';
import InMemoryDriver from './in-memory-driver';

export const Broker: PubsubBroker = {
  driver: new InMemoryDriver(),
  callbackMap: {},
  optionsMap: {},
  signatureMap: {},

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
    const self: PubsubBroker = this;
    let topics: Topic[] = _.map(Object.keys(this.callbackMap), (topicExpr: string) => {
      let topicOpts: TopicOptions = null;
      if (self.optionsMap[topicExpr]) {
        topicOpts = self.optionsMap[topicExpr];
      }
      let topic: Topic = {
        topicExpr: topicExpr,
        options: topicOpts,
        numSubscribers: Object.keys(this.callbackMap[topicExpr]).length
      };
      return topic;
    }); 
    return topics;
  },

  subscribe: async function(topicExpr: string, callback: (payload: any) => void): Promise<SubscriptionResult> {
    let signature: string = BrokerHelper.generateCallbackSignature(callback);
    let options: TopicOptions = this.optionsMap[topicExpr];

    if (!options) {
      options = {
        oneTimeOnly: false,
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
    let subscribePayload: SubscribePayload = {
      topicExpr: topicExpr,
      oneTimeOnly: false,
      callback: callback
    }; 
    this.signatureMap[signature] = subscribePayload;

    let topicOpts = this.optionsMap[topicExpr];
    if (!topicOpts) {
      topicOpts = null;
    }
    return {
      topicExpr: topicExpr,
      options: topicOpts,
      numSubscribers: Object.keys(this.callbackMap[topicExpr]).length,
      subscriptionId: signature
    };
  },

  unsubscribe: async function(subscriptionId: string): Promise<void> {

  },

  publish: async function(topicExpr: string, payload: any): Promise<PublishResult> {
    const self: PubsubBroker = this;
    let payloads: DriverPublishPayload[] = _.chain(Object.keys(this.callbackMap))
      .filter((elem: string) => minimatch(elem, topicExpr))
      .map((elem: string) => _.map(self.callbackMap[elem], (value: any, key: string) => key))
      .flatten()
      .map((elem: string) => {
        let pubPayload: DriverPublishPayload = {
          callbackSignature: elem,
          payload: payload          
        };
        return pubPayload;
      })
      .value();

    let resp: DriverPublishResult = await this.driver.publish(payloads);
    return {
      topicExpr: topicExpr,
      numPublished: resp.numPublished
    };
  },
}

Broker.driver.registerNotifyCallback((payloads: DriverPublishPayload[]) => {
  let groupped: any = _.chain(payloads)
    .groupBy((elem: DriverPublishPayload) => elem.callbackSignature)
    .map((grouppedPayloads: DriverPublishPayload[], callbackSignature: string) => {
      return {
        callbackSignature: callbackSignature,
        payloads: _.map(grouppedPayloads, (elem: DriverPublishPayload) => elem.payload)
      };
    })  
    .value()
    .forEach((elem) => {
      if (Broker.signatureMap[elem.callbackSignature]) {
        Broker.signatureMap[elem.callbackSignature].callback(elem.payloads);
      }
    });
});

const BrokerHelper = {
  generateCallbackSignature: (func: (payload: any) => void) => {
    let hashed = crypto.createHash('sha256').update(func.toString()).digest('hex');
    return hashed;
  }
}