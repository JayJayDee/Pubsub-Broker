
import { PubsubBrokerDriver, DriverSubscriptionResult, DriverPublishResult } from '../../types';
import { InMemoryPayload, InMemoryDriverOptions } from '../../types/in-memory-driver';

export default class InMemoryDriver implements PubsubBrokerDriver {

  private options: InMemoryDriverOptions;
  private payloadQueue: Array<InMemoryPayload>;

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

  private queueConsumeProc() {
    const self = this;
    setTimeout(() => {
      let consumed: InMemoryPayload = self.payloadQueue.shift();
      if (consumed) {
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

  public async publish(callbackSignatures: string[], payload: any): Promise<DriverPublishResult> {
    this.payloadQueue.push({
      callbackSignatures: callbackSignatures,
      payload: payload
    });
    return {
      numPublished: callbackSignatures.length
    };
  }
}
