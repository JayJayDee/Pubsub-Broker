
import { PubsubBrokerDriver } from '../../types';

export default class InMemoryDriver implements PubsubBrokerDriver {

  private callbackMap: { [key: string]: (payload: any) => Promise<any> };

  constructor() {
    this.callbackMap = {};
  }

  public subscribe(topicKey, callback: (payload: any) => Promise<any>) {
    
  }

  public unsubscribe() {

  }

  public publish(topicKey: string, payload: any) {

  }
}
