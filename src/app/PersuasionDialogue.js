import pl from 'tau-prolog';

import Dialogue from './Dialogue';
import { decamelise, translate } from './helper';

class PersuasionDialogue extends Dialogue {
  constructor(agents, indexOfProponent) {
    super(agents);

    this.proponent = agents[indexOfProponent];
  }

  // Claim(ag_i, l) | Claim(O, p(a))
  claim(agent, term) {
    /* GENERAL PRE-CONDITIONS */

    // demo(∏_􏰖ag_i ∪ Com_ag_i, l)
    const prologSession = pl.create();
    prologSession.consult(agent.knowledgeBase + agent.commitmentStore);
    prologSession.query(term);
    prologSession.answer(x => {
      if (pl.format_answer(x) !== 'true ;') {
        throw new Error(`Pre-conditions of ${agent.name} claiming "${translate(term)}" are not satisfied because ` +
          `the agent cannot demonstrate the claim through their commitment store and/or knowledge base!`);
      }
    });

    // ¬l ∈ Com_ag_j for any ag_j ∈ Ag
    for (const anyAgent of this.agents) {
      if (anyAgent.commitmentStore.includes(term)) {
        throw new Error(`Pre-conditions of ${agent.name} claiming "${translate(term)}" are not satisfied because ` +
          `${anyAgent.name}'s commitment store already contains the claim!`);
      }
    }

    /*  TYPE-SPECIFIC PRE-CONDITIONS */

    if (agent !== this.proponent) {
      const atom = term.match(/([A-Za-z0-9_])+/g)[1];
      const predicate = term.match(/([A-Za-z0-9_])+/g)[0];

      // demo(∏_􏰖O ∪ Com_O, acceptableRestaurant(a))
      prologSession.query(`acceptableRestaurant(${atom}).`);
      prologSession.answer(x => {
        if (pl.format_answer(x) !== 'true ;') {
          throw new Error(`Pre-conditions of ${agent.name} claiming "${translate(term)}" are not satisfied because ` +
            `the agent cannot demonstrate that ${decamelise(atom)} is an acceptable choice through their commitment store and/or knowledge base!`);
        }
      });

      // p(X) ∈ B, where B is the set of terms in the body of the preference rule of O
      let termsToCheck = [];

      for (const line of agent.knowledgeBase.split('\n')) {
        if (new RegExp('^acceptableRestaurant\\(').test(line))
          termsToCheck = termsToCheck.concat(line.match(/(?<=,|-|, \()([A-Za-z0-9])+(?=\()/g));
      }

      for (let i = 0; i < termsToCheck.length; i++) {
        for (const line of agent.knowledgeBase.split('\n')) {
          if (new RegExp('^' + termsToCheck[i] + '\\(').test(line))
            termsToCheck = termsToCheck.concat(line.match(/(?<=,|-|, \()([A-Za-z0-9])+(?=\()/g));

        }
      }

      if (!termsToCheck.includes(predicate)) {
        throw new Error(`Pre-conditions of ${agent.name} claiming "${translate(term)}" are not satisfied because ` +
          `the claim does not correspond to a feature in the body of the agent's preference rule!`);
      }
    }

    /* GENERAL POST-CONDITIONS */

    // Com_ag_i ⇒ Com_ag_i ∪ l
    agent.commitmentStore += `${term}\n`;

    /* TYPE-SPECIFIC POST-CONDITIONS */

    if (agent !== this.proponent) {
      const atom = term.match(/([A-Za-z0-9_])+/g)[1];
      const predicate = term.match(/([A-Za-z0-9_])+/g)[0];

      // Com_O ⇒ Com_O ∪ acceptableRestaurant(a)
      if (!agent.commitmentStore.includes(`acceptableRestaurant(${atom}).`))
        agent.commitmentStore += `acceptableRestaurant(${atom}).\n`;

      // Com_O ⇒ Com_O ∪ (p(X) ∈ B), where B is the set of terms in the body of the preference rule of O
      let termsToAdd = [];

      for (const line of (agent.knowledgeBase + agent.commitmentStore).split('\n')) {
        if (new RegExp('^' + predicate + '\\(').test(line)) {
          if (!agent.commitmentStore.includes(line))
            agent.commitmentStore += `${line}\n`;

          termsToAdd = termsToAdd.concat(line.match(/(?<=,|-|, \()([A-Za-z0-9])+(?=\()/g));
        }
      }

      for (let i = 0; i < termsToAdd.length; i++) {
        for (const line of agent.knowledgeBase.split('\n')) {
          if (new RegExp('^' + termsToAdd[i] + '\\(').test(line)) {
            termsToAdd = termsToAdd.concat(line.match(/(?<=,|-|, \()([A-Za-z0-9])+(?=\()/g));

            if (!agent.commitmentStore.includes(line))
              agent.commitmentStore += `${line}\n`;
          }
        }
      }
    }

    /* UPDATE DIALOGUE TEXT AND SAVE COMMITMENT STORE HISTORY */

    this.text += `${agent.name}: ${translate(term)}.\n`
    this.saveCommitmentStores();
  }

  concede(agent, term) {

  }

  // Question(ag_i, l) | Question(O,p(a))
  question(agent, term) {
    /* GENERAL PRE-CONDITIONS */

    // ∀(ag_j) ∈ Ag, l ∉ Com_ag_j
    for (const anyAgent of this.agents) {
      if (anyAgent.commitmentStore.includes(term)) {
        throw new Error(`Pre-conditions of ${agent.name} questioning "${translate(term)}" are not satisfied because ` +
          `${anyAgent.name}'s commitment store contains the claim!`);
      }
    }

    // not(demo(∏_􏰖ag_i ∪ Com_ag_i, l))
    const prologSession = pl.create();
    prologSession.consult(agent.knowledgeBase + agent.commitmentStore);
    prologSession.query(term);
    prologSession.answer(x => {
      if (pl.format_answer(x) === 'true ;') {
        throw new Error(`Pre-conditions of ${agent.name} questioning "${translate(term)}" are not satisfied because ` +
          `the agent can already demonstrate the claim through their commitment store and/or knowledge base!`);
      }
    });

    /* TYPE-SPECIFIC PRE-CONDITIONS */

    if (agent !== this.proponent) {
      // p(X) ∈ B, where B is the set of terms in the body of the preference rule of O
      let termsToCheck = [];

      for (const line of agent.knowledgeBase.split('\n')) {
        if (new RegExp('^acceptableRestaurant\\(').test(line))
          termsToCheck = termsToCheck.concat(line.match(/(?<=,|-|, \()([A-Za-z0-9])+(?=\()/g));
      }

      for (let i = 0; i < termsToCheck.length; i++) {
        for (const line of agent.knowledgeBase.split('\n')) {
          if (new RegExp('^' + termsToCheck[i] + '\\(').test(line))
            termsToCheck = termsToCheck.concat(line.match(/(?<=,|-|, \()([A-Za-z0-9])+(?=\()/g));

        }
      }

      if (!termsToCheck.includes(term.match(/([A-Za-z0-9_])+/g)[0])) {
        throw new Error(`Pre-conditions of ${agent.name} questioning "${translate(term)}" are not satisfied because ` +
          `the claim does not correspond to a feature in the body of the agent's preference rule!`);
      }
    }

    /* TYPE-SPECIFIC POST-CONDITIONS */

    if (agent !== this.proponent) {
      // Com_O ⇒ Com_O ∪ (p(X) ∈ B), where B is the set of terms in the body of the preference rule of O
      let termsToAdd = [];

      for (const line of (agent.knowledgeBase + agent.commitmentStore).split('\n')) {
        if (new RegExp('^' + term.match(/([A-Za-z0-9_])+/g)[0] + '\\(').test(line)) {
          if (!agent.commitmentStore.includes(line))
            agent.commitmentStore += `${line}\n`;

          termsToAdd = termsToAdd.concat(line.match(/(?<=,|-|, \()([A-Za-z0-9])+(?=\()/g));
        }
      }

      for (let i = 0; i < termsToAdd.length; i++) {
        for (const line of agent.knowledgeBase.split('\n')) {
          if (new RegExp('^' + termsToAdd[i] + '\\(').test(line)) {
            termsToAdd = termsToAdd.concat(line.match(/(?<=,|-|, \()([A-Za-z0-9])+(?=\()/g));

            if (!agent.commitmentStore.includes(line))
              agent.commitmentStore += `${line}\n`;
          }
        }
      }
    }

    /* UPDATE DIALOGUE TEXT AND SAVE COMMITMENT STORE HISTORY */

    this.text += `${agent.name}: I wonder if ${translate(term)}.\n`
    this.saveCommitmentStores();
  }
}

export default PersuasionDialogue;
