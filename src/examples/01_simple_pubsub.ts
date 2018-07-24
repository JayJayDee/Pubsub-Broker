
import * as Pubsub from '../lib';

(async function() {
  let subs1 = await Pubsub.Broker.subscribe('some-topic1', (payload: any) => {
    console.log('from some-topic1');
    console.log(payload);
  });
  console.log(subs1);

  let subs2 = await Pubsub.Broker.subscribe('some-topic2', (payload: any) => {
    console.log('from some-topic2');
    console.log(payload);
  });
  console.log(subs2);

  await Pubsub.Broker.publish('some-*', {
    test: 'this message should be received by some-topic1, some-topic2'
  });

  await Pubsub.Broker.publish('some-topic2', {
    test: 'this message should be received by only some-topic2'
  });
})();