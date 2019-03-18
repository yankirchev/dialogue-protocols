import React, { Component } from 'react';

import { ListItem, UnorderedList, StructuredListBody, StructuredListCell, StructuredListHead, StructuredListRow, StructuredListWrapper } from 'carbon-components-react';

import './Background.css';

class Background extends Component {
  render() {
    return (
      <div>
        <div className="bx--row">
          <div className="bx--offset-md-1 bx--col-md-10 bx--offset-xl-2 bx--col-xl-8">
            <div className="heading"></div>
            <h2 className="heading">Purpose</h2>
          </div>
        </div>
        <div className="bx--row">
          <div className="bx--offset-md-1 bx--col-md-10 bx--offset-xl-2 bx--col-xl-8">
            <p className="paragraph">
              Diners' Discourse is a web application developed by Yanko Kirchev in 2019
              as part of his Honours Year Computer Science Project—<em>Implementing Dialogue Protocols</em>—to
              earn the degree of B.Sc. Hons. Computer Science with Year in Industry
              at the Department of Computer Science in the University of Liverpool.
            </p>
            <p className="paragraph">
              The application implements dialogue protocols for multi-agent systems
              based on the characterisations of persuasion and deliberation dialogues
              established in (Atkinson et al., 2013), which draws out the essential differences between the two types.
            </p>
            <p className="paragraph">
              Diners' Discourse uses the protocols to generate dialogues from the same set
              of predefined synthetic data (with some degree of customisation by the user),
              which are parallel to the dialogues set out in (Atkinson et al., 2013),
              and verifies that the protocols exhibit the expected results when put to practice.
            </p>
          </div>
        </div>
        <div className="bx--row">
          <div className="bx--offset-md-1 bx--col-md-10 bx--offset-xl-2 bx--col-xl-8">
            <div className="heading"></div>
            <h2 className="heading">Implementation</h2>
          </div>
        </div>
        <div className="bx--row">
          <div className="bx--offset-md-1 bx--col-md-10 bx--offset-xl-2 bx--col-xl-8">
            <p className="paragraph">
              The application is developed using the Node.js and React.js frameworks. The protocols rely heavily
              on the Tau Prolog module—a Prolog interpreter written entirely in JavaScript—
              which brings the needed functionality for knowledge representation to Diners' Discourse.
            </p>
            <p className="paragraph">
              On the front-end's side, Carbon Design's React.js components are utiilised
              to enable an efficient construction of the website while delivering a responsive UI.
            </p>
          </div>
        </div>
        <div className="bx--row">
          <div className="bx--offset-md-1 bx--col-md-10 bx--offset-xl-2 bx--col-xl-8">
            <div className="heading"></div>
            <h2 className="heading">Glossary</h2>
          </div>
        </div>
        <div className="bx--row">
          <div className="bx--offset-md-1 bx--col-md-10 bx--offset-xl-2 bx--col-xl-8">
            <StructuredListWrapper className="structured-list">
              <StructuredListHead>
                <StructuredListRow head>
                  <StructuredListCell head>Term</StructuredListCell>
                  <StructuredListCell head>Definition</StructuredListCell>
                </StructuredListRow>
              </StructuredListHead>
              <StructuredListBody>
                <StructuredListRow>
                  <StructuredListCell noWrap>Agent</StructuredListCell>
                  <StructuredListCell>
                    An autonomous computer entity which learns and uses knowledge
                    to execute independent actions towards achieving goals
                    (Russel and Norvig, 2003).
                  </StructuredListCell>
                </StructuredListRow>
                <StructuredListRow>
                  <StructuredListCell>Commitment Store</StructuredListCell>
                  <StructuredListCell>
                    A set of statements to which an agent has become committed
                    in the course of a dialogue (Atkinson et al., 2013).
                  </StructuredListCell>
                </StructuredListRow>
                <StructuredListRow>
                  <StructuredListCell>Deliberation dialogue</StructuredListCell>
                  <StructuredListCell>
                    A dialogue in which deliberation arises from a dilemma about what option is collectively acceptable
                    where each party tries to find the best available course of action for the group as a whole
                    (Walton and Krabbe, 1998).
                  </StructuredListCell>
                </StructuredListRow>
                <StructuredListRow>
                  <StructuredListCell>Persuasion dialogue</StructuredListCell>
                  <StructuredListCell>
                    A dialogue in which persuasion arises from a conflict of opinions on what the best available choice of action is
                    where one party tries to persuade the other(s) towards their preferred option
                    (Walton and Krabbe, 1998).
                  </StructuredListCell>
                </StructuredListRow>
                <StructuredListRow>
                  <StructuredListCell>Protocol</StructuredListCell>
                  <StructuredListCell>

                  </StructuredListCell>
                </StructuredListRow>
                <StructuredListRow>
                  <StructuredListCell noWrap>Speech acts</StructuredListCell>
                  <StructuredListCell>
                    A set of moves which participating agents in a dialogue can make in regards to statements.
                    They comprise "claim", "why", "concede", "retract", "since", and "question"
                    (Prakken, 2006).
                  </StructuredListCell>
                </StructuredListRow>
              </StructuredListBody>
            </StructuredListWrapper>
          </div>
        </div>
        <div className="bx--row">
          <div className="bx--offset-md-1 bx--col-md-10 bx--offset-xl-2 bx--col-xl-8">
            <div className="heading"></div>
            <h2 className="heading">References</h2>
          </div>
        </div>
        <div className="bx--row">
          <div className="bx--offset-md-1 bx--col-md-10 bx--offset-xl-2 bx--col-xl-8">
            <UnorderedList>
              <ListItem className="list-item reference">
                Atkinson, K., Bench-Capon, T., & Walton, D. (2013):
                Distinctive features of persuasion and deliberation dialogues.
                <em> Argument and Computation</em>, 4(2), 105-127.
              </ListItem>
              <ListItem className="list-item reference">
                Prakken, H. (2006). Formal Systems for Persuasion Dialogue.
                <em> The Knowledge Engineering Review</em>, 21(2), 163–188.
               </ListItem>
              <ListItem className="list-item reference">
                Russell S., & Norvig, P. (2003). <em>Artificial Intelligence: A Modern Approach</em> (2nd ed.).
                Upper Saddle River, New Jersey: Prentice Hall.
              </ListItem>
              <ListItem className="list-item reference">
                Walton, D., & Krabbe, E. (1995). <em>Commitment in Dialogue: Basic Concepts of Interpersonal Reasoning</em>.
                Albany, New York: State University of New York Press.
              </ListItem>
            </UnorderedList>
          </div>
        </div>
      </div>
    );
  }
}

export default Background;
