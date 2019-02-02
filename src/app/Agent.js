class Agent {
  constructor(name, knowledgeBase, preferenceRule) {
    this.commitmentStore = '';
    this.name = name;
    this.knowledgeBase = knowledgeBase;
    this.preferenceRule = preferenceRule;
  }
}

export default Agent;
