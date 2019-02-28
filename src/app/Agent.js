import pl from 'tau-prolog';

class Agent {
  constructor(name, initialPreference, knowledgeBase) {
    this.name = name;
    this.initialPreference = initialPreference;
    this.knowledgeBase = knowledgeBase;
    this.commitmentStore = '';
    this.commitmentDependencies = '';
  }

  doesPrefer(restaurant) {
    const preferredRestaurants = [this.initialPreference];

    const prologSession = pl.create();
    prologSession.consult(this.knowledgeBase + this.commitmentStore);
    prologSession.query('acceptableRestaurant(X).');
    prologSession.answers(x => {
      preferredRestaurants.push(pl.format_answer(x).split(" ")[2]);
    });

    return preferredRestaurants.includes(restaurant);
  }
}

export default Agent;
