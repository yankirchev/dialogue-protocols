import Agent from '../../Agent';
import PersuasionDialogue from '../../PersuasionDialogue';
import DeliberationDialogue from '../../DeliberationDialogue';

import generalKnowledgeBase from '../../utils/generalKnowledgeBase';

function createPersuasionDialogue(agentThreesInitialPreference) {
  let knowledgeBaseOne = '', knowledgeBaseTwo = '', knowledgeBaseThree = '';

  for (const [index, line] of generalKnowledgeBase.split('\n').entries()) {
    if ([11, 15, 23, 24, 6, 18, 19, 29].includes(index)) {
      knowledgeBaseOne += `${line}\n`;
    }

    if ([8, 9, 16, 22, 25, 26, 6, 7, 20, 21, 28, 36, 30].includes(index)) {
      knowledgeBaseTwo += `${line}\n`;
    }

    if ([1, 26, 6, 7, 28, 36, 31].includes(index)) {
      knowledgeBaseThree += `${line}\n`;
    }
  }

  return new PersuasionDialogue([
    new Agent('agent one', 'restaurantOne', knowledgeBaseOne),
    new Agent('agent two', 'restaurantTwo', knowledgeBaseTwo),
    new Agent('agent three', agentThreesInitialPreference ? agentThreesInitialPreference : 'restaurantThree', knowledgeBaseThree)
  ], 1);
}

function createDeliberationDialogue(agentThreesInitialPreference) {
  let knowledgeBaseOne = '', knowledgeBaseTwo = '', knowledgeBaseThree = '';

  for (const [index, line] of generalKnowledgeBase.split('\n').entries()) {
    if ([0, 11, 13, 15, 23, 24, 6, 18, 19, 29, 33].includes(index)) {
      knowledgeBaseOne += `${line}\n`;
    }

    if ([8, 12, 13, 14, 15, 16, 22, 25, 26, 7, 6, 18, 19, 20, 21, 30, 34].includes(index)) {
      knowledgeBaseTwo += `${line}\n`;
    }

    if ([1, 2, 8, 10, 23, 26, 6, 7, 28, 36, 31, 35].includes(index)) {
      knowledgeBaseThree += `${line}\n`;
    }
  }

  return new DeliberationDialogue([
    new Agent('agent one', 'restaurantOne', knowledgeBaseOne),
    new Agent('agent two', 'restaurantTwo', knowledgeBaseTwo),
    new Agent('agent three', agentThreesInitialPreference ? agentThreesInitialPreference : 'restaurantThree', knowledgeBaseThree)
  ]);
}

export {
  createPersuasionDialogue,
  createDeliberationDialogue
};
