import pl from 'tau-prolog';

import Dialogue from './Dialogue';
import { translate } from './helper';

class PersuasionDialogue extends Dialogue {
  constructor(agents, proponentIndex) {
    super(agents);

    this.proponent = agents[proponentIndex];
  }

  // (Counter)Claim(ag_i, l) | (Counter)Claim(O, p(a))
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

    if (agent !== this.proponent) {
      if (!this.isPreferred(agent, restaurant)) {
        // for some agent ag_j ≠ O, preferable(ag_j, a)
        let isPreferredByAnotherAgent = false;

        for (const otherAgent of this.agents) {
          if (otherAgent !== agent && this.isPreferred(otherAgent, restaurant)) {
            isPreferredByAnotherAgent = true;
          }
        }

        if (!isPreferredByAnotherAgent) {
          throw new Error(`Pre-conditions of ${agent.name} claiming "${translate(term)}" are not satisfied because ` +
            `the restaurant is not preferred by any other agent!`);
        }
      }

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

      if (!termsToCheck.includes(property)) {
        throw new Error(`Pre-conditions of ${agent.name} claiming "${translate(term)}" are not satisfied because ` +
          `the claim does not correspond to a feature in the body of the agent's preference rule!`);
      }
    }

    /* GENERAL POST-CONDITIONS */

    // Com_ag_i ⇒ Com_ag_i ∪ l
    agent.commitmentStore += `${term}\n`;

    /* TYPE-SPECIFIC POST-CONDITIONS */

    if (agent !== this.proponent) {
      if (this.isPreferred(agent, restaurant)) {
        // Com_O ⇒ Com_O ∪ acceptableRestaurant(a) iff demo(∏_O ∪ Com_O, acceptableRestaurant(a))
        prologSession.query(`acceptableRestaurant(${restaurant}).`);
        prologSession.answer(x => {
          if (pl.format_answer(x) === 'true ;' && !agent.commitmentStore.includes(`acceptableRestaurant(${restaurant}).`))
            agent.commitmentStore += `acceptableRestaurant(${restaurant}).\n`;
        });
      }

      // Com_O ⇒ Com_O ∪ (p(X) ∈ B), where B is the set of terms in the body of the preference rule of O
      let termsToAdd = [];

      for (const line of (agent.knowledgeBase + agent.commitmentStore).split('\n')) {
        if (new RegExp('^' + property + '\\(X(?=\\)|,[A-Z]|,' + term.match(/([A-Za-z0-9_])+/g)[2] + ')').test(line)) {
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

    if (this.isPreferred(agent, restaurant))
      this.text += `${agent.name}: ${translate(term)}.\n`
    else
      this.text += `${agent.name}: But ${translate(term)}.\n`

    this.saveCommitmentStores();
  }

  // Concede(ag_i, l) | Concede(O, p(a))
  concede(agent, term) {
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
    if (term.includes('\\+(') && (agent.commitmentStore.includes(`${term.substring(3, term.length - 2)}.`))) {
      throw new Error(`Pre-conditions of ${agent.name} conceding to "${translate(term)}" are not satisfied because ` +
        `the agent's commitment store contains the negation of the claim!`);
    } else if (agent.commitmentStore.includes(`\\+(${term.substring(0, term.length - 1)}).`)) {
      throw new Error(`Pre-conditions of ${agent.name} conceding to "${translate(term)}" are not satisfied because ` +
        `the agent's commitment store contains the negation of the claim!`);
    }

    /* TYPE-SPECIFIC PRE-CONDITIONS */

    if (agent !== this.proponent) {
      // p(X) ∈ B, where B is the set of terms in the body of the preference rule of O
      let termsToCheck = ['acceptableRestaurant'];

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

      if (!termsToCheck.includes(property)) {
        throw new Error(`Pre-conditions of ${agent.name} conceding to "${translate(term)}" are not satisfied because ` +
          `the claim does not correspond to a feature in the body of the agent's preference rule!`);
      }
    }

    /* GENERAL POST-CONDITIONS */

    // Com_ag_i ⇒ Com_ag_i ∪ l
    if (!agent.commitmentStore.includes(term)) {
      agent.commitmentStore += `${term}\n`;
    }

    /* TYPE-SPECIFIC POST-CONDITIONS */

    if (agent !== this.proponent) {
      // Com_O ⇒ Com_O ∪ (p(X) ∈ B), where B is the set of terms in the body of the preference rule of O
      let termsToAdd = [];

      for (const line of (agent.knowledgeBase + agent.commitmentStore).split('\n')) {
        if (new RegExp('^' + property + '\\(X(?=\\)|,[A-Z]|,' + term.match(/([A-Za-z0-9_])+/g)[2] + ')').test(line)) {
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

    this.text += `${agent.name}: I accept that ${translate(term)}.\n`
    this.saveCommitmentStores();
  }

  // Question(ag_i, l) | Question(O,p(a))
  question(agent, term) {
    const property = term.match(/([A-Za-z0-9])+/g)[0];

    /* GENERAL PRE-CONDITIONS */

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

    /* TYPE-SPECIFIC PRE-CONDITIONS */

    if (agent !== this.proponent) {
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

      if (!termsToCheck.includes(property)) {
        throw new Error(`Pre-conditions of ${agent.name} questioning "${translate(term)}" are not satisfied because ` +
          `the claim does not correspond to a feature in the body of the agent's preference rule!`);
      }
    }

    /* TYPE-SPECIFIC POST-CONDITIONS */

    if (agent !== this.proponent) {
      // Com_O ⇒ Com_O ∪ (p(X) ∈ B), where B is the set of terms in the body of the preference rule of O
      let termsToAdd = [];

      for (const line of (agent.knowledgeBase + agent.commitmentStore).split('\n')) {
        if (new RegExp('^' + property + '\\(X(?=\\)|,[A-Z]|,' + term.match(/([A-Za-z0-9_])+/g)[2] + ')').test(line)) {
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

    this.text += `${agent.name}: I wonder if ${translate(term)}.\n`
    this.saveCommitmentStores();
  }
}

export default PersuasionDialogue;
