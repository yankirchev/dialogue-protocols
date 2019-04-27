import Agent from './Agent';
import PersuasionDialogue from './PersuasionDialogue';
import DeliberationDialogue from './DeliberationDialogue';

import generalKnowledgeBase from './utils/generalKnowledgeBase';
import { camelise, decamelise } from './utils/helper';

class Simulation {
  constructor(agentNames, restaurantNames, restaurantCuisines, beverage) {
    this.agentNames = agentNames;
    this.restaurantNames = restaurantNames;
    this.restaurantCuisines = restaurantCuisines;
    this.beverage = beverage;
    this.generalKnowledgeBase = generalKnowledgeBase
      .replace(/restaurantOne/g, camelise(restaurantNames[0]))
      .replace(/restaurantTwo/g, camelise(restaurantNames[1]))
      .replace(/restaurantThree/g, camelise(restaurantNames[2]))
      .replace(/cuisineOne/g, camelise(restaurantCuisines[0]))
      .replace(/cuisineTwo/g, camelise(restaurantCuisines[1]))
      .replace(/cuisineThree/g, camelise(restaurantCuisines[2]))
      .replace(/beverage/g, camelise(beverage));

    this.persuasionDialogue = this.simulatePersuasionDialogue();
    this.deliberationDialogue = this.simulateDeliberationDialogue();
  }

  simulatePersuasionDialogue() {
    let knowledgeBaseOne = '', knowledgeBaseTwo = '', knowledgeBaseThree = '';

    for (const [index, line] of this.generalKnowledgeBase.split('\n').entries()) {
      if ([15, 23, 24, 6, 18, 19, 29].includes(index)) {
        knowledgeBaseOne += `${line}\n`;
      }

      if ([8, 9, 16, 22, 25, 6, 7, 20, 21, 28, 36, 30].includes(index)) {
        knowledgeBaseTwo += `${line}\n`;
      }

      if ([1, 26, 6, 28, 36, 31].includes(index)) {
        knowledgeBaseThree += `${line}\n`;
      }
    }

    const persuasionDialogue = new PersuasionDialogue([
      new Agent(this.agentNames[0], camelise(this.restaurantNames[0]), knowledgeBaseOne),
      new Agent(this.agentNames[1], camelise(this.restaurantNames[1]), knowledgeBaseTwo),
      new Agent(this.agentNames[2], camelise(this.restaurantNames[2]), knowledgeBaseThree)
    ], 1);

    persuasionDialogue.claim(persuasionDialogue.agents[1], `acceptableRestaurant(${camelise(this.restaurantNames[1])}).`);
    persuasionDialogue.claim(persuasionDialogue.agents[1], `cuisine(${camelise(this.restaurantNames[1])},${camelise(this.restaurantCuisines[1])}).`);
    persuasionDialogue.counterclaim(persuasionDialogue.agents[2], `distance(${camelise(this.restaurantNames[1])},10,_).`);
    persuasionDialogue.claim(persuasionDialogue.agents[1], `quality(${camelise(this.restaurantNames[1])},good).`);
    persuasionDialogue.claim(persuasionDialogue.agents[2], `recommended(${camelise(this.restaurantNames[2])},students).`);
    persuasionDialogue.question(persuasionDialogue.agents[2], `quality(${camelise(this.restaurantNames[2])},good).`);
    persuasionDialogue.concede(persuasionDialogue.agents[1], `recommended(${camelise(this.restaurantNames[2])},students).`);
    persuasionDialogue.counterclaim(persuasionDialogue.agents[1], `quality(${camelise(this.restaurantNames[2])},poor).`);
    persuasionDialogue.claim(persuasionDialogue.agents[0], `quality(${camelise(this.restaurantNames[0])},good).`);
    persuasionDialogue.claim(persuasionDialogue.agents[0], `healthy(${camelise(this.restaurantNames[0])}).`);
    persuasionDialogue.claim(persuasionDialogue.agents[1], `healthy(${camelise(this.restaurantNames[1])}).`);
    persuasionDialogue.claim(persuasionDialogue.agents[1], `price(${camelise(this.restaurantNames[1])},15).`);
    persuasionDialogue.counterclaim(persuasionDialogue.agents[1], `price(${camelise(this.restaurantNames[0])},25).`);
    persuasionDialogue.counterclaim(persuasionDialogue.agents[2], `distance(${camelise(this.restaurantNames[1])},_,10).`);
    persuasionDialogue.concede(persuasionDialogue.agents[1], `distance(${camelise(this.restaurantNames[1])},_,10).`);
    persuasionDialogue.counterclaim(persuasionDialogue.agents[1], `\\+(cheaper(${camelise(this.restaurantNames[0])},${camelise(this.restaurantNames[1])})).`);
    persuasionDialogue.concede(persuasionDialogue.agents[2], `acceptableRestaurant(${camelise(this.restaurantNames[1])}).`);
    persuasionDialogue.concede(persuasionDialogue.agents[0], `acceptableRestaurant(${camelise(this.restaurantNames[1])}).`);

    persuasionDialogue.text = persuasionDialogue.text
      .replace(new RegExp(decamelise(camelise(this.restaurantNames[0])), 'gi'), this.restaurantNames[0])
      .replace(new RegExp(decamelise(camelise(this.restaurantNames[1])), 'gi'), this.restaurantNames[1])
      .replace(new RegExp(decamelise(camelise(this.restaurantNames[2])), 'gi'), this.restaurantNames[2])
      .replace(new RegExp(this.restaurantCuisines[0], 'gi'), this.restaurantCuisines[0])
      .replace(new RegExp(this.restaurantCuisines[1], 'gi'), this.restaurantCuisines[1])
      .replace(new RegExp(this.restaurantCuisines[2], 'gi'), this.restaurantCuisines[2]);

    if (persuasionDialogue.isOver()) {
      return persuasionDialogue;
    } else {
      throw new Error('Persuasion dialogue has not reached an end state!');
    }
  }

  simulateDeliberationDialogue() {
    let knowledgeBaseOne = '', knowledgeBaseTwo = '', knowledgeBaseThree = '';

    for (const [index, line] of this.generalKnowledgeBase.split('\n').entries()) {
      if ([0, 11, 13, 15, 23, 24, 6, 18, 19, 29, 33].includes(index)) {
        knowledgeBaseOne += `${line}\n`;
      }

      if ([12, 13, 14, 15, 16, 22, 25, 6, 18, 19, 20, 21, 30, 34].includes(index)) {
        knowledgeBaseTwo += `${line}\n`;
      }

      if ([1, 2, 8, 10, 23, 26, 6, 28, 36, 31, 35].includes(index)) {
        knowledgeBaseThree += `${line}\n`;
      }
    }

    const deliberationDialogue = new DeliberationDialogue([
      new Agent(this.agentNames[0], camelise(this.restaurantNames[0]), knowledgeBaseOne),
      new Agent(this.agentNames[1], camelise(this.restaurantNames[1]), knowledgeBaseTwo),
      new Agent(this.agentNames[2], camelise(this.restaurantNames[2]), knowledgeBaseThree)
    ]);

    deliberationDialogue.claim(deliberationDialogue.agents[1], `cuisine(${camelise(this.restaurantNames[1])},${camelise(this.restaurantCuisines[1])}).`);
    deliberationDialogue.counterclaim(deliberationDialogue.agents[2], `distance(${camelise(this.restaurantNames[1])},10,_).`);
    deliberationDialogue.claim(deliberationDialogue.agents[2], `distance(${camelise(this.restaurantNames[2])},1,0).`);
    deliberationDialogue.claim(deliberationDialogue.agents[0], `distance(${camelise(this.restaurantNames[0])},_,0).`);
    deliberationDialogue.claim(deliberationDialogue.agents[0], `quality(${camelise(this.restaurantNames[0])},good).`);
    deliberationDialogue.counterclaim(deliberationDialogue.agents[2], `price(${camelise(this.restaurantNames[0])},25).`);
    deliberationDialogue.claim(deliberationDialogue.agents[2], `price(${camelise(this.restaurantNames[2])},7).`);
    deliberationDialogue.counterclaim(deliberationDialogue.agents[1], `\\+(${camelise(this.beverage)}(${camelise(this.restaurantNames[2])})).`);
    deliberationDialogue.claim(deliberationDialogue.agents[1], `${camelise(this.beverage)}(${camelise(this.restaurantNames[1])}).`);
    deliberationDialogue.counterclaim(deliberationDialogue.agents[0], `\\+(atmosphere(${camelise(this.restaurantNames[2])})).`);
    deliberationDialogue.claim(deliberationDialogue.agents[0], `atmosphere(${camelise(this.restaurantNames[0])}).`);
    deliberationDialogue.claim(deliberationDialogue.agents[1], `atmosphere(${camelise(this.restaurantNames[1])}).`);
    deliberationDialogue.claim(deliberationDialogue.agents[1], `quality(${camelise(this.restaurantNames[1])},good).`);
    deliberationDialogue.counterclaim(deliberationDialogue.agents[2], `distance(${camelise(this.restaurantNames[1])},_,10).`);
    deliberationDialogue.claim(deliberationDialogue.agents[1], `healthy(${camelise(this.restaurantNames[1])}).`);
    deliberationDialogue.claim(deliberationDialogue.agents[0], `healthy(${camelise(this.restaurantNames[0])}).`);
    deliberationDialogue.concedeSince(deliberationDialogue.agents[1], `acceptableRestaurant(${camelise(this.restaurantNames[0])}).`, [`quality(${camelise(this.restaurantNames[0])},good).`, `atmosphere(${camelise(this.restaurantNames[0])}).`]);
    deliberationDialogue.concedeSince(deliberationDialogue.agents[2], `acceptableRestaurant(${camelise(this.restaurantNames[1])}).`, [`quality(${camelise(this.restaurantNames[1])},good).`, `atmosphere(${camelise(this.restaurantNames[1])}).`]);
    deliberationDialogue.concede(deliberationDialogue.agents[0], `${camelise(this.beverage)}(${camelise(this.restaurantNames[1])}).`);
    deliberationDialogue.claim(deliberationDialogue.agents[0], `${camelise(this.beverage)}(${camelise(this.restaurantNames[0])}).`);
    deliberationDialogue.concedeSince(deliberationDialogue.agents[1], `acceptableRestaurant(${camelise(this.restaurantNames[0])}).`, [`distance(${camelise(this.restaurantNames[0])},_,0).`]);
    deliberationDialogue.concede(deliberationDialogue.agents[2], `acceptableRestaurant(${camelise(this.restaurantNames[0])}).`);
    deliberationDialogue.concede(deliberationDialogue.agents[1], `acceptableRestaurant(${camelise(this.restaurantNames[0])}).`);

    deliberationDialogue.text = deliberationDialogue.text
      .replace(new RegExp(decamelise(camelise(this.restaurantNames[0])), 'gi'), this.restaurantNames[0])
      .replace(new RegExp(decamelise(camelise(this.restaurantNames[1])), 'gi'), this.restaurantNames[1])
      .replace(new RegExp(decamelise(camelise(this.restaurantNames[2])), 'gi'), this.restaurantNames[2])
      .replace(new RegExp(this.restaurantCuisines[0], 'gi'), this.restaurantCuisines[0])
      .replace(new RegExp(this.restaurantCuisines[1], 'gi'), this.restaurantCuisines[1])
      .replace(new RegExp(this.restaurantCuisines[2], 'gi'), this.restaurantCuisines[2]);

    if (deliberationDialogue.isOver()) {
      return deliberationDialogue;
    } else {
      throw new Error('Deliberation dialogue has not reached an end state!');
    }
  }
}

export default Simulation;
