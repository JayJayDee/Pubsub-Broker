
import * as Pubsub from '../lib';

(async function() {
  let resp = await Pubsub.Broker.subscribe('some-topic', (payload: any) => {
    console.log('message received!');
    console.log(payload);
  });

  let resp2 = await Pubsub.Broker.subscribe('some-topic2', (payload: any) => {
    console.log('test2');
  });

  await Pubsub.Broker.publish('some-*', {
    test: 'test=data'
  });

  await Pubsub.Broker.publish('some-topic', {
    test: 'post-data'
  });
})();