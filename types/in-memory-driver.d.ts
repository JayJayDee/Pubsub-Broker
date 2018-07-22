
export interface InMemoryDriverOptions {
  maxQueueSize: number;
  consumeIntervalInMs: number;
}

export interface InMemoryPayload {
  callbackSignatures: string[];
  payload: any;
}