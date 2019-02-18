import pl from 'tau-prolog';

import Dialogue from './Dialogue';
import { format, translate } from './helper';

class DeliberationDialogue extends Dialogue {
  constructor(agents) {
    super(agents);

    this.agreedPreferenceRule = 'acceptableRestaurant(X):-';
  }

  // Claim(ag_i, l) | Claim(O, p(a))
  claim(agent, term) {
    /* GENERAL PRE-CONDITIONS */

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

    /*  TYPE-SPECIFIC PRE-CONDITIONS */

    const atom = term.match(/([A-Za-z0-9_])+/g)[1];
    const predicate = term.match(/([A-Za-z0-9_])+/g)[0];

    // demo(∏_O ∪ Com_O, acceptableRestaurant(a))
    prologSession.query(`acceptableRestaurant(${atom}).`);
    prologSession.answer(x => {
      if (pl.format_answer(x) !== 'true ;') {
        throw new Error(`Pre-conditions of ${agent.name} claiming "${translate(term)}" are not satisfied because ` +
          `the agent cannot demonstrate "${translate(`acceptableRestaurant(${atom}).`)}" through their knowledge base and/or commitment store!`);
      }
    });

    // p(X) ∈ B, where B is the set of terms in the body of the preference rule of O
    let termsToCheck = [];

    for (const line of agent.knowledgeBase.split('\n')) {
      if (/^acceptableRestaurant\(X/.test(line)) {
        for (const match of line.match(/(?<=,|-|, \()([A-Za-z0-9])+(?=\()/g)) {
          if (!termsToCheck.includes(match)) {
            termsToCheck.push(match);
          }
        }
      }
    }

    for (let i = 0; i < termsToCheck.length; i++) {
      for (const line of agent.knowledgeBase.split('\n')) {
        if (new RegExp('^' + termsToCheck[i] + '\\(X').test(line)) {
          for (const match of line.match(/(?<=,|-|, \()([A-Za-z0-9])+(?=\()/g)) {
            if (!termsToCheck.includes(match)) {
              termsToCheck.push(match);
            }
          }
        }
      }
    }

    if (!termsToCheck.includes(predicate)) {
      throw new Error(`Pre-conditions of ${agent.name} claiming "${translate(term)}" are not satisfied because ` +
        `the claim does not correspond to a feature in the body of the agent's preference rule!`);
    }

    /* GENERAL POST-CONDITIONS */

    // Com_ag_i ⇒ Com_ag_i ∪ l
    agent.commitmentStore += `${term}\n`;

    /* TYPE-SPECIFIC POST-CONDITIONS */

    // Com_O ⇒ Com_O ∪ acceptableRestaurant(a)
    if (!agent.commitmentStore.includes(`acceptableRestaurant(${atom}).`))
      agent.commitmentStore += `acceptableRestaurant(${atom}).\n`;

    // Com_O ⇒ Com_O ∪ (p(X) ∈ B), where B is the set of terms in the body of the preference rule of O
    let termsToAdd = [];

    for (const line of (agent.knowledgeBase + agent.commitmentStore).split('\n')) {
      if (new RegExp('^' + predicate + '\\(X(?=\\)|,[A-Z]|,' + term.match(/([A-Za-z0-9_])+/g)[2] + ')').test(line)) {
        if (!agent.commitmentStore.includes(line))
          agent.commitmentStore += `${line}\n`;

        termsToAdd = termsToAdd.concat(line.match(/(?<=,|-|, \()([A-Za-z0-9])+(?=\()/g));
      }
    }

    for (let i = 0; i < termsToAdd.length; i++) {
      for (const line of agent.knowledgeBase.split('\n')) {
        if (new RegExp('^' + termsToAdd[i] + '\\(').test(line)) {
          if (line.match(/(?<=,|-|, \()([A-Za-z0-9])+(?=\()/g)) {
            for (const match of line.match(/(?<=,|-|, \()([A-Za-z0-9])+(?=\()/g)) {
              if (!termsToAdd.includes(match))
                termsToAdd.push(match);
            }
          }

          if (!agent.commitmentDependencies.includes(line))
            agent.commitmentDependencies += `${line}\n`;
        }
      }
    }

    /* UPDATE DIALOGUE TEXT AND SAVE COMMITMENT STORE HISTORY */

    this.text += `${agent.name}: ${translate(term)}.\n`
    this.saveCommitmentStores();
  }

  // Since(ag_i, l, ∏) | Since(O, g(a), p(a))
  since(agent, otherAgent, term, justifications) {
    /* GENERAL PRE-CONDITIONS */

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
    prologSession.consult(justificationsInPrologFormat + otherAgent.commitmentStore + otherAgent.commitmentDependencies);
    prologSession.query(term);
    prologSession.answer(x => {
      if (pl.format_answer(x) !== 'true ;') {
        throw new Error(`Pre-conditions of ${agent.name} offering reasoning for "${translate(term)}" are not satisfied because ` +
          `${otherAgent.name} cannot demonstrate the claim through the justifications and their commitment store!`);
      }
    });

    /* TYPE-SPECIFIC PRE-CONDITIONS */

    // demo(∏_ag_i ∪ Com_ag_i ∪ p(a), g(a))
    prologSession.consult(agent.knowledgeBase + agent.commitmentStore + justificationsInPrologFormat);
    prologSession.query(term);
    prologSession.answer(x => {
      if (pl.format_answer(x) !== 'true ;') {
        throw new Error(`Pre-conditions of ${agent.name} offering reasoning for "${translate(term)}" are not satisfied because ` +
          `the agent cannot demonstrate the claim through their knowledge base, commitment store, and/or the justifications!`);
      }
    });

    // p(a) ∈ Com_ag_j for some ag_j ≠ ag_i
    let doesAppearGlobally = false;

    for (const someAgent of this.agents) {
      let doesAppearLocally = true;

      for (const justification of justifications) {
        if (someAgent !== agent && !someAgent.commitmentStore.includes(justification))
          doesAppearLocally = false;
      }

      if (doesAppearLocally === true)
        doesAppearGlobally = true;
    }

    if (doesAppearGlobally === false) {
      throw new Error(`Pre-conditions of ${agent.name} offering reasoning for "${translate(term)}" are not satisfied because ` +
        `no other agent's commitment store contains the justifications!`);
    }

    /* ADD JUSTIFICATIONS TO BODY OF AGREED PREFERENCE RULE */

    for (const justification of justifications) {
      this.agreedPreferenceRule += `${justification.substring(0, justification.length - 1).replace(justification.match(/([A-Za-z0-9_])+/g)[1], 'X')},`;
    }

    /* GENERAL POST-CONDITIONS */

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

    /* TYPE-SPECIFIC POST-CONDITIONS */

    // Com_O ⇒ Com_O ∪ p(X) ∈ B, where B is the set of terms in the body of the agreed preference rule
    for (const justification of justifications) {
      let termsToAdd = [];

      for (const line of (agent.knowledgeBase + agent.commitmentStore).split('\n')) {
        if (new RegExp('^' + justification.match(/([A-Za-z0-9_])+/g)[0] + '\\(X(?=\\)|,[A-Z]|,' + justification.match(/([A-Za-z0-9_])+/g)[2] + ')').test(line)) {
          if (!agent.commitmentStore.includes(line))
            agent.commitmentStore += `${line}\n`;

          termsToAdd = termsToAdd.concat(line.match(/(?<=,|-|, \()([A-Za-z0-9])+(?=\()/g));
        }
      }

      for (let i = 0; i < termsToAdd.length; i++) {
        for (const line of agent.knowledgeBase.split('\n')) {
          if (new RegExp('^' + termsToAdd[i] + '\\(').test(line)) {
            if (line.match(/(?<=,|-|, \()([A-Za-z0-9])+(?=\()/g)) {
              for (const match of line.match(/(?<=,|-|, \()([A-Za-z0-9])+(?=\()/g)) {
                if (!termsToAdd.includes(match))
                  termsToAdd.push(match);
              }
            }

            if (!agent.commitmentDependencies.includes(line))
              agent.commitmentDependencies += `${line}\n`;
          }
        }
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

  // Concede(ag_i, l) | Concede(O, p(a))
  concede(agent, term) {
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
    if (term.includes('\\+(') && (agent.commitmentStore.includes(`${term.substring(3, term.length - 2)}.`))) {
      throw new Error(`Pre-conditions of ${agent.name} conceding to "${translate(term)}" are not satisfied because ` +
        `the agent's commitment store contains the negation of the claim!`);
    } else if (agent.commitmentStore.includes(`\\+(${term.substring(0, term.length - 1)}).`)) {
      throw new Error(`Pre-conditions of ${agent.name} conceding to "${translate(term)}" are not satisfied because ` +
        `the agent's commitment store contains the negation of the claim!`);
    }

    /* ADD TERM TO BODY OF AGREED PREFERENCE RULE */

    this.agreedPreferenceRule += `${term.substring(0, term.length - 1).replace(term.match(/([A-Za-z0-9_])+/g)[1], 'X')},`;

    /* GENERAL POST-CONDITIONS */

    // Com_ag_i ⇒ Com_ag_i ∪ l
    if (!agent.commitmentStore.includes(term)) {
      agent.commitmentStore += `${term}\n`;
    }

    /* TYPE-SPECIFIC POST-CONDITIONS */

    // Com_O ⇒ Com_O ∪ p(X) ∈ B, where B is the set of terms in the body of the agreed preference rule
    let termsToAdd = [];

    for (const line of (agent.knowledgeBase + agent.commitmentStore).split('\n')) {
      if (new RegExp('^' + term.match(/([A-Za-z0-9_])+/g)[0] + '\\(X(?=\\)|,[A-Z]|,' + term.match(/([A-Za-z0-9_])+/g)[2] + ')').test(line)) {
        if (!agent.commitmentStore.includes(line))
          agent.commitmentStore += `${line}\n`;

        termsToAdd = termsToAdd.concat(line.match(/(?<=,|-|, \()([A-Za-z0-9])+(?=\()/g));
      }
    }

    for (let i = 0; i < termsToAdd.length; i++) {
      for (const line of agent.knowledgeBase.split('\n')) {
        if (new RegExp('^' + termsToAdd[i] + '\\(').test(line)) {
          if (line.match(/(?<=,|-|, \()([A-Za-z0-9])+(?=\()/g)) {
            for (const match of line.match(/(?<=,|-|, \()([A-Za-z0-9])+(?=\()/g)) {
              if (!termsToAdd.includes(match))
                termsToAdd.push(match);
            }
          }

          if (!agent.commitmentDependencies.includes(line))
            agent.commitmentDependencies += `${line}\n`;
        }
      }
    }

    /* UPDATE DIALOGUE TEXT AND SAVE COMMITMENT STORE HISTORY */

    this.text += `${agent.name}: I accept that ${translate(term)}.\n`
    this.saveCommitmentStores();
  }
}

export default DeliberationDialogue;
