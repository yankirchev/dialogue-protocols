import { createDeliberationDialogue } from './utils/setup';

describe('Deliberation Dialogue', () => {
  describe('Claim', () => {
    describe('Pre-conditions', () => {
      describe('demo(∏_ag_i ∪ Com_ag_i, l)', () => {
        it('Passes if the agent can demonstrate the claim', () => {
          const deliberationDialogue = createDeliberationDialogue();

          expect(() => {
            deliberationDialogue.claim(deliberationDialogue.agents[1], 'quality(restaurantTwo,good).');
          }).not.toThrow();
        });

        it('Fails if the agent cannot demonstrate the claim', () => {
          const deliberationDialogue = createDeliberationDialogue();

          expect(() => {
            deliberationDialogue.claim(deliberationDialogue.agents[1], 'quality(restaurantOne,poor).');
          }).toThrow('Pre-conditions of agent two claiming "restaurant one has property quality of value poor" are not satisfied because the agent cannot demonstrate the claim through their knowledge base and commitment store!');
        });
      });

      describe('¬l ∈ Com_ag_j for any ag_j ∈ Ag', () => {
        it('Passes if no agent\'s commitment store contains the claim', () => {
          const deliberationDialogue = createDeliberationDialogue();

          expect(() => {
            deliberationDialogue.claim(deliberationDialogue.agents[1], 'quality(restaurantTwo,good).');
          }).not.toThrow();
        });

        it('Fails if some agent\'s commitment store contains the claim', () => {
          const deliberationDialogue = createDeliberationDialogue();
          deliberationDialogue.claim(deliberationDialogue.agents[1], 'quality(restaurantTwo,good).');

          expect(() => {
            deliberationDialogue.claim(deliberationDialogue.agents[1], 'quality(restaurantTwo,good).');
          }).toThrow('Pre-conditions of agent two claiming "restaurant two has property quality of value good" are not satisfied because agent two\'s commitment store contains the claim!');
        });
      });

      describe('p(X) ∈ B, where B is the set of terms in the body of the preference rule of O', () => {
        it('Passes if the claim corresponds to a feature in the body of the agent\'s preference rule', () => {
          const deliberationDialogue = createDeliberationDialogue();

          expect(() => {
            deliberationDialogue.claim(deliberationDialogue.agents[0], 'quality(restaurantOne,good).');
          }).not.toThrow();
        });

        it('Fails if the claim does not correspond to a feature in the body of the agent\'s preference rule', () => {
          const deliberationDialogue = createDeliberationDialogue();

          expect(() => {
            deliberationDialogue.claim(deliberationDialogue.agents[1], 'price(restaurantOne,25).');
          }).toThrow('Pre-conditions of agent two claiming "restaurant one has property price of value 25" are not satisfied because the claim does not correspond to a feature in the body of the agent\'s preference rule!');
        });
      });

      describe('Counterclaim', () => {
        describe('for some agent ag_j ≠ ag_i, preferable(ag_j, a)', () => {
          it('Passes if the restaurant is preferable to some other agent', () => {
            const deliberationDialogue = createDeliberationDialogue();

            expect(() => {
              deliberationDialogue.claim(deliberationDialogue.agents[1], '\\+(beverage(restaurantThree)).');
            }).not.toThrow();
          });

          it('Fails if the restaurant is not preferable to any other agent', () => {
            const deliberationDialogue = createDeliberationDialogue('restaurantTwo');

            expect(() => {
              deliberationDialogue.claim(deliberationDialogue.agents[0], '\\+(healthy(restaurantThree)).');
            }).toThrow('Pre-conditions of agent one claiming "restaurant three lacks property healthy" are not satisfied because the restaurant is not preferable to any other agent!');
          });
        });
      });
    });

    describe('Post-conditions', () => {
      describe('Com_ag_i ⇒ Com_ag_i ∪ l', () => {
        it('Passes if the claim is added to the commitment store', () => {
          const deliberationDialogue = createDeliberationDialogue();
          deliberationDialogue.claim(deliberationDialogue.agents[0], 'quality(restaurantOne,good).');

          expect(deliberationDialogue.agents[0].commitmentStore).toContain('quality(restaurantOne,good).');
        });
      });

      describe('Com_O ⇒ Com_O ∪ acceptableRestaurant(a) iff demo(∏_O ∪ Com_O, acceptableRestaurant(a))', () => {
        it('Passes if demo(∏_O ∪ Com_O, acceptableRestaurant(a)) and acceptableRestaurant(a) is added to the agent\'s commitment store', () => {
          const deliberationDialogue = createDeliberationDialogue();
          deliberationDialogue.claim(deliberationDialogue.agents[0], 'quality(restaurantOne,good).');

          expect(deliberationDialogue.agents[0].commitmentStore).toContain('acceptableRestaurant(restaurantOne).');
        });

        it('Passes if not demo(∏_O ∪ Com_O, acceptableRestaurant(a)) and acceptableRestaurant(a) is not added to the agent\'s commitment store', () => {
          const deliberationDialogue = createDeliberationDialogue();
          deliberationDialogue.claim(deliberationDialogue.agents[2], 'recommended(restaurantThree,students).');

          expect(deliberationDialogue.agents[0].commitmentStore).not.toContain('acceptableRestaurant(restaurantThree).');
        });
      });

      describe('Com_O ⇒ Com_O ∪ (p(X) ∈ B), where B is the set of terms in the body of the preference rule of O', () => {
        it('Passes if p(X) ∈ B is added to the agent\'s commitment store', () => {
          const deliberationDialogue = createDeliberationDialogue();
          deliberationDialogue.claim(deliberationDialogue.agents[0], 'quality(restaurantOne,good).');

          expect(deliberationDialogue.agents[0].commitmentStore).toContain('quality(X,good):-recommended(X,Y),trustworthy(Y).');
        });
      });
    });
  });

  describe('Why', () => {
    describe('Pre-conditions', () => {
      describe('not demo(∏_ag_i ∪ Com_ag_i, l)', () => {
        it('Passes if the agent cannot demonstrate the claim', () => {
          const deliberationDialogue = createDeliberationDialogue();
          deliberationDialogue.claim(deliberationDialogue.agents[1], 'quality(restaurantTwo,good).');

          expect(() => {
            deliberationDialogue.why(deliberationDialogue.agents[2], 'quality(restaurantTwo,good).');
          }).not.toThrow();
        });

        it('Fails if the agent can demonstrate the claim', () => {
          const deliberationDialogue = createDeliberationDialogue();
          deliberationDialogue.claim(deliberationDialogue.agents[1], 'quality(restaurantThree,poor).');

          expect(() => {
            deliberationDialogue.why(deliberationDialogue.agents[2], 'quality(restaurantThree,poor).');
          }).toThrow('Pre-conditions of agent three asking why "restaurant three has property quality of value poor" are not satisfied because the agent can demonstrate the claim through their knowledge base and commitment store!');
        });
      });

      describe('for some agent ag_j ≠ ag_i, l ∈ Com_ag_j', () => {
        it('Passes if some other agent\'s commitment store contains the claim', () => {
          const deliberationDialogue = createDeliberationDialogue();
          deliberationDialogue.claim(deliberationDialogue.agents[1], 'quality(restaurantTwo,good).');

          expect(() => {
            deliberationDialogue.why(deliberationDialogue.agents[2], 'quality(restaurantTwo,good).');
          }).not.toThrow();
        });

        it('Fails if no other agent\'s commitment store contains the claim', () => {
          const deliberationDialogue = createDeliberationDialogue();

          expect(() => {
            deliberationDialogue.why(deliberationDialogue.agents[2], 'quality(restaurantTwo,good).');
          }).toThrow('Pre-conditions of agent three asking why "restaurant two has property quality of value good" are not satisfied because no other agent\'s commitment store contains the claim!');
        });
      });
    });
  });

  describe('Concede', () => {
    describe('Pre-conditions', () => {
      describe('for some agent ag_j ≠ ag_i, l ∈ Com_ag_j', () => {
        it('Passes if some other agent\'s commitment store contains the claim', () => {
          const deliberationDialogue = createDeliberationDialogue();
          deliberationDialogue.claim(deliberationDialogue.agents[1], 'quality(restaurantTwo,good).');

          expect(() => {
            deliberationDialogue.concede(deliberationDialogue.agents[2], 'quality(restaurantTwo,good).');
          }).not.toThrow();
        });

        it('Fails if no other agent\'s commitment store contains the claim', () => {
          const deliberationDialogue = createDeliberationDialogue();

          expect(() => {
            deliberationDialogue.concede(deliberationDialogue.agents[2], 'quality(restaurantTwo,good).');
          }).toThrow('Pre-conditions of agent three conceding to "restaurant two has property quality of value good" are not satisfied because no other agent\'s commitment store contains the claim!');
        });
      });

      describe('not(¬l ∈ Com_ag_i)', () => {
        it('Passes if the agent\'s commitment store does not contain the negation of the claim', () => {
          const deliberationDialogue = createDeliberationDialogue();
          deliberationDialogue.claim(deliberationDialogue.agents[0], 'quality(restaurantOne,good).');

          expect(() => {
            deliberationDialogue.concede(deliberationDialogue.agents[1], 'quality(restaurantOne,good).');
          }).not.toThrow();
        });

        it('Fails if the agent\'s commitment store contains the negation of the claim', () => {
          const deliberationDialogue = createDeliberationDialogue();
          deliberationDialogue.claim(deliberationDialogue.agents[1], '\\+(quality(restaurantOne,good)).');
          deliberationDialogue.claim(deliberationDialogue.agents[0], 'quality(restaurantOne,good).');

          expect(() => {
            deliberationDialogue.concede(deliberationDialogue.agents[1], 'quality(restaurantOne,good).');
          }).toThrow('Pre-conditions of agent two conceding to "restaurant one has property quality of value good" are not satisfied because the agent\'s commitment store contains the negation of the claim!');
        });
      });
    });

    describe('Post-conditions', () => {
      describe('Com_ag_i ⇒ Com_ag_i ∪ l', () => {
        it('Passes if the claim is added to the commitment store', () => {
          const deliberationDialogue = createDeliberationDialogue();
          deliberationDialogue.claim(deliberationDialogue.agents[0], 'quality(restaurantOne,good).');
          deliberationDialogue.concede(deliberationDialogue.agents[1], 'quality(restaurantOne,good).');

          expect(deliberationDialogue.agents[1].commitmentStore).toContain('quality(restaurantOne,good).');
        });
      });

      describe('Com_O ⇒ Com_O ∪ (p(X) ∈ B), where B is the set of terms in the body of the preference rule of O', () => {
        it('Passes if p(X) ∈ B is added to the agent\'s commitment store', () => {
          const deliberationDialogue = createDeliberationDialogue();
          deliberationDialogue.claim(deliberationDialogue.agents[1], 'quality(restaurantTwo,good).');
          deliberationDialogue.concede(deliberationDialogue.agents[0], 'quality(restaurantTwo,good).');

          expect(deliberationDialogue.agents[0].commitmentStore).toContain('quality(X,good):-recommended(X,Y),trustworthy(Y).');
        });
      });
    });
  });

  describe('Retract', () => {
    describe('Pre-conditions', () => {
      describe('not demo(∏_ag_i ∪ Com_ag_i \\ l, l)', () => {
        it('Passes if the agent cannot demonstrate the claim through their knowledge base and remaining commitment store', () => {
          const deliberationDialogue = createDeliberationDialogue();
          deliberationDialogue.claim(deliberationDialogue.agents[0], 'quality(restaurantOne,good).');
          deliberationDialogue.concede(deliberationDialogue.agents[1], 'quality(restaurantOne,good).');

          expect(() => {
            deliberationDialogue.retract(deliberationDialogue.agents[1], 'quality(restaurantOne,good).');
          }).not.toThrow();
        });

        it('Fails if the agent can demonstrate the claim through their knowledge base and remaining commitment store', () => {
          const deliberationDialogue = createDeliberationDialogue();
          deliberationDialogue.claim(deliberationDialogue.agents[2], 'recommended(restaurantThree,students).');
          deliberationDialogue.concede(deliberationDialogue.agents[1], 'recommended(restaurantThree,students).');

          expect(() => {
            deliberationDialogue.retract(deliberationDialogue.agents[1], 'recommended(restaurantThree,students).');
          }).toThrow('Pre-conditions of agent two retracting "restaurant three has property recommended of value students" are not satisfied because the agent can demonstrate the claim through their knowledge base and remaining commitment store!');
        });
      });

      describe('l ∈ Com_ag_i', () => {
        it('Passes if the agent\'s commitment store contains the claim', () => {
          const deliberationDialogue = createDeliberationDialogue();
          deliberationDialogue.claim(deliberationDialogue.agents[0], 'quality(restaurantOne,good).');
          deliberationDialogue.concede(deliberationDialogue.agents[1], 'quality(restaurantOne,good).');

          expect(() => {
            deliberationDialogue.retract(deliberationDialogue.agents[1], 'quality(restaurantOne,good).');
          }).not.toThrow();
        });

        it('Fails if the agent\'s commitment store does not contains the claim', () => {
          const deliberationDialogue = createDeliberationDialogue();

          expect(() => {
            deliberationDialogue.retract(deliberationDialogue.agents[1], 'quality(restaurantOne,good).');
          }).toThrow('Pre-conditions of agent two retracting "restaurant one has property quality of value good" are not satisfied because the agent\'s commitment store does not contain the claim!');
        });
      });
    });

    describe('Post-conditions', () => {
      describe('Com_ag_i ⇒ Com_ag_i \\ l', () => {
        it('Passes if the claim is removed from the agent\'s commitment store', () => {
          const deliberationDialogue = createDeliberationDialogue();
          deliberationDialogue.claim(deliberationDialogue.agents[0], 'quality(restaurantOne,good).');
          deliberationDialogue.concede(deliberationDialogue.agents[1], 'quality(restaurantOne,good).');
          deliberationDialogue.retract(deliberationDialogue.agents[1], 'quality(restaurantOne,good).');

          expect(deliberationDialogue.agents[1].commitmentStore).not.toContain('quality(restaurantOne,good).');
        });
      });
    });
  });

  describe('Since', () => {
    describe('Pre-conditions', () => {
      describe('l ∈ Com_ag_i', () => {
        it('Passes if the agent\'s commitment store contains the claim', () => {
          const deliberationDialogue = createDeliberationDialogue();
          deliberationDialogue.claim(deliberationDialogue.agents[1], 'healthy(restaurantTwo).');
          deliberationDialogue.why(deliberationDialogue.agents[0], 'healthy(restaurantTwo).');

          expect(() => {
            deliberationDialogue.since(deliberationDialogue.agents[1], deliberationDialogue.agents[0], 'healthy(restaurantTwo).', ['healthy(X):-vegetables(X).', 'vegetables(X):-cuisine(X,cuisineTwo).', 'cuisine(restaurantTwo,cuisineTwo).']);
          }).not.toThrow();
        });

        it('Fails if the agent\'s commitment store does not contain the claim', () => {
          const deliberationDialogue = createDeliberationDialogue();

          expect(() => {
            deliberationDialogue.since(deliberationDialogue.agents[1], deliberationDialogue.agents[0], 'healthy(restaurantTwo).', ['healthy(X):-vegetables(X).', 'vegetables(X):-cuisine(X,cuisineTwo).', 'cuisine(restaurantTwo,cuisineTwo).']);
          }).toThrow('Pre-conditions of agent two offering reasoning for "restaurant two has property healthy" are not satisfied because the agent\'s commitment store does not contain the claim!');
        });
      });

      describe('demo(∏ ∪ Com_ag_j, l) for some ∏ ⊆ ∏_ag_i', () => {
        it('Passes if the agent\'s knowledge base contains all justifications', () => {
          const deliberationDialogue = createDeliberationDialogue();
          deliberationDialogue.claim(deliberationDialogue.agents[1], 'healthy(restaurantTwo).');
          deliberationDialogue.why(deliberationDialogue.agents[0], 'healthy(restaurantTwo).');

          expect(() => {
            deliberationDialogue.since(deliberationDialogue.agents[1], deliberationDialogue.agents[0], 'healthy(restaurantTwo).', ['healthy(X):-vegetables(X).', 'vegetables(X):-cuisine(X,cuisineTwo).', 'cuisine(restaurantTwo,cuisineTwo).']);
          }).not.toThrow();
        });

        it('Fails if the agent\'s knowledge base does not contain all justifications', () => {
          const deliberationDialogue = createDeliberationDialogue();
          deliberationDialogue.claim(deliberationDialogue.agents[1], 'healthy(restaurantTwo).');
          deliberationDialogue.why(deliberationDialogue.agents[0], 'healthy(restaurantTwo).');

          expect(() => {
            deliberationDialogue.since(deliberationDialogue.agents[1], deliberationDialogue.agents[0], 'healthy(restaurantTwo).', ['distance(restaurantTwo,10,10).', 'healthy(X):-vegetables(X).', 'vegetables(X):-cuisine(X,cuisineTwo).', 'cuisine(restaurantTwo,cuisineTwo).']);
          }).toThrow('Pre-conditions of agent two offering reasoning for "restaurant two has property healthy" are not satisfied because the agent\'s knowledge base does not contain all justifications!');
        });

        it('Passes if the other agent can demonstrate the claim through the justifications and their commitment store', () => {
          const deliberationDialogue = createDeliberationDialogue();
          deliberationDialogue.claim(deliberationDialogue.agents[1], 'healthy(restaurantTwo).');
          deliberationDialogue.why(deliberationDialogue.agents[0], 'healthy(restaurantTwo).');

          expect(() => {
            deliberationDialogue.since(deliberationDialogue.agents[1], deliberationDialogue.agents[0], 'healthy(restaurantTwo).', ['healthy(X):-vegetables(X).', 'vegetables(X):-cuisine(X,cuisineTwo).', 'cuisine(restaurantTwo,cuisineTwo).']);
          }).not.toThrow();
        });

        it('Fails if the other agent cannot demonstrate the claim through the justifications and their commitment store', () => {
          const deliberationDialogue = createDeliberationDialogue();
          deliberationDialogue.claim(deliberationDialogue.agents[1], 'healthy(restaurantTwo).');
          deliberationDialogue.why(deliberationDialogue.agents[0], 'healthy(restaurantTwo).');

          expect(() => {
            deliberationDialogue.since(deliberationDialogue.agents[1], deliberationDialogue.agents[0], 'healthy(restaurantTwo).', ['vegetables(X):-cuisine(X,cuisineTwo).', 'cuisine(restaurantTwo,cuisineTwo).']);
          }).toThrow('Pre-conditions of agent two offering reasoning for "restaurant two has property healthy" are not satisfied because agent one cannot demonstrate the claim through the justifications and their commitment store!');
        });
      });
    });

    describe('Post-conditions', () => {
      describe('Com_ag_i ⇒ Com_ag_i ∪ ∏', () => {
        it('Passes if the justifications are added to the agent\'s commitment store', () => {
          const deliberationDialogue = createDeliberationDialogue();
          deliberationDialogue.claim(deliberationDialogue.agents[1], 'healthy(restaurantTwo).');
          deliberationDialogue.why(deliberationDialogue.agents[0], 'healthy(restaurantTwo).');
          deliberationDialogue.since(deliberationDialogue.agents[1], deliberationDialogue.agents[0], 'healthy(restaurantTwo).', ['healthy(X):-vegetables(X).', 'vegetables(X):-cuisine(X,cuisineTwo).', 'cuisine(restaurantTwo,cuisineTwo).']);

          expect(deliberationDialogue.agents[1].commitmentStore).toContain('healthy(X):-vegetables(X).\nvegetables(X):-cuisine(X,cuisineTwo).\ncuisine(restaurantTwo,cuisineTwo).')
        });
      });

      describe('Com_ag_j ⇒ Com_ag_j ∪ ∏', () => {
        it('Passes if the justifications are added to the other agent\'s commitment store', () => {
          const deliberationDialogue = createDeliberationDialogue();
          deliberationDialogue.claim(deliberationDialogue.agents[1], 'healthy(restaurantTwo).');
          deliberationDialogue.why(deliberationDialogue.agents[0], 'healthy(restaurantTwo).');
          deliberationDialogue.since(deliberationDialogue.agents[1], deliberationDialogue.agents[0], 'healthy(restaurantTwo).', ['healthy(X):-vegetables(X).', 'vegetables(X):-cuisine(X,cuisineTwo).', 'cuisine(restaurantTwo,cuisineTwo).']);

          expect(deliberationDialogue.agents[0].commitmentStore).toContain('healthy(X):-vegetables(X).\nvegetables(X):-cuisine(X,cuisineTwo).\ncuisine(restaurantTwo,cuisineTwo).')
        });
      });
    });

    describe('Concede-Since', () => {
      describe('Pre-conditions', () => {
        describe('demo(∏_ag_i ∪ Com_ag_i ∪ p(a), g(a))', () => {
          it('Passes if the agent can demonstrate the claim through their knowledge base, commitment store and the justifications', () => {
            const deliberationDialogue = createDeliberationDialogue();
            deliberationDialogue.claim(deliberationDialogue.agents[0], 'quality(restaurantOne,good).');
            deliberationDialogue.claim(deliberationDialogue.agents[0], 'atmosphere(restaurantOne).');

            expect(() => {
              deliberationDialogue.since(deliberationDialogue.agents[1], null, 'acceptableRestaurant(restaurantOne).', ['quality(restaurantOne,good).', 'atmosphere(restaurantOne).']);
            }).not.toThrow();
          });

          it('Fails if the agent cannot demonstrate the claim through their knowledge base, commitment store and the justifications', () => {
            const deliberationDialogue = createDeliberationDialogue();
            deliberationDialogue.claim(deliberationDialogue.agents[0], 'atmosphere(restaurantOne).');

            expect(() => {
              deliberationDialogue.since(deliberationDialogue.agents[1], null, 'acceptableRestaurant(restaurantOne).', ['atmosphere(restaurantOne).']);
            }).toThrow('Pre-conditions of agent two offering reasoning for "restaurant one has property acceptable restaurant" are not satisfied because the agent cannot demonstrate the claim through their knowledge base, commitment store, and the justifications!');
          });
        });

        describe('p(a) ∈ Com_ag_j for some ag_j ≠ ag_i', () => {
          it('Passes if some other agent\'s commitment store contains the justifications', () => {
            const deliberationDialogue = createDeliberationDialogue();
            deliberationDialogue.claim(deliberationDialogue.agents[0], 'quality(restaurantOne,good).');
            deliberationDialogue.claim(deliberationDialogue.agents[0], 'atmosphere(restaurantOne).');

            expect(() => {
              deliberationDialogue.since(deliberationDialogue.agents[1], null, 'acceptableRestaurant(restaurantOne).', ['quality(restaurantOne,good).', 'atmosphere(restaurantOne).']);
            }).not.toThrow();
          });

          it('Fails if  no other agent\'s commitment store contains the justifications', () => {
            const deliberationDialogue = createDeliberationDialogue();
            deliberationDialogue.claim(deliberationDialogue.agents[0], 'atmosphere(restaurantOne).');

            expect(() => {
              deliberationDialogue.since(deliberationDialogue.agents[1], null, 'acceptableRestaurant(restaurantOne).', ['quality(restaurantOne,good).', 'atmosphere(restaurantOne).']);
            }).toThrow('Pre-conditions of agent two offering reasoning for "restaurant one has property acceptable restaurant" are not satisfied because no other agent\'s commitment store contains the justifications!');
          });
        });
      });

      describe('Post-conditions', () => {
        describe('Com_ag_i ⇒ Com_ag_i ∪ ∏', () => {
          it('Passes if the justifications are added to the agent\'s commitment store', () => {
            const deliberationDialogue = createDeliberationDialogue();
            deliberationDialogue.claim(deliberationDialogue.agents[0], 'quality(restaurantOne,good).');
            deliberationDialogue.claim(deliberationDialogue.agents[0], 'atmosphere(restaurantOne).');
            deliberationDialogue.since(deliberationDialogue.agents[1], null, 'acceptableRestaurant(restaurantOne).', ['quality(restaurantOne,good).', 'atmosphere(restaurantOne).']);

            expect(deliberationDialogue.agents[1].commitmentStore).toContain('quality(restaurantOne,good).\natmosphere(restaurantOne).');
          });
        });

        describe('Com_O ⇒ Com_O ∪ p(X) ∈ B, where B is the set of terms in the body of the agreed preference rule', () => {
          it('Passes if every p(X) ∈ B is added to the agent\'s commitment store', () => {
            const deliberationDialogue = createDeliberationDialogue();
            deliberationDialogue.claim(deliberationDialogue.agents[0], 'quality(restaurantOne,good).');
            deliberationDialogue.claim(deliberationDialogue.agents[0], 'atmosphere(restaurantOne).');
            deliberationDialogue.since(deliberationDialogue.agents[1], null, 'acceptableRestaurant(restaurantOne).', ['quality(restaurantOne,good).', 'atmosphere(restaurantOne).']);

            expect(deliberationDialogue.agents[1].commitmentStore).toContain('quality(X,good):-recommended(X,Y),trustworthy(Y).');
          });
        });
      });
    });
  });

  describe('Question', () => {
    describe('Pre-conditions', () => {
      describe('∀(ag_j) ∈ Ag, l ∉ Com_ag_j', () => {
        it('Passes if no agent\'s commitment store contains the claim', () => {
          const deliberationDialogue = createDeliberationDialogue();

          expect(() => {
            deliberationDialogue.question(deliberationDialogue.agents[0], 'healthy(restaurantTwo).');
          }).not.toThrow();
        });

        it('Fails if some agent\'s commitment store contains the claim', () => {
          const deliberationDialogue = createDeliberationDialogue();
          deliberationDialogue.claim(deliberationDialogue.agents[1], 'healthy(restaurantTwo).');

          expect(() => {
            deliberationDialogue.question(deliberationDialogue.agents[0], 'healthy(restaurantTwo).');
          }).toThrow('Pre-conditions of agent one questioning if "restaurant two has property healthy" are not satisfied because agent two\'s commitment store contains the claim!');
        });
      });

      describe('not demo(∏_ag_i ∪ Com_ag_i, l)', () => {
        it('Passes if the agent cannot demonstrate the claim', () => {
          const deliberationDialogue = createDeliberationDialogue();

          expect(() => {
            deliberationDialogue.question(deliberationDialogue.agents[0], 'healthy(restaurantTwo).');
          }).not.toThrow();
        });

        it('Fails if the agent can demonstrate the claim', () => {
          const deliberationDialogue = createDeliberationDialogue();

          expect(() => {
            deliberationDialogue.question(deliberationDialogue.agents[0], 'healthy(restaurantOne).');
          }).toThrow('Pre-conditions of agent one questioning if "restaurant one has property healthy" are not satisfied because the agent can demonstrate the claim through their knowledge base and commitment store!');
        });
      });
    });
  });
});
