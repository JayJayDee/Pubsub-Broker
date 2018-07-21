
export interface PubsubBroker {
  driver: PubsubBrokerDriver;

  createTopic(topicExpr: string, opts?: TopicOptions): Promise<void>;
  listTopics(): Promise<Topic[]>;

  subscribe(topicExpr: string, callback: (payload: any) => void): Promise<Topic>;
  unsubscribe(subscriptionId: string): Promise<void>;
  publish(topicExpr: string, payload: any): Promise<PublishResult>;
}

export interface PubsubBrokerDriver {
  subscribe();
  unsubscribe();
}

export interface TopicOptions {
  maxSubscribers?: number;
}

export interface Topic {
  topicExpr: string;
  options: TopicOptions;
}

export interface SubscribeResult {
  topicExpr: string;
  subscriptionId: string;
}

export interface PublishResult {
  topicExpr: string;
  numPublished: number;
}