class Agent {
  constructor(name, initialPreference, knowledgeBase) {
    this.commitmentDependencies = '';
    this.commitmentStore = '';
    this.initialPreference = initialPreference;
    this.knowledgeBase = knowledgeBase;
    this.name = name;
  }
}

export default Agent;
