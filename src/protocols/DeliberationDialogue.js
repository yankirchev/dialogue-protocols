import pl from 'tau-prolog';

import Dialogue from './Dialogue';

import { decamelise, format, translate } from './utils/helper';

class DeliberationDialogue extends Dialogue {
  constructor(agents) {
    super(agents);

    this.agreedPreferenceRule = 'acceptableRestaurant(X):-';
    this.agreedPreferenceRuleHistory = [this.agreedPreferenceRule];
  }

  saveCommitmentStores() {
    super.saveCommitmentStores();

    this.agreedPreferenceRuleHistory.push(this.agreedPreferenceRule);
  }

  isOver() {
    let collectiveCommitmentStore = '';

    for (const agent of this.agents) {
      for (const line of agent.commitmentStore.split('\n')) {
        if (!/^acceptableRestaurant\(/.test(line)) {
          collectiveCommitmentStore += `${line}\n`;
        }
      }
    }

    collectiveCommitmentStore += this.agreedPreferenceRule;

    let agreedRestaurant = '';

    const prologSession = pl.create();
    prologSession.consult(collectiveCommitmentStore);
    prologSession.query('acceptableRestaurant(X).');
    prologSession.answer(x => {
      agreedRestaurant = pl.format_answer(x).split(" ")[2];
    });

    for (const agent of this.agents) {
      if (!agent.commitmentStore.includes(`acceptableRestaurant(${agreedRestaurant})`))
        return false;
    }

    return true;
  }

  addTermToAgreedPreferenceRule(term) {
    const restaurant = term.match(/([A-Za-z0-9_])+/g)[1];

    if (!this.agreedPreferenceRule.includes(term.substring(0, term.length - 1).replace(restaurant, 'X'))) {
      if (this.agreedPreferenceRule[this.agreedPreferenceRule.length - 1] === '-') {
        this.agreedPreferenceRule += term.replace(restaurant, 'X');
      } else {
        this.agreedPreferenceRule = `${this.agreedPreferenceRule.substring(0, this.agreedPreferenceRule.length - 1)},${term.replace(restaurant, 'X')}`;
      }
    }
  }

  // Claim(ag_i, l) | Claim(O, p(a))
  claim(agent, term) {
    const restaurant = term.match(/([A-Za-z0-9])+/g)[1];
    const property = term.match(/([A-Za-z0-9])+/g)[0];

    /* GENERAL PRE-CONDITIONS */

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

    /*  TYPE-SPECIFIC PRE-CONDITIONS */

    // preferable(O, a)
    if (!agent.doesPrefer(restaurant)) {
      throw new Error(`Pre-conditions of ${agent.name} claiming "${translate(term)}" are not satisfied because ` +
        `the restaurant is not preferable to the agent!`);
    }

    // p(X) ∈ B, where B is the set of terms in the body of the preference rule of O
    let termsToCheck = [];

    for (const line of agent.knowledgeBase.split('\n')) {
      if (/^acceptableRestaurant\(X/.test(line)) {
        for (let m of line.match(/(,|-|, \()([A-Za-z0-9])+(?=\()/g)) {
          m = m.match(/([A-Za-z0-9]+)/g)[0];

          if (!termsToCheck.includes(m)) {
            termsToCheck.push(m);
          }
        }
      }
    }

    for (let i = 0; i < termsToCheck.length; i++) {
      for (const line of agent.knowledgeBase.split('\n')) {
        if (new RegExp('^' + termsToCheck[i] + '\\(X').test(line)) {
          for (let m of line.match(/(,|-|, \()([A-Za-z0-9])+(?=\()/g)) {
            m = m.match(/([A-Za-z0-9]+)/g)[0];

            if (!termsToCheck.includes(m)) {
              termsToCheck.push(m);
            }
          }
        }
      }
    }

    if (!termsToCheck.includes(property)) {
      throw new Error(`Pre-conditions of ${agent.name} claiming "${translate(term)}" are not satisfied because ` +
        `the claim does not correspond to a feature in the body of the agent's preference rule!`);
    }

    /* GENERAL POST-CONDITIONS */

    // Com_ag_i ⇒ Com_ag_i ∪ l
    agent.commitmentStore += `${term}\n`;

    /* TYPE-SPECIFIC POST-CONDITIONS */

    // Com_O ⇒ Com_O ∪ acceptableRestaurant(a) iff demo(∏_O ∪ Com_O, acceptableRestaurant(a))
    prologSession.query(`acceptableRestaurant(${restaurant}).`);
    prologSession.answer(x => {
      if (pl.format_answer(x) === 'true ;' && !agent.commitmentStore.includes(`acceptableRestaurant(${restaurant}).`)) {
        agent.commitmentStore += `acceptableRestaurant(${restaurant}).\n`;
      }
    });

    // Com_O ⇒ Com_O ∪ (p(X) ∈ B), where B is the set of terms in the body of the preference rule of O
    for (const line of (agent.knowledgeBase + agent.commitmentStore).split('\n')) {
      if (new RegExp('^' + property + '\\(X(?=\\)|,[A-Z]|,' + term.match(/([A-Za-z0-9_])+/g)[2] + ')').test(line)) {
        if (!agent.commitmentStore.includes(line)) {
          agent.commitmentStore += `${line}\n`;
        }
      }
    }

    /* UPDATE DIALOGUE TEXT AND UPDATE COMMITMENT STORE HISTORY */

    this.text += `${agent.name}: ${translate(term)}.\n`;
    this.saveCommitmentStores();
  }

  // Counterclaim(ag_i, l) | Counterclaim(O, p(a))
  counterclaim(agent, term) {
    const property = term.match(/([A-Za-z0-9])+/g)[0];

    /* GENERAL PRE-CONDITIONS */

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

    /*  TYPE-SPECIFIC PRE-CONDITIONS */

    // ¬preferable(O, a)
    if (agent.doesPrefer(term.match(/([A-Za-z0-9])+/g)[1])) {
      throw new Error(`Pre-conditions of ${agent.name} counterclaiming "${translate(term)}" are not satisfied because ` +
        `the restaurant is preferable to the agent!`);
    }

    // p(X) ∈ B, where B is the set of terms in the body of the preference rule of O
    let termsToCheck = [];

    for (const line of agent.knowledgeBase.split('\n')) {
      if (/^acceptableRestaurant\(X/.test(line)) {
        for (let m of line.match(/(,|-|, \()([A-Za-z0-9])+(?=\()/g)) {
          m = m.match(/([A-Za-z0-9]+)/g)[0];

          if (!termsToCheck.includes(m)) {
            termsToCheck.push(m);
          }
        }
      }
    }

    for (let i = 0; i < termsToCheck.length; i++) {
      for (const line of agent.knowledgeBase.split('\n')) {
        if (new RegExp('^' + termsToCheck[i] + '\\(X').test(line)) {
          for (let m of line.match(/(,|-|, \()([A-Za-z0-9])+(?=\()/g)) {
            m = m.match(/([A-Za-z0-9]+)/g)[0];

            if (!termsToCheck.includes(m)) {
              termsToCheck.push(m);
            }
          }
        }
      }
    }

    if (!termsToCheck.includes(property)) {
      throw new Error(`Pre-conditions of ${agent.name} counterclaiming "${translate(term)}" are not satisfied because ` +
        `the claim does not correspond to a feature in the body of the agent's preference rule!`);
    }

    /* GENERAL POST-CONDITIONS */

    // Com_ag_i ⇒ Com_ag_i ∪ l
    agent.commitmentStore += `${term}\n`;

    /* TYPE-SPECIFIC POST-CONDITIONS */

    // Com_O ⇒ Com_O ∪ (p(X) ∈ B), where B is the set of terms in the body of the preference rule of O
    for (const line of (agent.knowledgeBase + agent.commitmentStore).split('\n')) {
      if (new RegExp('^' + property + '\\(X(?=\\)|,[A-Z]|,' + term.match(/([A-Za-z0-9_])+/g)[2] + ')').test(line)) {
        if (!agent.commitmentStore.includes(line)) {
          agent.commitmentStore += `${line}\n`;
        }
      }
    }

    /* UPDATE DIALOGUE TEXT AND UPDATE COMMITMENT STORE HISTORY */

    this.text += `${agent.name}: But ${translate(term)}.\n`;
    this.saveCommitmentStores();
  }

  // Concede(ag_i, l) | Concede(O, p(a))
  concede(agent, term) {
    const restaurant = term.match(/([A-Za-z0-9_])+/g)[1];
    const property = term.match(/([A-Za-z0-9])+/g)[0];

    /* GENERAL PRE-CONDITIONS */

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

    /* ADD TERM TO BODY OF AGREED PREFERENCE RULE */
    this.addTermToAgreedPreferenceRule(term);

    /* GENERAL POST-CONDITIONS */

    // Com_ag_i ⇒ Com_ag_i ∪ l
    if (!agent.commitmentStore.includes(term)) {
      agent.commitmentStore += `${term}\n`;
    }

    /* TYPE-SPECIFIC POST-CONDITIONS */

    // Com_O ⇒ Com_O ∪ p(X) ∈ B, where B is the set of terms in the body of the agreed preference rule
    for (const line of (agent.knowledgeBase + agent.commitmentStore).split('\n')) {
      if (new RegExp('^' + property + '\\(X(?=\\)|,[A-Z]|,' + term.match(/([A-Za-z0-9_])+/g)[2] + ')').test(line)) {
        if (!agent.commitmentStore.includes(line)) {
          agent.commitmentStore += `${line}\n`;
        }
      }
    }

    /* UPDATE DIALOGUE TEXT AND UPDATE COMMITMENT STORE HISTORY */

    if (property !== 'acceptableRestaurant') {
      this.text += `${agent.name}: I accept that ${translate(term)}. We want to to a restaurant with ${translate(term.replace(restaurant, '_'))}.\n`;
    } else {
      this.text += `${agent.name}: I accept that ${translate(term)}.\n`;
    }

    this.saveCommitmentStores();
  }

  // Concede-Since(ag_i, g(a), p(a))
  concedeSince(agent, term, justifications) {
    let justificationsAsOneString = '';

    for (const justification of justifications) {
      justificationsAsOneString += `${justification}\n`;
    }

    /* TYPE-SPECIFIC PRE-CONDITIONS */

    // demo(∏_ag_i ∪ Com_ag_i ∪ p(a), g(a))
    const prologSession = pl.create();
    prologSession.consult(agent.knowledgeBase + agent.commitmentStore + justificationsAsOneString);
    prologSession.query(term);
    prologSession.answer(x => {
      if (pl.format_answer(x) !== 'true ;') {
        throw new Error(`Pre-conditions of ${agent.name} conceding to and offering reasoning for "${translate(term)}" are not satisfied because ` +
          `the agent cannot demonstrate the claim through their knowledge base, commitment store, and the justifications!`);
      }
    });

    // p(a) ∈ Com_ag_j for some ag_j ≠ ag_i
    let doesAppearGlobally = false;

    for (const someAgent of this.agents) {
      let doesAppearLocally = true;

      for (const justification of justifications) {
        if (someAgent !== agent && !someAgent.commitmentStore.includes(justification)) {
          doesAppearLocally = false;
        }
      }

      if (someAgent !== agent && doesAppearLocally === true) {
        doesAppearGlobally = true;
      }
    }

    if (doesAppearGlobally === false) {
      throw new Error(`Pre-conditions of ${agent.name} conceding to and offering reasoning for "${translate(term)}" are not satisfied because ` +
        `no other agent's commitment store contains the justifications!`);
    }

    /* ADD JUSTIFICATIONS TO BODY OF AGREED PREFERENCE RULE */

    for (const justification of justifications) {
      this.addTermToAgreedPreferenceRule(justification);
    }

    /* TYPE-SPECIFIC POST-CONDITIONS */

    // Com_ag_i ⇒ Com_ag_i ∪ p(a)
    for (const justification of justifications) {
      if (!agent.commitmentStore.includes(justification)) {
        agent.commitmentStore += `${justification}\n`;
      }
    }

    // Com_O ⇒ Com_O ∪ p(X) ∈ B, where B is the set of terms in the body of the agreed preference rule
    for (const justification of justifications) {
      for (const line of (agent.knowledgeBase + agent.commitmentStore).split('\n')) {
        if (new RegExp('^' + justification.match(/([A-Za-z0-9_])+/g)[0] + '\\(X(?=\\)|,[A-Z]|,' + justification.match(/([A-Za-z0-9_])+/g)[2] + ')').test(line)) {
          if (!agent.commitmentStore.includes(line)) {
            agent.commitmentStore += `${line}\n`;
          }
        }
      }
    }

    this.text += `${agent.name}: Since ${format(justifications)}, that makes ${decamelise(term.match(/([A-Za-z0-9])+/g)[1])} an acceptable restaurant. `;

    const uninstatitatedJustifications = [];

    for (let i = 0; i < justifications.length; i++) {
      uninstatitatedJustifications.push(justifications[i].replace(justifications[i].match(/([A-Za-z0-9])+/g)[1], '_'));
    }

    this.text += `We want to go to a restaurant with ${format(uninstatitatedJustifications)}.\n`;
    this.saveCommitmentStores();
  }
}

export default DeliberationDialogue;
