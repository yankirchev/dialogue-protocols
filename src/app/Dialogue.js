import Agent from "./Agent";
import { translateTerm } from "./helper";

class Dialogue {
  agents = [Agent];
  text = "";
  commitmentStoreHistory = [[]];

  constructor() {
    if (new.target === Dialogue) {
      throw new TypeError("Cannot construct Dialogue instances directly!");
    }
  }

  saveCommitmentStores() {
    const newCommitmentStoresRecord = [];

    for (const agent in this.agents) {
      newCommitmentStoresRecord.push(agent.commitmentStore);
    }

    this.commitmentStoreHistory.push(newCommitmentStoresRecord);
  }

  claim(agent, term) {

  }

  why(agent, term) {

  }

  concede(agent, term) {

  }

  retract(agent, term) {

  }

  since(agent, term) {

  }

  question(agent, term) {

  }
}

translateTerm("");

export default Dialogue;
