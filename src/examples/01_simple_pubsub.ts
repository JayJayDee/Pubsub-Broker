
import * as Pubsub from '../lib';

(async function() {
  let resp = await Pubsub.Broker.subscribe('some-topic', (payload: any) => {
    console.log('message received!');
    console.log(payload);
  });

  
})();