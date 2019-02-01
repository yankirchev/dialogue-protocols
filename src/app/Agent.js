class Agent {
  commitmentStore = '';

  constructor(name, knowledgeBase, preferenceRule) {
    this.name = name;
    this.knowledgeBase = knowledgeBase;
    this.preferenceRule = preferenceRule;
  }
}

export default Agent;
