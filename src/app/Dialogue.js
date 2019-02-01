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
    const prologSession = pl.create();
    prologSession.consult(agent.knowledgeBase + agent.commitmentStore);
    prologSession.query(term);

    if (!prologSession.answer) {
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
    agent.commitmentStore += `${term} \n`;

    /* UPDATE DIALOGUE TEXT AND COMMITMENT STORE HISTORY */

    this.text += `${agent.name} claims that ${translate(term)}.\n`
    this.saveCommitmentStores();
  }

  // Why(ag_i, l)
  why(agent, term) {
    /*  PRE-CONDITIONS */

    // not demo(∏_􏰖ag_i ∪ Com_ag_i , l)
    const prologSession = pl.create();
    prologSession.consult(agent.knowledgeBase + agent.commitmentStore);
    prologSession.query(term);

    if (prologSession.answer) {
      throw new Error(`Pre-conditions of asking why "${translate(term)}" by ${agent} are not satisfied because \
                      the agent can already demonstrate the claim through their commitment store and/or knowledge base!`);
    }

    // for some agent ag_j /= ag_i, l ∈ Com_ag_j
    let doesAppear = false;

    for (const someAgent in this.agents) {
      if (someAgent !== agent && someAgent.commitmentStore.contains(term)) {
        doesAppear = true;
      }
    }

    if (doesAppear === false) {
      throw new Error(`Pre-conditions of asking why "${translate(term)}" by ${agent} are not satisfied because \
                      no other agent's commitment store contains the claim!`);
    }

    /* UPDATE DIALOGUE TEXT AND COMMITMENT STORE HISTORY */

    this.text += `${agent.name} asks why is it that ${translate(term)}.\n`
    this.saveCommitmentStores();
  }

  // Concede(ag_i ,l)
  concede(agent, term) {
    /* PRE-CONDITIONS */

    // for some agent ag_j /= ag_i, l ∈ Com_ag_j
    let doesAppear = false;

    for (const someAgent in this.agents) {
      if (someAgent !== agent && someAgent.commitmentStore.contains(term)) {
        doesAppear = true;
      }
    }

    if (doesAppear === false) {
      throw new Error(`Pre-conditions of conceding to "${translate(term)}" by ${agent} are not satisfied because \
                      no other agent's commitment store contains the claim!`);
    }

    // not (¬l ∈ Com_ag_i )
    if (agent.commitmentStore.contains(`not(${term})`)) {
      throw new Error(`Pre-conditions of conceding to "${translate(term)}" by ${agent} are not satisfied because \
                      the agent's commitment store already contains the negation of the claim!`);
    }

    /* POST-CONDITIONS */

    // Com_ag_i ⇒ Com_ag_i ∪ l
    agent.commitmentStore += `${term} \n`;

    /* UPDATE DIALOGUE TEXT AND COMMITMENT STORE HISTORY */

    this.text += `${agent.name} concedes to the claim that ${translate(term)}.\n`
    this.saveCommitmentStores();
  }
  retract(agent, term) {

  }

  since(agent, otherAgent, term, justification) {

  }

  question(agent, term) {

  }
}

export default Dialogue;
