import pl from 'tau-prolog';
import { translate } from './helper';

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

  // Claim(ag_i, l)
  claim(agent, term) {
    /*  PRE-CONDITIONS */

    // demo(∏_􏰖ag_i ∪ Com_ag_i, l)
    const session = pl.create(1000);
    session.consult(agent.knowledgeBase + agent.commitmentStore);
    session.query(term);

    if (!session.answer) {
      throw new Error(`Pre-conditions of claimimg "${translate(term)}" by ${agent} are not satisfied because \
                      the agent cannot demonstrate the claim through their commitment store and/or knowledge base!`);
    }

    // ¬l ∈ Com_ag_j for any ag_j ∈ Ag
    for (const anyAgent in this.agents) {
      if (anyAgent.commitmentStore.contains(term)) {
        throw new Error(`Pre-conditions of claimimg "${translate(term)}" by ${agent} are not satisfied because \
                        ${anyAgent}'s commitment store already contains the claim!`);
      }
    }

    /* POST-CONDITIONS */

    // Com_ag_i ⇒ Com_ag_i ∪ l
    agent.commitmentStore += term;
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
