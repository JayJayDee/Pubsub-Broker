
import * as _ from 'lodash';

import { PubsubBrokerDriver, DriverSubscriptionResult, DriverPublishResult, DriverPublishPayload } from '../../types';
import { InMemoryDriverOptions } from '../../types/in-memory-driver';

export default class InMemoryDriver implements PubsubBrokerDriver {

  private options: InMemoryDriverOptions;
  private payloadQueue: Array<DriverPublishPayload>;

  private notifyCallback: (payloads: DriverPublishPayload[]) => void;

  constructor(opts?: InMemoryDriverOptions) {
    this.payloadQueue = [];
    if (!opts) {
      opts = {
        maxQueueSize: 10,
        consumeSize: 2,
        consumeIntervalInMs: 100,
      };
    }
    this.options = opts;
    this.queueConsumeProc();
  }

  public registerNotifyCallback(notifyCallback: (payloads: DriverPublishPayload[]) => void) {
    this.notifyCallback = notifyCallback;
  }

  private queueConsumeProc() {
    const self = this;
    setTimeout(() => {
      let consumeSize = self.options.consumeSize;
      if (self.options.consumeSize > self.payloadQueue.length) {
        consumeSize = self.payloadQueue.length; 
      }
      let consumed: DriverPublishPayload[] = self.payloadQueue.splice(0, consumeSize);
      if (consumed.length > 0 && self.notifyCallback) {
        self.notifyCallback(consumed);
      }
      self.queueConsumeProc();
    }, this.options.consumeIntervalInMs);
  }

  public async subscribe(topicKey, callbackSignature: string): Promise<DriverSubscriptionResult> {
    return null;
  }

  public async unsubscribe(): Promise<void> {
    return;
  }

  public async publish(payloads: DriverPublishPayload[]): Promise<DriverPublishResult> {
    this.payloadQueue.push.apply(this.payloadQueue, payloads);
    return {
      numPublished: payloads.length
    };
  }
}
