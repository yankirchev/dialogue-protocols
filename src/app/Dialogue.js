import pl from 'tau-prolog';

import { format, translate } from './helper';

class Dialogue {
  constructor(agents) {
    if (new.target === Dialogue) {
      throw new TypeError('Cannot construct Dialogue instances directly!');
    }

    this.agents = agents;
    this.commitmentStoreHistory = [];
    this.text = '';
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

    // demo(∏_ag_i ∪ Com_ag_i, l)
    const prologSession = pl.create();
    prologSession.consult(agent.knowledgeBase + agent.commitmentStore);
    prologSession.query(term);
    prologSession.answer(x => {
      if (pl.format_answer(x) !== 'true ;') {
        throw new Error(`Pre-conditions of ${agent.name} claiming "${translate(term)}" are not satisfied because ` +
          `the agent cannot demonstrate the claim through their knowledge base and/or commitment store!`);
      }
    });

    // ¬l ∈ Com_ag_j for any ag_j ∈ Ag
    for (const anyAgent of this.agents) {
      if (anyAgent.commitmentStore.includes(term)) {
        throw new Error(`Pre-conditions of ${agent.name} claiming "${translate(term)}" are not satisfied because ` +
          `${anyAgent.name}'s commitment store contains the claim!`);
      }
    }

    /* POST-CONDITIONS */

    // Com_ag_i ⇒ Com_ag_i ∪ l
    agent.commitmentStore += `${term}\n`;

    /* UPDATE DIALOGUE TEXT AND SAVE COMMITMENT STORE HISTORY */

    this.text += `${agent.name}: ${translate(term)}.\n`
    this.saveCommitmentStores();
  }

  // Why(ag_i, l)
  why(agent, term) {
    /*  PRE-CONDITIONS */

    // not demo(∏_ag_i ∪ Com_ag_i, l)
    const prologSession = pl.create();
    prologSession.consult(agent.knowledgeBase + agent.commitmentStore);
    prologSession.query(term);
    prologSession.answer(x => {
      if (pl.format_answer(x) === 'true ;') {
        throw new Error(`Pre-conditions of ${agent.name} asking why "${translate(term)}" are not satisfied because ` +
          `the agent can already demonstrate the claim through their knowledge base and/or commitment store!`);
      }
    });

    // for some agent ag_j ≠ ag_i, l ∈ Com_ag_j
    let doesAppear = false;

    for (const someAgent of this.agents) {
      if (someAgent !== agent && someAgent.commitmentStore.includes(term)) {
        doesAppear = true;
      }
    }

    if (doesAppear === false) {
      throw new Error(`Pre-conditions of ${agent.name} asking why "${translate(term)}" are not satisfied because ` +
        `no other agent's commitment store contains the claim!`);
    }

    /* UPDATE DIALOGUE TEXT AND SAVE COMMITMENT STORE HISTORY */

    this.text += `${agent.name}: Why is it that ${translate(term)}?\n`
    this.saveCommitmentStores();
  }

  // Concede(ag_i, l)
  concede(agent, term) {
    /* PRE-CONDITIONS */

    // for some agent ag_j ≠ ag_i, l ∈ Com_ag_j
    let doesAppear = false;

    for (const someAgent of this.agents) {
      if (someAgent !== agent && someAgent.commitmentStore.includes(term)) {
        doesAppear = true;
      }
    }

    if (doesAppear === false) {
      throw new Error(`Pre-conditions of ${agent.name} conceding to "${translate(term)}" are not satisfied because ` +
        `no other agent's commitment store contains the claim!`);
    }

    // not(¬l ∈ Com_ag_i)
    if (term.includes('\\+(') && (agent.commitmentStore.includes(`${term.substring(3, term.length - 2)}.`))) {
      throw new Error(`Pre-conditions of ${agent.name} conceding to "${translate(term)}" are not satisfied because ` +
        `the agent's commitment store contains the negation of the claim!`);
    } else if (agent.commitmentStore.includes(`\\+(${term.substring(0, term.length - 1)}).`)) {
      throw new Error(`Pre-conditions of ${agent.name} conceding to "${translate(term)}" are not satisfied because ` +
        `the agent's commitment store contains the negation of the claim!`);
    }

    /* POST-CONDITIONS */

    // Com_ag_i ⇒ Com_ag_i ∪ l
    if (!agent.commitmentStore.includes(term)) {
      agent.commitmentStore += `${term}\n`;
    }

    /* UPDATE DIALOGUE TEXT AND SAVE COMMITMENT STORE HISTORY */

    this.text += `${agent.name}: I accept that ${translate(term)}.\n`
    this.saveCommitmentStores();
  }

  // Retract(ag_i, l)
  retract(agent, term) {
    /* PRE-CONDITIONS */

    // not demo(∏_ag_i ∪ Com_ag_i \ l, l)
    const prologSession = pl.create();
    prologSession.consult(agent.knowledgeBase + agent.commitmentStore.replace(term, ''));
    prologSession.query(term);
    prologSession.answer(x => {
      if (pl.format_answer(x) === 'true ;') {
        throw new Error(`Pre-conditions of ${agent.name} retracting "${translate(term)}" are not satisfied because ` +
          `the agent can still demonstrate the claim through their knowledge base and/or remaining commitment store!`);
      }
    });

    // l ∈ Com_ag_i
    if (!agent.commitmentStore.includes(term)) {
      throw new Error(`Pre-conditions of ${agent.name} retracting "${translate(term)}" are not satisfied because ` +
        `the agent's commitment store does not contain the claim!`);
    }

    /* POST-CONDITIONS */

    // Com_ag_i ⇒ Com_ag_i \ l
    agent.commitmentStore = agent.commitmentStore.replace(`${term}\n`, '');

    /* UPDATE DIALOGUE TEXT AND SAVE COMMITMENT STORE HISTORY */

    this.text += `${agent.name}: I take back that ${translate(term)}.\n`
    this.saveCommitmentStores();
  }

  // Since(ag_i, l, ∏)
  since(agent, otherAgent, term, justifications) {
    /* PRE-CONDITIONS */

    // l ∈ Com_ag_i
    if (!agent.commitmentStore.includes(term)) {
      throw new Error(`Pre-conditions of ${agent.name} offering reasoning for "${translate(term)}" are not satisfied because ` +
        `the agent's commitment store does not contain the claim!`);
    }

    // demo(∏ ∪ Com_ag_j, l) for some ∏ ⊆ ∏_ag_i
    for (const justification of justifications) {
      if (!agent.knowledgeBase.includes(justification)) {
        throw new Error(`Pre-conditions of ${agent.name} offering reasoning for "${translate(term)}" are not satisfied because ` +
          `the agent's knowledge base does not contain all justifications!`);
      }
    }

    let justificationsInPrologFormat = '';

    for (const justification of justifications) {
      justificationsInPrologFormat += `${justification}\n`;
    }

    const prologSession = pl.create();
    prologSession.consult(justificationsInPrologFormat + otherAgent.commitmentStore);
    prologSession.query(term);
    prologSession.answer(x => {
      if (pl.format_answer(x) !== 'true ;') {
        throw new Error(`Pre-conditions of ${agent.name} offering reasoning for "${translate(term)}" are not satisfied because ` +
          `${otherAgent.name} cannot demonstrate the claim through the justifications and their commitment store!`);
      }
    });

    /* POST-CONDITIONS */

    // Com_ag_i ⇒ Com_ag_i ∪ ∏
    for (const justification of justifications) {
      if (!agent.commitmentStore.includes(justification)) {
        agent.commitmentStore += `${justification}\n`;
      }
    }

    // Com_ag_j ⇒ Com_ag_j ∪ ∏
    for (const justification of justifications) {
      if (!otherAgent.commitmentStore.includes(justification)) {
        otherAgent.commitmentStore += `${justification}\n`;
      }
    }

    /* UPDATE DIALOGUE TEXT AND SAVE COMMITMENT STORE HISTORY */

    justifications = justifications[0].split('-')[1].split(', ')[0].replace(/X/g, term.match(/([A-Za-z0-9])+/g)[1]);

    for (const match of justifications.match(/([A-Za-z0-9])+/g)) {
      if (match[0] !== match[0].toLowerCase()) {
        const prologSession = pl.create();
        prologSession.consult(justificationsInPrologFormat + otherAgent.commitmentStore + otherAgent.commitmentDependencies);

        if (justifications[justifications.length - 1] !== '.' && justifications[justifications.length - 2] !== '.') {
          justifications = justifications + '.'
        }

        prologSession.query(justifications);
        prologSession.answer(x => justifications = justifications.replace(match, pl.format_answer(x).split(" ")[2].replace(/,|\./g, '')));
      }
    }

    this.text += `${agent.name}: ${translate(term)} since ${format(justifications.split('),'))}.\n`
    this.saveCommitmentStores();
  }

  // Question(ag_i, l)
  question(agent, term) {
    /* PRE-CONDITIONS */

    // ∀(ag_j) ∈ Ag, l ∉ Com_ag_j
    for (const anyAgent of this.agents) {
      if (anyAgent.commitmentStore.includes(term)) {
        throw new Error(`Pre-conditions of ${agent.name} questioning if "${translate(term)}" are not satisfied because ` +
          `${anyAgent.name}'s commitment store contains the claim!`);
      }
    }

    // not demo(∏_ag_i ∪ Com_ag_i, l)
    const prologSession = pl.create();
    prologSession.consult(agent.knowledgeBase + agent.commitmentStore);
    prologSession.query(term);
    prologSession.answer(x => {
      if (pl.format_answer(x) === 'true ;') {
        throw new Error(`Pre-conditions of ${agent.name} questioning if "${translate(term)}" are not satisfied because ` +
          `the agent can demonstrate the claim through their knowledge base and/or commitment store!`);
      }
    });

    /* UPDATE DIALOGUE TEXT AND SAVE COMMITMENT STORE HISTORY */

    this.text += `${agent.name}: I wonder if ${translate(term)}.\n`
    this.saveCommitmentStores();
  }
}

export default Dialogue;
