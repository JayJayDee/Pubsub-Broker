
export interface PubsubBroker {
  driver: PubsubBrokerDriver;
  callbackMap: { [topicExpr: string]: { [funcSignature: string]: (payload: any) => void }};
  optionsMap: { [topicExpr: string]: TopicOptions };

  createTopic(topicExpr: string, opts?: TopicOptions): Promise<Topic>;
  listTopics(): Promise<Topic[]>;

  subscribe(topicExpr: string, callback: (payload: any) => void): Promise<Topic>;
  unsubscribe(subscriptionId: string): Promise<void>;
  publish(topicExpr: string, payload: any): Promise<PublishResult>;
}

export interface PubsubBrokerDriver {
  subscribe(topicKey: string, callbackSignature: string): Promise<DriverSubscriptionResult>;
  unsubscribe(subscriptionId: string): Promise<void>;
  publish(callbackSignatures: string[], payload: any): Promise<DriverPublishResult>;
}

export interface DriverSubscriptionResult {
  subscriptionId: string;
}

export interface DriverPublishResult {
  numPublished: number;
}

export interface TopicOptions {
  maxSubscribers: number;
}

export interface Topic {
  topicExpr: string;
  options: TopicOptions;
  numSubscribers: number;
}

export interface SubscribeResult {
  topicExpr: string;
  subscriptionId: string;
}

export interface PublishResult {
  topicExpr: string;
  numPublished: number;
}