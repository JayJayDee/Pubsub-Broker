
import * as _ from 'lodash';

import { PubsubBrokerDriver, DriverSubscriptionResult, DriverPublishResult, DriverPublishPayload } from '../../types';
import { InMemoryPayload, InMemoryDriverOptions } from '../../types/in-memory-driver';

export default class InMemoryDriver implements PubsubBrokerDriver {

  private options: InMemoryDriverOptions;
  private payloadQueue: Array<DriverPublishPayload>;

  private notifyCallback: (callbackSignatures: string[], payload: any) => void;

  constructor(opts?: InMemoryDriverOptions) {
    this.payloadQueue = [];
    if (!opts) {
      opts = {
        maxQueueSize: 10,
        consumeIntervalInMs: 100
      };
    }
    this.options = opts;
    this.queueConsumeProc();
  }

  public registerNotifyCallback(notifyCallback: (callbackSignatures: string[], payload: any) => void) {
    this.notifyCallback = notifyCallback;
  }

  private queueConsumeProc() {
    const self = this;
    setTimeout(() => {
      let consumed: DriverPublishPayload = self.payloadQueue.shift();
      if (consumed && self.notifyCallback) {
        console.log(consumed);
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
