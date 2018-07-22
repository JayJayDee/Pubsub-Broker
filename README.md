# Pubsub-Broker
Powerful & easy-to-use publish-subscribe broker for node.js.

## features
- supports topic restriction. (number of subscription..)
- supports 3rd party pubsub-driver.

## requirements
node v8.10 or above. (async/await)

## examples

#### simple pub-sub
```javascript
(async function() {
  await Pubsub.Broker.subscribe('some-topic1', (payload: any) => {
    console.log('from some-topic1');
    console.log(payload);
  });

  await Pubsub.Broker.subscribe('some-topic2', (payload: any) => {
    console.log('from some-topic2');
    console.log(payload);
  });


  await Pubsub.Broker.publish('some-*', {
    test: 'this message should be received by some-topic1, some-topic2'
  });

  await Pubsub.Broker.publish('some-topic2', {
    test: 'this message should be received by only some-topic2'
  });
})();
```

#### restricted topic
the topic name `restricted-topic` created with `maxSubscribers: 1`, so following code fires exception.
```javascript
(async function() {
  await Pubsub.Broker.createTopic('restricted-topic', {
    maxSubscribers: 1,
    oneTimeOnly: false
  });

  await Pubsub.Broker.subscribe('restricted-topic', function(payload) {
    console.log('from restricted-topic');
    console.log(payload);
  });

  try {
    await Pubsub.Broker.subscribe('restricted-topic', function(payload) {
      console.log('from restricted-topic');
      console.log(payload);
    });
  } catch(err) {
    //error fired.
    console.error(err);
  }
})();
```