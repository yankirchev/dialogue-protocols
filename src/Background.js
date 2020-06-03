import React, { Component } from 'react';

import { ListItem, OrderedList, StructuredListBody, StructuredListCell, StructuredListHead, StructuredListRow, StructuredListWrapper } from 'carbon-components-react';

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
            <p>
              Diners' Discourse is a web application developed by Yanko Kirchev in 2019
              as part of his Honours Year Computer Science Project—<em>Implementing Dialogue Protocols</em>—to
              earn the degree of B.Sc. (Hons) Computer Science with Year in Industry
              at the Department of Computer Science at the University of Liverpool.
            </p>
            <p className="not-first">
              The application and the research done to accomplish its development were also featured in
              Kirchev, Atkinson, and Bench-Capon's paper
              <em> Demonstrating the Distinctions Between Persuasion and Deliberation Dialogues</em> [1],
              which was presented by Yanko Kirchev at the 39th SGAI International Conference on Artificial Intelligence
              held at the University of Cambridge.
            </p>
            <p className="not-first">
              The application implements dialogue protocols for multi-agent systems
              based on the characterisations of persuasion and deliberation dialogues
              established by Atkinson, Bench-Capon, and Walton [2],
              which draw out the distinctive features of the two types.
            </p>
            <p className="not-first">
              Diners' Discourse uses the protocols to generate custom persuasion and deliberation dialogues,
              which are parallel to the ones laid out in [2],
              and verifies that the protocols exhibit the expected behaviour when they are put to practice.
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
            <p>
              The application is developed using the Node.js and React.js frameworks.
              The protocols rely heavily on the Tau Prolog module—a Prolog interpreter written entirely in JavaScript—
              which brings the required support for knowledge representation to Diners' Discourse.
            </p>
            <p className="not-first">
              On the front-end's side, Carbon Design's React.js components are utilised,
              which allowed for the efficient construction of an intuitive and responsive web interface.
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
                    An autonomous computer entity that learns and uses knowledge
                    to execute independent actions towards achieving goals [3].
                  </StructuredListCell>
                </StructuredListRow>
                <StructuredListRow>
                  <StructuredListCell>Commitment Store</StructuredListCell>
                  <StructuredListCell>
                    A set of statements to which an agent becomes committed
                    in the course of a dialogue [2].
                  </StructuredListCell>
                </StructuredListRow>
                <StructuredListRow>
                  <StructuredListCell>Deliberation dialogue</StructuredListCell>
                  <StructuredListCell>
                    A dialogue in which deliberation arises from a dilemma
                    about what option is collectively acceptable
                    where each party tries to find the best available course of action
                    for the group as a whole [4].
                  </StructuredListCell>
                </StructuredListRow>
                <StructuredListRow>
                  <StructuredListCell>Persuasion dialogue</StructuredListCell>
                  <StructuredListCell>
                    A dialogue in which persuasion arises from a conflict of opinions
                    on what the best available choice of action is
                    where one party tries to persuade the other(s)
                    towards their preferred option [4].
                  </StructuredListCell>
                </StructuredListRow>
                <StructuredListRow>
                  <StructuredListCell noWrap>Post-conditions</StructuredListCell>
                  <StructuredListCell>
                    A set of conditions that state the updates on the agents’ commitment stores
                    that occur immediately after the execution of a speech act [2].
                  </StructuredListCell>
                </StructuredListRow>
                <StructuredListRow>
                  <StructuredListCell noWrap>Pre-conditions</StructuredListCell>
                  <StructuredListCell>
                    A set of conditions that determine the prerequisites that need to be satisfied
                    in terms of available knowledge and prior commitments
                    in order for a speech act to be used legally [2].
                  </StructuredListCell>
                </StructuredListRow>
                <StructuredListRow>
                  <StructuredListCell>Protocol</StructuredListCell>
                  <StructuredListCell>
                    Rules by which a dialogue pans out. These can specify the allowed speech acts at any point,
                    the effects of utterances on the participants’ commitments, the outcome of the dialogue,
                    the turn-taking function, and the termination criteria [5].
                  </StructuredListCell>
                </StructuredListRow>
                <StructuredListRow>
                  <StructuredListCell noWrap>Speech acts</StructuredListCell>
                  <StructuredListCell>
                    A set of moves that agents participating in a dialogue can make in regard to statements.
                    They comprise "claim", "counterclaim", "why", "concede", "retract", "since", "concede-since" and “question". [1]
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
            <OrderedList>
              <ListItem className="list-item reference">
                Y. Kirchev, K. Atkinson, and T. Bench-Capon,
                “Demonstrating the Distinctions Between Persuasion and Deliberation Dialogues,”
                <em> Lecture Notes in Computer Science</em>, vol. 11927, pp. 93–106, Nov. 2019.
              </ListItem>
              <ListItem className="list-item reference">
                K. Atkinson, T. Bench-Capon, and D. Walton,
                “Distinctive features of persuasion and deliberation dialogues”,
                <em> Argument and Computation</em>, vol. 4, no. 2, pp. 105-127, June 2013.
              </ListItem>
              <ListItem className="list-item reference">
                S. Russell and P. Norvig, <em>Artificial Intelligence: A Modern Approach</em>,
                2nd ed. Upper Saddle River, NJ: Pearson Prentice Hall, 2006.
              </ListItem>
              <ListItem className="list-item reference">
                D. Walton and E. C. W. Krabbe,
                <em> Commitment in Dialogue: Basic Concepts of Interpersonal Reasoning</em>.
                Albany, NY: State University of New York Press, 1995.
              </ListItem>
              <ListItem className="list-item reference">
                H. Prakken, “Formal systems for persuasion dialogue”,
                <em> The Knowledge Engineering Review</em>, vol. 21, no. 2, pp. 163–188, Aug. 2006
              </ListItem>
            </OrderedList>
          </div>
        </div>
      </div>
    );
  }
}

export default Background;
