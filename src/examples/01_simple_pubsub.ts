
import * as Pubsub from '../lib';

(async function() {
  Pubsub.Broker.subscribe('some-topic', (payload: any) => {

  });
})();