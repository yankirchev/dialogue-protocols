import { createPersuasionDialogue } from './utils/setup';

describe('Persuasion Dialogue', () => {
  describe('Claim', () => {
    describe('Pre-conditions', () => {
      describe('demo(∏_ag_i ∪ Com_ag_i, l)', () => {
        it('Passes if the agent can demonstrate the claim', () => {
          const persuasionDialogue = createPersuasionDialogue();

          expect(() => {
            persuasionDialogue.claim(persuasionDialogue.agents[1], 'quality(restaurantTwo,good).');
          }).not.toThrow();
        });

        it('Fails if the agent cannot demonstrate the claim', () => {
          const persuasionDialogue = createPersuasionDialogue();

          expect(() => {
            persuasionDialogue.claim(persuasionDialogue.agents[1], 'quality(restaurantOne,poor).');
          }).toThrow('Pre-conditions of agent two claiming "restaurant one has property quality of value poor" are not satisfied because the agent cannot demonstrate the claim through their knowledge base and commitment store!');
        });
      });

      describe('¬l ∈ Com_ag_j for any ag_j ∈ Ag', () => {
        it('Passes if no agent\'s commitment store contains the claim', () => {
          const persuasionDialogue = createPersuasionDialogue();

          expect(() => {
            persuasionDialogue.claim(persuasionDialogue.agents[1], 'quality(restaurantTwo,good).');
          }).not.toThrow();
        });

        it('Fails if some agent\'s commitment store contains the claim', () => {
          const persuasionDialogue = createPersuasionDialogue();
          persuasionDialogue.claim(persuasionDialogue.agents[1], 'quality(restaurantTwo,good).');

          expect(() => {
            persuasionDialogue.claim(persuasionDialogue.agents[1], 'quality(restaurantTwo,good).');
          }).toThrow('Pre-conditions of agent two claiming "restaurant two has property quality of value good" are not satisfied because agent two\'s commitment store contains the claim!');
        });
      });

      describe('preferable(O, a)', () => {
        describe('Opponent', () => {
          it('Passes if the restaurant is preferable to the agent', () => {
            const persuasionDialogue = createPersuasionDialogue();

            expect(() => {
              persuasionDialogue.claim(persuasionDialogue.agents[0], 'quality(restaurantOne,good).');
            }).not.toThrow();
          });

          it('Fails if the restaurant is not preferable to the agent', () => {
            const persuasionDialogue = createPersuasionDialogue();

            expect(() => {
              persuasionDialogue.claim(persuasionDialogue.agents[2], 'distance(restaurantTwo,10,_).');
            }).toThrow('Pre-conditions of agent three claiming "restaurant two has property distance of value 10" are not satisfied because the restaurant is not preferable to the agent!');
          });
        });

        describe('Proponent', () => {
          it('Passes if the restaurant is preferable to the agent', () => {
            const persuasionDialogue = createPersuasionDialogue();

            expect(() => {
              persuasionDialogue.claim(persuasionDialogue.agents[1], 'quality(restaurantTwo,good).');
            }).not.toThrow();
          });

          it('Passes if the restaurant is not preferable to the agent', () => {
            const persuasionDialogue = createPersuasionDialogue();

            expect(() => {
              persuasionDialogue.claim(persuasionDialogue.agents[1], 'price(restaurantOne,25).');
            }).not.toThrow();
          });
        });
      });

      describe('p(X) ∈ B, where B is the set of terms in the body of the preference rule of O', () => {
        describe('Opponent', () => {
          it('Passes if the claim corresponds to a feature in the body of the agent\'s preference rule', () => {
            const persuasionDialogue = createPersuasionDialogue();

            expect(() => {
              persuasionDialogue.claim(persuasionDialogue.agents[0], 'quality(restaurantOne,good).');
            }).not.toThrow();
          });

          it('Fails if the claim does not correspond to a feature in the body of the agent\'s preference rule', () => {
            const persuasionDialogue = createPersuasionDialogue();

            expect(() => {
              persuasionDialogue.claim(persuasionDialogue.agents[0], 'atmosphere(restaurantOne).');
            }).toThrow('Pre-conditions of agent one claiming "restaurant one has property atmosphere" are not satisfied because the claim does not correspond to a feature in the body of the agent\'s preference rule!');
          });
        });

        describe('Proponent', () => {
          it('Passes if the claim corresponds to a feature in the body of the agent\'s preference rule', () => {
            const persuasionDialogue = createPersuasionDialogue();

            expect(() => {
              persuasionDialogue.claim(persuasionDialogue.agents[1], 'cuisine(restaurantTwo,cuisineTwo).');
            }).not.toThrow();
          });

          it('Passes if the claim does not correspond to a feature in the body of the agent\'s preference rule', () => {
            const persuasionDialogue = createPersuasionDialogue();

            expect(() => {
              persuasionDialogue.claim(persuasionDialogue.agents[1], 'quality(restaurantTwo,good).');
            }).not.toThrow();
          });
        });
      });
    });

    describe('Post-conditions', () => {
      describe('Com_ag_i ⇒ Com_ag_i ∪ l', () => {
        it('Passes if the claim is added to the commitment store', () => {
          const persuasionDialogue = createPersuasionDialogue();
          persuasionDialogue.claim(persuasionDialogue.agents[0], 'quality(restaurantOne,good).');

          expect(persuasionDialogue.agents[0].commitmentStore).toContain('quality(restaurantOne,good).');
        });
      });

      describe('Com_O ⇒ Com_O ∪ acceptableRestaurant(a) iff demo(∏_O ∪ Com_O, acceptableRestaurant(a))', () => {
        describe('Opponent', () => {
          it('Passes if demo(∏_O ∪ Com_O, acceptableRestaurant(a)) and acceptableRestaurant(a) is added to the agent\'s commitment store', () => {
            const persuasionDialogue = createPersuasionDialogue();
            persuasionDialogue.claim(persuasionDialogue.agents[0], 'quality(restaurantOne,good).');

            expect(persuasionDialogue.agents[0].commitmentStore).toContain('acceptableRestaurant(restaurantOne).');
          });

          it('Passes if not demo(∏_O ∪ Com_O, acceptableRestaurant(a)) and acceptableRestaurant(a) is not added to the agent\'s commitment store', () => {
            const persuasionDialogue = createPersuasionDialogue();
            persuasionDialogue.claim(persuasionDialogue.agents[2], 'recommended(restaurantThree,students).');

            expect(persuasionDialogue.agents[0].commitmentStore).not.toContain('acceptableRestaurant(restaurantThree).');
          });
        });

        describe('Proponent', () => {
          it('Passes if demo(∏_ag_i ∪ Com_ag_i, acceptableRestaurant(a)) and acceptableRestaurant(a) is not added to the agent\'s commitment store', () => {
            const persuasionDialogue = createPersuasionDialogue();
            persuasionDialogue.claim(persuasionDialogue.agents[1], 'quality(restaurantTwo,good).');

            expect(persuasionDialogue.agents[0].commitmentStore).not.toContain('acceptableRestaurant(restaurantTwo).');
          });

          it('Passes if not demo(∏_ag_i ∪ Com_ag_i, acceptableRestaurant(a)) and acceptableRestaurant(a) is not added to the agent\'s commitment store', () => {
            const persuasionDialogue = createPersuasionDialogue();
            persuasionDialogue.claim(persuasionDialogue.agents[1], 'price(restaurantOne,25).');

            expect(persuasionDialogue.agents[0].commitmentStore).not.toContain('acceptableRestaurant(restaurantOne).');
          });
        });
      });

      describe('Com_O ⇒ Com_O ∪ (p(X) ∈ B), where B is the set of terms in the body of the preference rule of O', () => {
        describe('Opponent', () => {
          it('Passes if p(X) ∈ B is added to the agent\'s commitment store', () => {
            const persuasionDialogue = createPersuasionDialogue();
            persuasionDialogue.claim(persuasionDialogue.agents[0], 'quality(restaurantOne,good).');

            expect(persuasionDialogue.agents[0].commitmentStore).toContain('quality(X,good):-recommended(X,Y),trustworthy(Y).');
          });
        });

        describe('Proponent', () => {
          it('Passes if p(X) ∈ B is not added to the agent\'s commitment store', () => {
            const persuasionDialogue = createPersuasionDialogue();
            persuasionDialogue.claim(persuasionDialogue.agents[1], 'quality(restaurantTwo,good).');

            expect(persuasionDialogue.agents[1].commitmentStore).not.toContain('quality(X,good):-recommended(X,Y),trustworthy(Y).');
          });
        });
      });
    });
  });

  describe('Counterclaim', () => {
    describe('Pre-conditions', () => {
      describe('demo(∏_ag_i ∪ Com_ag_i, l)', () => {
        it('Passes if the agent can demonstrate the claim', () => {
          const persuasionDialogue = createPersuasionDialogue();

          expect(() => {
            persuasionDialogue.counterclaim(persuasionDialogue.agents[1], 'price(restaurantOne,25).');
          }).not.toThrow();
        });

        it('Fails if the agent cannot demonstrate the claim', () => {
          const persuasionDialogue = createPersuasionDialogue();

          expect(() => {
            persuasionDialogue.counterclaim(persuasionDialogue.agents[1], 'quality(restaurantOne,poor).');
          }).toThrow('Pre-conditions of agent two counterclaiming "restaurant one has property quality of value poor" are not satisfied because the agent cannot demonstrate the claim through their knowledge base and commitment store!');
        });
      });

      describe('¬l ∈ Com_ag_j for any ag_j ∈ Ag', () => {
        it('Passes if no agent\'s commitment store contains the claim', () => {
          const persuasionDialogue = createPersuasionDialogue();

          expect(() => {
            persuasionDialogue.counterclaim(persuasionDialogue.agents[1], 'price(restaurantOne,25).');
          }).not.toThrow();
        });

        it('Fails if some agent\'s commitment store contains the claim', () => {
          const persuasionDialogue = createPersuasionDialogue();
          persuasionDialogue.counterclaim(persuasionDialogue.agents[1], 'price(restaurantOne,25).');

          expect(() => {
            persuasionDialogue.counterclaim(persuasionDialogue.agents[1], 'price(restaurantOne,25).');
          }).toThrow('Pre-conditions of agent two counterclaiming "restaurant one has property price of value 25" are not satisfied because agent two\'s commitment store contains the claim!');
        });
      });

      describe('¬preferable(O, a)', () => {
        describe('Opponent', () => {
          it('Passes if the restaurant is not preferable to the agent', () => {
            const persuasionDialogue = createPersuasionDialogue();

            expect(() => {
              persuasionDialogue.counterclaim(persuasionDialogue.agents[2], 'distance(restaurantTwo,10,_).');
            }).not.toThrow();
          });

          it('Fails if the restaurant is preferable to the agent', () => {
            const persuasionDialogue = createPersuasionDialogue();

            expect(() => {
              persuasionDialogue.counterclaim(persuasionDialogue.agents[2], 'recommended(restaurantThree,students).');
            }).toThrow('Pre-conditions of agent three counterclaiming "restaurant three has property recommended of value students" are not satisfied because the restaurant is preferable to the agent!');
          });
        });

        describe('Proponent', () => {
          it('Passes if the restaurant is not preferable to the agent', () => {
            const persuasionDialogue = createPersuasionDialogue();

            expect(() => {
              persuasionDialogue.counterclaim(persuasionDialogue.agents[1], 'price(restaurantOne,25).');
            }).not.toThrow();
          });

          it('Passes if the restaurant is preferable to the agent', () => {
            const persuasionDialogue = createPersuasionDialogue();

            expect(() => {
              persuasionDialogue.counterclaim(persuasionDialogue.agents[1], 'quality(restaurantTwo,good).');
            }).not.toThrow();
          });
        });
      });

      describe('p(X) ∈ B, where B is the set of terms in the body of the preference rule of O', () => {
        describe('Opponent', () => {
          it('Passes if the claim corresponds to a feature in the body of the agent\'s preference rule', () => {
            const persuasionDialogue = createPersuasionDialogue();

            expect(() => {
              persuasionDialogue.counterclaim(persuasionDialogue.agents[2], 'distance(restaurantTwo,10,_).');
            }).not.toThrow();
          });

          it('Fails if the claim does not correspond to a feature in the body of the agent\'s preference rule', () => {
            const persuasionDialogue = createPersuasionDialogue();

            expect(() => {
              persuasionDialogue.counterclaim(persuasionDialogue.agents[0], '\\+(atmosphere(restaurantTwo)).');
            }).toThrow('Pre-conditions of agent one counterclaiming "restaurant two lacks property atmosphere" are not satisfied because the claim does not correspond to a feature in the body of the agent\'s preference rule!');
          });
        });

        describe('Proponent', () => {
          it('Passes if the claim corresponds to a feature in the body of the agent\'s preference rule', () => {
            const persuasionDialogue = createPersuasionDialogue();

            expect(() => {
              persuasionDialogue.counterclaim(persuasionDialogue.agents[1], '\\+(cuisine(restaurantOne,cuisineTwo)).');
            }).not.toThrow();
          });

          it('Passes if the claim does not correspond to a feature in the body of the agent\'s preference rule', () => {
            const persuasionDialogue = createPersuasionDialogue();

            expect(() => {
              persuasionDialogue.counterclaim(persuasionDialogue.agents[1], 'quality(restaurantThree,poor).');
            }).not.toThrow();
          });
        });
      });
    });

    describe('Post-conditions', () => {
      describe('Com_ag_i ⇒ Com_ag_i ∪ l', () => {
        it('Passes if the claim is added to the commitment store', () => {
          const persuasionDialogue = createPersuasionDialogue();
          persuasionDialogue.counterclaim(persuasionDialogue.agents[1], 'price(restaurantOne,25).');

          expect(persuasionDialogue.agents[1].commitmentStore).toContain('price(restaurantOne,25).');
        });
      });

      describe('Com_O ⇒ Com_O ∪ (p(X) ∈ B), where B is the set of terms in the body of the preference rule of O', () => {
        describe('Opponent', () => {
          it('Passes if p(X) ∈ B is added to the agent\'s commitment store', () => {
            const persuasionDialogue = createPersuasionDialogue();
            persuasionDialogue.counterclaim(persuasionDialogue.agents[0], '\\+(quality(restaurantTwo,good)).');

            expect(persuasionDialogue.agents[0].commitmentStore).toContain('quality(X,good):-recommended(X,Y),trustworthy(Y).');
          });
        });

        describe('Proponent', () => {
          it('Passes if p(X) ∈ B is not added to the agent\'s commitment store', () => {
            const persuasionDialogue = createPersuasionDialogue();
            persuasionDialogue.counterclaim(persuasionDialogue.agents[1], 'quality(restaurantThree,poor).');

            expect(persuasionDialogue.agents[1].commitmentStore).not.toContain('quality(X,poor):-recommended(X,students).');
          });
        });
      });
    });
  });

  describe('Why', () => {
    describe('Pre-conditions', () => {
      describe('not demo(∏_ag_i ∪ Com_ag_i, l)', () => {
        it('Passes if the agent cannot demonstrate the claim', () => {
          const persuasionDialogue = createPersuasionDialogue();
          persuasionDialogue.claim(persuasionDialogue.agents[1], 'quality(restaurantTwo,good).');

          expect(() => {
            persuasionDialogue.why(persuasionDialogue.agents[2], 'quality(restaurantTwo,good).');
          }).not.toThrow();
        });

        it('Fails if the agent can demonstrate the claim', () => {
          const persuasionDialogue = createPersuasionDialogue();
          persuasionDialogue.claim(persuasionDialogue.agents[1], 'quality(restaurantThree,poor).');

          expect(() => {
            persuasionDialogue.why(persuasionDialogue.agents[2], 'quality(restaurantThree,poor).');
          }).toThrow('Pre-conditions of agent three asking why "restaurant three has property quality of value poor" are not satisfied because the agent can demonstrate the claim through their knowledge base and commitment store!');
        });
      });

      describe('for some agent ag_j ≠ ag_i, l ∈ Com_ag_j', () => {
        it('Passes if some other agent\'s commitment store contains the claim', () => {
          const persuasionDialogue = createPersuasionDialogue();
          persuasionDialogue.claim(persuasionDialogue.agents[1], 'quality(restaurantTwo,good).');

          expect(() => {
            persuasionDialogue.why(persuasionDialogue.agents[2], 'quality(restaurantTwo,good).');
          }).not.toThrow();
        });

        it('Fails if no other agent\'s commitment store contains the claim', () => {
          const persuasionDialogue = createPersuasionDialogue();

          expect(() => {
            persuasionDialogue.why(persuasionDialogue.agents[2], 'quality(restaurantTwo,good).');
          }).toThrow('Pre-conditions of agent three asking why "restaurant two has property quality of value good" are not satisfied because no other agent\'s commitment store contains the claim!');
        });
      });
    });
  });

  describe('Concede', () => {
    describe('Pre-conditions', () => {
      describe('for some agent ag_j ≠ ag_i, l ∈ Com_ag_j', () => {
        it('Passes if some other agent\'s commitment store contains the claim', () => {
          const persuasionDialogue = createPersuasionDialogue();
          persuasionDialogue.claim(persuasionDialogue.agents[1], 'quality(restaurantTwo,good).');

          expect(() => {
            persuasionDialogue.concede(persuasionDialogue.agents[2], 'quality(restaurantTwo,good).');
          }).not.toThrow();
        });

        it('Fails if no other agent\'s commitment store contains the claim', () => {
          const persuasionDialogue = createPersuasionDialogue();

          expect(() => {
            persuasionDialogue.concede(persuasionDialogue.agents[2], 'quality(restaurantTwo,good).');
          }).toThrow('Pre-conditions of agent three conceding to "restaurant two has property quality of value good" are not satisfied because no other agent\'s commitment store contains the claim!');
        });
      });

      describe('not(¬l ∈ Com_ag_i)', () => {
        it('Passes if the agent\'s commitment store does not contain the negation of the claim', () => {
          const persuasionDialogue = createPersuasionDialogue();
          persuasionDialogue.claim(persuasionDialogue.agents[0], 'quality(restaurantOne,good).');

          expect(() => {
            persuasionDialogue.concede(persuasionDialogue.agents[1], 'quality(restaurantOne,good).');
          }).not.toThrow();
        });

        it('Fails if the agent\'s commitment store contains the negation of the claim', () => {
          const persuasionDialogue = createPersuasionDialogue();
          persuasionDialogue.claim(persuasionDialogue.agents[1], '\\+(healthy(restaurantOne)).');
          persuasionDialogue.claim(persuasionDialogue.agents[0], 'healthy(restaurantOne).');

          expect(() => {
            persuasionDialogue.concede(persuasionDialogue.agents[1], 'healthy(restaurantOne).');
          }).toThrow('Pre-conditions of agent two conceding to "restaurant one has property healthy" are not satisfied because the agent\'s commitment store contains the negation of the claim!');
        });
      });

      describe('p(X) ∈ B, where B is the set of terms in the body of the preference rule of O', () => {
        describe('Opponent', () => {
          it('Passes if the claim corresponds to a feature in the body of the agent\'s preference rule', () => {
            const persuasionDialogue = createPersuasionDialogue();
            persuasionDialogue.claim(persuasionDialogue.agents[0], 'quality(restaurantOne,good).');

            expect(() => {
              persuasionDialogue.concede(persuasionDialogue.agents[2], 'quality(restaurantOne,good).');
            }).not.toThrow();
          });

          it('Fails if the claim does not correspond to a feature in the body of the agent\'s preference rule', () => {
            const persuasionDialogue = createPersuasionDialogue();
            persuasionDialogue.claim(persuasionDialogue.agents[0], 'healthy(restaurantOne).');

            expect(() => {
              persuasionDialogue.concede(persuasionDialogue.agents[2], 'healthy(restaurantOne).');
            }).toThrow('Pre-conditions of agent three conceding to "restaurant one has property healthy" are not satisfied because the claim does not correspond to a feature in the body of the agent\'s preference rule!');
          });
        });

        describe('Proponent', () => {
          it('Passes if the claim corresponds to a feature in the body of the agent\'s preference rule', () => {
            const persuasionDialogue = createPersuasionDialogue();
            persuasionDialogue.claim(persuasionDialogue.agents[0], '\\+(cuisine(restaurantOne,cuisineTwo)).');

            expect(() => {
              persuasionDialogue.concede(persuasionDialogue.agents[1], '\\+(cuisine(restaurantOne,cuisineTwo)).');
            }).not.toThrow();
          });

          it('Passes if the claim does not correspond to a feature in the body of the agent\'s preference rule', () => {
            const persuasionDialogue = createPersuasionDialogue();
            persuasionDialogue.claim(persuasionDialogue.agents[0], 'healthy(restaurantOne).');

            expect(() => {
              persuasionDialogue.concede(persuasionDialogue.agents[1], 'healthy(restaurantOne).');
            }).not.toThrow();
          });
        });
      });
    });

    describe('Post-conditions', () => {
      describe('Com_ag_i ⇒ Com_ag_i ∪ l', () => {
        it('Passes if the claim is added to the commitment store', () => {
          const persuasionDialogue = createPersuasionDialogue();
          persuasionDialogue.claim(persuasionDialogue.agents[0], 'quality(restaurantOne,good).');
          persuasionDialogue.concede(persuasionDialogue.agents[1], 'quality(restaurantOne,good).');

          expect(persuasionDialogue.agents[1].commitmentStore).toContain('quality(restaurantOne,good).');
        });
      });

      describe('Com_O ⇒ Com_O ∪ (p(X) ∈ B), where B is the set of terms in the body of the preference rule of O', () => {
        describe('Opponent', () => {
          it('Passes if p(X) ∈ B is added to the agent\'s commitment store', () => {
            const persuasionDialogue = createPersuasionDialogue();
            persuasionDialogue.claim(persuasionDialogue.agents[1], 'quality(restaurantTwo,good).');
            persuasionDialogue.concede(persuasionDialogue.agents[0], 'quality(restaurantTwo,good).');

            expect(persuasionDialogue.agents[0].commitmentStore).toContain('quality(X,good):-recommended(X,Y),trustworthy(Y).');
          });
        });

        describe('Proponent', () => {
          it('Passes if p(X) ∈ B is not added to the agent\'s commitment store', () => {
            const persuasionDialogue = createPersuasionDialogue();
            persuasionDialogue.claim(persuasionDialogue.agents[0], 'quality(restaurantOne,good).');
            persuasionDialogue.concede(persuasionDialogue.agents[1], 'quality(restaurantOne,good).');

            expect(persuasionDialogue.agents[1].commitmentStore).not.toContain('quality(X,good):-recommended(X,Y),trustworthy(Y).');
          });
        });
      });
    });
  });

  describe('Retract', () => {
    describe('Pre-conditions', () => {
      describe('not demo(∏_ag_i ∪ Com_ag_i \\ l, l)', () => {
        it('Passes if the agent cannot demonstrate the claim through their knowledge base and remaining commitment store', () => {
          const persuasionDialogue = createPersuasionDialogue();
          persuasionDialogue.claim(persuasionDialogue.agents[0], 'quality(restaurantOne,good).');
          persuasionDialogue.concede(persuasionDialogue.agents[1], 'quality(restaurantOne,good).');

          expect(() => {
            persuasionDialogue.retract(persuasionDialogue.agents[1], 'quality(restaurantOne,good).');
          }).not.toThrow();
        });

        it('Fails if the agent can demonstrate the claim through their knowledge base and remaining commitment store', () => {
          const persuasionDialogue = createPersuasionDialogue();
          persuasionDialogue.claim(persuasionDialogue.agents[2], 'recommended(restaurantThree,students).');
          persuasionDialogue.concede(persuasionDialogue.agents[1], 'recommended(restaurantThree,students).');

          expect(() => {
            persuasionDialogue.retract(persuasionDialogue.agents[1], 'recommended(restaurantThree,students).');
          }).toThrow('Pre-conditions of agent two retracting "restaurant three has property recommended of value students" are not satisfied because the agent can demonstrate the claim through their knowledge base and remaining commitment store!');
        });
      });

      describe('l ∈ Com_ag_i', () => {
        it('Passes if the agent\'s commitment store contains the claim', () => {
          const persuasionDialogue = createPersuasionDialogue();
          persuasionDialogue.claim(persuasionDialogue.agents[0], 'quality(restaurantOne,good).');
          persuasionDialogue.concede(persuasionDialogue.agents[1], 'quality(restaurantOne,good).');

          expect(() => {
            persuasionDialogue.retract(persuasionDialogue.agents[1], 'quality(restaurantOne,good).');
          }).not.toThrow();
        });

        it('Fails if the agent\'s commitment store does not contains the claim', () => {
          const persuasionDialogue = createPersuasionDialogue();

          expect(() => {
            persuasionDialogue.retract(persuasionDialogue.agents[1], 'quality(restaurantOne,good).');
          }).toThrow('Pre-conditions of agent two retracting "restaurant one has property quality of value good" are not satisfied because the agent\'s commitment store does not contain the claim!');
        });
      });
    });

    describe('Post-conditions', () => {
      describe('Com_ag_i ⇒ Com_ag_i \\ l', () => {
        it('Passes if the claim is removed from the agent\'s commitment store', () => {
          const persuasionDialogue = createPersuasionDialogue();
          persuasionDialogue.claim(persuasionDialogue.agents[0], 'quality(restaurantOne,good).');
          persuasionDialogue.concede(persuasionDialogue.agents[1], 'quality(restaurantOne,good).');
          persuasionDialogue.retract(persuasionDialogue.agents[1], 'quality(restaurantOne,good).');

          expect(persuasionDialogue.agents[1].commitmentStore).not.toContain('quality(restaurantOne,good).');
        });
      });
    });
  });

  describe('Since', () => {
    describe('Pre-conditions', () => {
      describe('l ∈ Com_ag_i', () => {
        it('Passes if the agent\'s commitment store contains the claim', () => {
          const persuasionDialogue = createPersuasionDialogue();
          persuasionDialogue.claim(persuasionDialogue.agents[1], 'healthy(restaurantTwo).');
          persuasionDialogue.why(persuasionDialogue.agents[0], 'healthy(restaurantTwo).');

          expect(() => {
            persuasionDialogue.since(persuasionDialogue.agents[1], persuasionDialogue.agents[0], 'healthy(restaurantTwo).', ['healthy(X):-vegetables(X).', 'vegetables(X):-cuisine(X,cuisineTwo).', 'cuisine(restaurantTwo,cuisineTwo).']);
          }).not.toThrow();
        });

        it('Fails if the agent\'s commitment store does not contain the claim', () => {
          const persuasionDialogue = createPersuasionDialogue();

          expect(() => {
            persuasionDialogue.since(persuasionDialogue.agents[1], persuasionDialogue.agents[0], 'healthy(restaurantTwo).', ['healthy(X):-vegetables(X).', 'vegetables(X):-cuisine(X,cuisineTwo).', 'cuisine(restaurantTwo,cuisineTwo).']);
          }).toThrow('Pre-conditions of agent two offering reasoning for "restaurant two has property healthy" are not satisfied because the agent\'s commitment store does not contain the claim!');
        });
      });

      describe('demo(∏ ∪ Com_ag_j, l) for some ∏ ⊆ ∏_ag_i', () => {
        it('Passes if the agent\'s knowledge base contains all justifications', () => {
          const persuasionDialogue = createPersuasionDialogue();
          persuasionDialogue.claim(persuasionDialogue.agents[1], 'healthy(restaurantTwo).');
          persuasionDialogue.why(persuasionDialogue.agents[0], 'healthy(restaurantTwo).');

          expect(() => {
            persuasionDialogue.since(persuasionDialogue.agents[1], persuasionDialogue.agents[0], 'healthy(restaurantTwo).', ['healthy(X):-vegetables(X).', 'vegetables(X):-cuisine(X,cuisineTwo).', 'cuisine(restaurantTwo,cuisineTwo).']);
          }).not.toThrow();
        });

        it('Fails if the agent\'s knowledge base does not contain all justifications', () => {
          const persuasionDialogue = createPersuasionDialogue();
          persuasionDialogue.claim(persuasionDialogue.agents[1], 'healthy(restaurantTwo).');
          persuasionDialogue.why(persuasionDialogue.agents[0], 'healthy(restaurantTwo).');

          expect(() => {
            persuasionDialogue.since(persuasionDialogue.agents[1], persuasionDialogue.agents[0], 'healthy(restaurantTwo).', ['atmosphere(restaurantTwo).', 'healthy(X):-vegetables(X).', 'vegetables(X):-cuisine(X,cuisineTwo).', 'cuisine(restaurantTwo,cuisineTwo).']);
          }).toThrow('Pre-conditions of agent two offering reasoning for "restaurant two has property healthy" are not satisfied because the agent\'s knowledge base does not contain all justifications!');
        });

        it('Passes if the other agent can demonstrate the claim through the justifications and their commitment store', () => {
          const persuasionDialogue = createPersuasionDialogue();
          persuasionDialogue.claim(persuasionDialogue.agents[1], 'healthy(restaurantTwo).');
          persuasionDialogue.why(persuasionDialogue.agents[0], 'healthy(restaurantTwo).');

          expect(() => {
            persuasionDialogue.since(persuasionDialogue.agents[1], persuasionDialogue.agents[0], 'healthy(restaurantTwo).', ['healthy(X):-vegetables(X).', 'vegetables(X):-cuisine(X,cuisineTwo).', 'cuisine(restaurantTwo,cuisineTwo).']);
          }).not.toThrow();
        });

        it('Fails if the other agent cannot demonstrate the claim through the justifications and their commitment store', () => {
          const persuasionDialogue = createPersuasionDialogue();
          persuasionDialogue.claim(persuasionDialogue.agents[1], 'healthy(restaurantTwo).');
          persuasionDialogue.why(persuasionDialogue.agents[0], 'healthy(restaurantTwo).');

          expect(() => {
            persuasionDialogue.since(persuasionDialogue.agents[1], persuasionDialogue.agents[0], 'healthy(restaurantTwo).', ['vegetables(X):-cuisine(X,cuisineTwo).', 'cuisine(restaurantTwo,cuisineTwo).']);
          }).toThrow('Pre-conditions of agent two offering reasoning for "restaurant two has property healthy" are not satisfied because agent one cannot demonstrate the claim through the justifications and their commitment store!');
        });
      });
    });

    describe('Post-conditions', () => {
      describe('Com_ag_i ⇒ Com_ag_i ∪ ∏', () => {
        it('Passes if the justifications are added to the agent\'s commitment store', () => {
          const persuasionDialogue = createPersuasionDialogue();
          persuasionDialogue.claim(persuasionDialogue.agents[1], 'healthy(restaurantTwo).');
          persuasionDialogue.why(persuasionDialogue.agents[0], 'healthy(restaurantTwo).');
          persuasionDialogue.since(persuasionDialogue.agents[1], persuasionDialogue.agents[0], 'healthy(restaurantTwo).', ['healthy(X):-vegetables(X).', 'vegetables(X):-cuisine(X,cuisineTwo).', 'cuisine(restaurantTwo,cuisineTwo).']);

          expect(persuasionDialogue.agents[1].commitmentStore).toContain('healthy(X):-vegetables(X).\nvegetables(X):-cuisine(X,cuisineTwo).\ncuisine(restaurantTwo,cuisineTwo).')
        });
      });

      describe('Com_ag_j ⇒ Com_ag_j ∪ ∏', () => {
        it('Passes if the justifications are added to the other agent\'s commitment store', () => {
          const persuasionDialogue = createPersuasionDialogue();
          persuasionDialogue.claim(persuasionDialogue.agents[1], 'healthy(restaurantTwo).');
          persuasionDialogue.why(persuasionDialogue.agents[0], 'healthy(restaurantTwo).');
          persuasionDialogue.since(persuasionDialogue.agents[1], persuasionDialogue.agents[0], 'healthy(restaurantTwo).', ['healthy(X):-vegetables(X).', 'vegetables(X):-cuisine(X,cuisineTwo).', 'cuisine(restaurantTwo,cuisineTwo).']);

          expect(persuasionDialogue.agents[0].commitmentStore).toContain('healthy(X):-vegetables(X).\nvegetables(X):-cuisine(X,cuisineTwo).\ncuisine(restaurantTwo,cuisineTwo).')
        });
      });
    });
  });

  describe('Question', () => {
    describe('Pre-conditions', () => {
      describe('∀(ag_j) ∈ Ag, l ∉ Com_ag_j', () => {
        it('Passes if no agent\'s commitment store contains the claim', () => {
          const persuasionDialogue = createPersuasionDialogue();

          expect(() => {
            persuasionDialogue.question(persuasionDialogue.agents[0], 'healthy(restaurantTwo).');
          }).not.toThrow();
        });

        it('Fails if some agent\'s commitment store contains the claim', () => {
          const persuasionDialogue = createPersuasionDialogue();
          persuasionDialogue.claim(persuasionDialogue.agents[1], 'healthy(restaurantTwo).');

          expect(() => {
            persuasionDialogue.question(persuasionDialogue.agents[0], 'healthy(restaurantTwo).');
          }).toThrow('Pre-conditions of agent one questioning if "restaurant two has property healthy" are not satisfied because agent two\'s commitment store contains the claim!');
        });
      });

      describe('not demo(∏_ag_i ∪ Com_ag_i, l)', () => {
        it('Passes if the agent cannot demonstrate the claim', () => {
          const persuasionDialogue = createPersuasionDialogue();

          expect(() => {
            persuasionDialogue.question(persuasionDialogue.agents[0], 'healthy(restaurantTwo).');
          }).not.toThrow();
        });

        it('Fails if the agent can demonstrate the claim', () => {
          const persuasionDialogue = createPersuasionDialogue();

          expect(() => {
            persuasionDialogue.question(persuasionDialogue.agents[0], 'healthy(restaurantOne).');
          }).toThrow('Pre-conditions of agent one questioning if "restaurant one has property healthy" are not satisfied because the agent can demonstrate the claim through their knowledge base and commitment store!');
        });
      });

      describe('p(X) ∈ B, where B is the set of terms in the body of the preference rule of O', () => {
        describe('Opponent', () => {
          it('Passes if the claim corresponds to a feature in the body of the agent\'s preference rule', () => {
            const persuasionDialogue = createPersuasionDialogue();

            expect(() => {
              persuasionDialogue.question(persuasionDialogue.agents[0], 'healthy(restaurantTwo).');
            }).not.toThrow();
          });

          it('Fails if the claim does not correspond to a feature in the body of the agent\'s preference rule', () => {
            const persuasionDialogue = createPersuasionDialogue();

            expect(() => {
              persuasionDialogue.question(persuasionDialogue.agents[0], 'atmosphere(restaurantTwo).');
            }).toThrow('Pre-conditions of agent one questioning if "restaurant two has property atmosphere" are not satisfied because the claim does not correspond to a feature in the body of the agent\'s preference rule!');
          });
        });

        describe('Proponent', () => {
          it('Passes if the claim corresponds to a feature in the body of the agent\'s preference rule', () => {
            const persuasionDialogue = createPersuasionDialogue();

            expect(() => {
              persuasionDialogue.question(persuasionDialogue.agents[1], 'cuisine(restaurantOne,cuisineTwo).');
            }).not.toThrow();
          });

          it('Passes if the claim does not correspond to a feature in the body of the agent\'s preference rule', () => {
            const persuasionDialogue = createPersuasionDialogue();

            expect(() => {
              persuasionDialogue.question(persuasionDialogue.agents[1], 'healthy(restaurantOne).');
            }).not.toThrow();
          });
        });
      });
    });

    describe('Post-conditions', () => {
      describe('Com_O ⇒ Com_O ∪ (p(X) ∈ B), where B is the set of terms in the body of the preference rule of O', () => {
        describe('Opponent', () => {
          it('Passes if p(X) ∈ B is added to the agent\'s commitment store', () => {
            const persuasionDialogue = createPersuasionDialogue();
            persuasionDialogue.question(persuasionDialogue.agents[0], 'healthy(restaurantTwo).');

            expect(persuasionDialogue.agents[0].commitmentStore).toContain('healthy(X):-cuisine(X,mediterranean).');
          });
        });

        describe('Proponent', () => {
          it('Passes if p(X) ∈ B is not added to the agent\'s commitment store', () => {
            const persuasionDialogue = createPersuasionDialogue();
            persuasionDialogue.question(persuasionDialogue.agents[1], 'healthy(restaurantOne).');

            expect(persuasionDialogue.agents[1].commitmentStore).not.toContain('healthy(X):-vegetables(X).');
          });
        });
      });
    });
  });
});
