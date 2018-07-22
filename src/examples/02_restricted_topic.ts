
import * as Pubsub from '../lib';

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
    //MUST BE error fired.
    console.error(err);
  }
})();