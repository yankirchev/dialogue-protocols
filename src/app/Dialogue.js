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

    for (const agent of this.agents) {
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
    for (const anyAgent of this.agents) {
      if (anyAgent.commitmentStore.contains(term)) {
        throw new Error(`Pre-conditions of claimimg "${translate(term)}" by ${agent} are not satisfied because \
                        ${anyAgent}'s commitment store already contains the claim!`);
      }
    }

    /* POST-CONDITIONS */

    // Com_ag_i ⇒ Com_ag_i ∪ l
    agent.commitmentStore += `${term} \n`;

    /* UPDATE DIALOGUE TEXT AND SAVE COMMITMENT STORE HISTORY */

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

    for (const someAgent of this.agents) {
      if (someAgent !== agent && someAgent.commitmentStore.contains(term)) {
        doesAppear = true;
      }
    }

    if (doesAppear === false) {
      throw new Error(`Pre-conditions of asking why "${translate(term)}" by ${agent} are not satisfied because \
                      no other agent's commitment store contains the claim!`);
    }

    /* UPDATE DIALOGUE TEXT AND SAVE COMMITMENT STORE HISTORY */

    this.text += `${agent.name} asks why is it that ${translate(term)}.\n`
    this.saveCommitmentStores();
  }

  // Concede(ag_i ,l)
  concede(agent, term) {
    /* PRE-CONDITIONS */

    // for some agent ag_j /= ag_i, l ∈ Com_ag_j
    let doesAppear = false;

    for (const someAgent of this.agents) {
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

    /* UPDATE DIALOGUE TEXT AND SAVE COMMITMENT STORE HISTORY */

    this.text += `${agent.name} concedes to the claim that ${translate(term)}.\n`
    this.saveCommitmentStores();
  }

  // Retract(ag_i ,l)
  retract(agent, term) {
    /* PRE-CONDITIONS */

    // not demo(􏰖∏_ag_i ∪ Com_ag_i \ l, l)
    const prologSession = pl.create();
    prologSession.consult(agent.knowledgeBase + agent.commitmentStore.replace(term, ''));
    prologSession.query(term);

    if (prologSession.answer) {
      throw new Error(`Pre-conditions of retracting "${translate(term)}" by ${agent} are not satisfied because \
                      the agent can still demonstrate the claim through their remaining commitment store and/or knowledge base!`);
    }

    // l ∈ Com_ag_i
    if (!agent.commitmentStore.contains(term)) {
      throw new Error(`Pre-conditions of retracting "${translate(term)}" by ${agent} are not satisfied because \
                      the agent's commitment store does not contain the claim!`);
    }

    /* POST-CONDITIONS */

    // Com_ag_i ⇒ Com_ag_i \ l
    agent.commitmentStore = agent.commitmentStore.replace(term, '');

    /* UPDATE DIALOGUE TEXT AND SAVE COMMITMENT STORE HISTORY */

    this.text += `${agent.name} retracts the claim that ${translate(term)}.\n`
    this.saveCommitmentStores();
  }

  // Since(ag_i, l, ∏􏰖)
  since(agent, otherAgent, term, justifications) {
    /* PRE-CONDITIONS */

    // l ∈ Com_ag_i
    if (!agent.commitmentStore.contains(term)) {
      throw new Error(`Pre-conditions of offering reasoning for "${translate(term)}" by ${agent} are not satisfied because \
                      the agent's commitment store does not contain the claim!`);
    }

    // demo(􏰖∏ ∪ Com_ag_j, l) for some ∏ 􏰖⊆ ∏_􏰖ag_i
    for (const justification of justifications) {
      if (!agent.knowledgeBase.contains(justification)) {
        throw new Error(`Pre-conditions of offering reasoning for "${translate(term)}" by ${agent} are not satisfied because \
                      the agent's knowledge base does not contain all justifications!`);
      }
    }

    let justificationsInPrologFormat = '';

    for (const justification of justifications) {
      justificationsInPrologFormat += `${justification} \n`;
    }

    const prologSession = pl.create();
    prologSession.consult(justificationsInPrologFormat + otherAgent.commitmentStore);
    prologSession.query(term);

    if (!prologSession.answer) {
      throw new Error(`Pre-conditions of offering reasoning for "${translate(term)}" by ${agent} are not satisfied because \
                      the other agent cannot demonstrate the claim through the justifications and their commitment store!`);
    }

    /* POST-CONDITIONS */

    // Com_ag_i ⇒ Com_ag_i ∪ ∏ 􏰖
    agent.commitmentStore += `${justificationsInPrologFormat} \n`;

    // Com_ag_j ⇒ Com_ag_i ∪ ∏ 􏰖
    otherAgent.commitmentStore += `${justificationsInPrologFormat} \n`;

    /* UPDATE DIALOGUE TEXT AND SAVE COMMITMENT STORE HISTORY */

    this.text += `${agent.name} explains that ${translate(term)} since `

    for (const [index, justification] of justifications.entries()) {
      if (justifications.length === 1) {
        this.text += `${translate(justification)}. \n`
      } else if (index !== justifications.length - 2) {
        this.text += `${translate(justification)}, `
      } else if (index === justifications.length - 2) {
        this.text += `${translate(justification)} and `
      } else {
        this.text += `${translate(justification)}. \n`
      }
    }

    this.saveCommitmentStores();
  }

  // Question(ag_i ,l)
  question(agent, term) {
    /* PRE-CONDITIONS */

    // ∀(ag_j) ∈ Ag,l /∈ Com_ag_j
    for (const anyAgent of this.agents) {
      if (anyAgent.commitmentStore.contains(term)) {
        throw new Error(`Pre-conditions of questioning  "${translate(term)}" by ${agent} are not satisfied because \
                        ${anyAgent}'s commitment store contains the claim!`);
      }
    }

    // not demo(∏_􏰖ag_i ∪ Com_ag_i , l)
    const prologSession = pl.create();
    prologSession.consult(agent.knowledgeBase + agent.commitmentStore);
    prologSession.query(term);

    if (prologSession.answer) {
      throw new Error(`Pre-conditions of questioning "${translate(term)}" by ${agent} are not satisfied because \
                      the agent can already demonstrate the claim through their commitment store and/or knowledge base!`);
    }

    /* UPDATE DIALOGUE TEXT AND SAVE COMMITMENT STORE HISTORY */

    this.text += `${agent.name} questions if ${translate(term)}.\n`
    this.saveCommitmentStores();
  }
}

export default Dialogue;
