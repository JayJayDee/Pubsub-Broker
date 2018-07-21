
export class BasePubsubError extends Error {
  constructor(msg) {
    super(msg);
  }
}

export class SubscriptionLimitExceedError extends BasePubsubError {
  constructor(topicExpr) {
    super(`subscription limit excceed for topic:${topicExpr}`);
  }
}