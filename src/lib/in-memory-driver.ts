
import { PubsubBrokerDriver, DriverSubscriptionResult, DriverPublishResult } from '../../types';

export default class InMemoryDriver implements PubsubBrokerDriver {

  private callbackMap: { [key: string]: (payload: any) => Promise<any> };

  constructor() {
    this.callbackMap = {};
  }

  public async subscribe(topicKey, callbackSignature: string): Promise<DriverSubscriptionResult> {
    return null;
  }

  public async unsubscribe(): Promise<void> {
    return;
  }

  public async publish(topicKey: string, payload: any): Promise<DriverPublishResult> {
    return null;
  }
}
