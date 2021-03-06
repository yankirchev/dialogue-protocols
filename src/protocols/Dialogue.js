import pl from 'tau-prolog';

import { format, translate } from './utils/helper';

class Dialogue {
  constructor(agents) {
    if (new.target === Dialogue) {
      throw new TypeError('Cannot construct Dialogue instances directly!');
    }

    this.agents = agents;
    this.text = `${agents[0].name}: Where shall we eat?\n`;
    this.commitmentStoreHistory = [['', '', '']];
  }

  saveCommitmentStores() {
    const newCommitmentStoresRecord = [];

    for (const agent of this.agents) {
      newCommitmentStoresRecord.push(agent.commitmentStore);
    }

    this.commitmentStoreHistory.push(newCommitmentStoresRecord);
  }

  isOver() {
    throw new TypeError('Need to implement function isOver!');
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
          `the agent cannot demonstrate the claim through their knowledge base and commitment store!`);
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

    /* UPDATE DIALOGUE TEXT AND UPDATE COMMITMENT STORE HISTORY */

    this.text += `${agent.name}: ${translate(term)}.\n`;
    this.saveCommitmentStores();
  }

  // Counterclaim(ag_i, l)
  counterclaim(agent, term) {
    /*  PRE-CONDITIONS */

    // demo(∏_ag_i ∪ Com_ag_i, l)
    const prologSession = pl.create();
    prologSession.consult(agent.knowledgeBase + agent.commitmentStore);
    prologSession.query(term);
    prologSession.answer(x => {
      if (pl.format_answer(x) !== 'true ;') {
        throw new Error(`Pre-conditions of ${agent.name} counterclaiming "${translate(term)}" are not satisfied because ` +
          `the agent cannot demonstrate the claim through their knowledge base and commitment store!`);
      }
    });

    // ¬l ∈ Com_ag_j for any ag_j ∈ Ag
    for (const anyAgent of this.agents) {
      if (anyAgent.commitmentStore.includes(term)) {
        throw new Error(`Pre-conditions of ${agent.name} counterclaiming "${translate(term)}" are not satisfied because ` +
          `${anyAgent.name}'s commitment store contains the claim!`);
      }
    }

    /* POST-CONDITIONS */

    // Com_ag_i ⇒ Com_ag_i ∪ l
    agent.commitmentStore += `${term}\n`;

    /* UPDATE DIALOGUE TEXT AND UPDATE COMMITMENT STORE HISTORY */

    this.text += `${agent.name}: But ${translate(term)}.\n`;
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
          `the agent can demonstrate the claim through their knowledge base and commitment store!`);
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

    /* UPDATE DIALOGUE TEXT AND UPDATE COMMITMENT STORE HISTORY */

    this.text += `${agent.name}: Why is it that ${translate(term)}?\n`;
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
    if ((term.includes('\\+(') && (agent.commitmentStore.includes(`${term.substring(3, term.length - 2)}.`)))
      || (!term.includes('\\+(') && agent.commitmentStore.includes(`\\+(${term.substring(0, term.length - 1)}).`))) {
      throw new Error(`Pre-conditions of ${agent.name} conceding to "${translate(term)}" are not satisfied because ` +
        `the agent's commitment store contains the negation of the claim!`);
    }

    /* POST-CONDITIONS */

    // Com_ag_i ⇒ Com_ag_i ∪ l
    if (!agent.commitmentStore.includes(term)) {
      agent.commitmentStore += `${term}\n`;
    }

    /* UPDATE DIALOGUE TEXT AND UPDATE COMMITMENT STORE HISTORY */

    this.text += `${agent.name}: I accept that ${translate(term)}.\n`;
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
          `the agent can demonstrate the claim through their knowledge base and remaining commitment store!`);
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

    /* UPDATE DIALOGUE TEXT AND UPDATE COMMITMENT STORE HISTORY */

    this.text += `${agent.name}: I take back that ${translate(term)}.\n`;
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

    let justificationsAsOneString = '';

    for (const justification of justifications) {
      justificationsAsOneString += `${justification}\n`;
    }

    const prologSession = pl.create();
    prologSession.consult(justificationsAsOneString + otherAgent.commitmentStore);
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

    /* UPDATE DIALOGUE TEXT AND UPDATE COMMITMENT STORE HISTORY */

    let bodyOfRuleOfClaim = justifications[0].split('-')[1].split(', ')[0].replace(/X/g, term.match(/([A-Za-z0-9])+/g)[1]);

    for (const match of bodyOfRuleOfClaim.match(/([A-Za-z0-9])+/g)) {
      if (match[0] !== match[0].toLowerCase()) {
        const prologSession = pl.create();
        prologSession.consult(justificationsAsOneString + otherAgent.commitmentStore);

        if (bodyOfRuleOfClaim[bodyOfRuleOfClaim.length - 1] !== '.' && bodyOfRuleOfClaim[bodyOfRuleOfClaim.length - 2] !== '.') {
          bodyOfRuleOfClaim = bodyOfRuleOfClaim + '.'
        }

        prologSession.query(bodyOfRuleOfClaim);
        prologSession.answer(x => bodyOfRuleOfClaim = bodyOfRuleOfClaim.replace(match, pl.format_answer(x).split(" ")[2].replace(/,|\./g, ''))); // eslint-disable-line no-loop-func
      }
    }

    this.text += `${agent.name}: ${translate(term)} since ${format(bodyOfRuleOfClaim.split('),'))}.\n`;
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
          `the agent can demonstrate the claim through their knowledge base and commitment store!`);
      }
    });

    /* UPDATE DIALOGUE TEXT AND UPDATE COMMITMENT STORE HISTORY */

    this.text += `${agent.name}: I wonder if ${translate(term)}.\n`;
    this.saveCommitmentStores();
  }
}

export default Dialogue;
