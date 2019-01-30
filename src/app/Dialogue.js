import pl from 'tau-prolog';
import { translateTerm } from './helper';

class Dialogue {
  text = '';
  commitmentStoreHistory = [];

  constructor(agents) {
    if (new.target === Dialogue) {
      throw new TypeError('Cannot construct Dialogue instances directly!');
    }

    this.agents = agents;
  }

  saveCommitmentStores() {
    const newCommitmentStoresRecord = [];

    for (const agent in this.agents) {
      newCommitmentStoresRecord.push(agent.commitmentStore);
    }

    this.commitmentStoreHistory.push(newCommitmentStoresRecord);
  }

  claim(agent, term) {

  }

  why(agent, term) {

  }

  concede(agent, term) {

  }

  retract(agent, term) {

  }

  since(agent, otherAgent, term, justification) {

  }

  question(agent, term) {

  }
}

export default Dialogue;
