class Agent {
  name;
  knowledgeBase;
  commitmentstore = "";

  constructor(name, knowledgeBase) {
    this.name = name;
    this.knowledgeBase = knowledgeBase;
  }
}

export default Agent;
