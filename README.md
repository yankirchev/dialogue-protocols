## About

Diners' Discourse is a web application developed by Yanko Kirchev in 2019 as part of his Honours Year Computer Science Project—_Implementing Dialogue Protocols_—to earn the degree of B.Sc. (Hons) Computer Science with Year in Industry at the Department of Computer Science at the University of Liverpool.

The applications implements dialogue protocols for multi-agent systems based on the characterisations of persuasion and deliberation dialogues established in (Atkinson et al., 2013), which draws out the essential differences between the two types. 

The protocols are used to generate dialogues from the same set of predefined synthetic data (with some degree of customisation by the user), which are parallel to the dialogues set out in (Atkinson et al., 2013), and verifies that the protocols exhibit the expected results when put to practice. 

Moreover, Diners' Discourse lets you observe the differences between the two types side-by-side and to peek into the commitment stores of the participating agents at any point.

## Project Architecture

```
public                // Public files
src                   // Front-end scripts
└── protocols         // Dialogue protocols
    ├── test          // Protocols' tests
    └── utils         // Protocols' utility files 
```

## Running Locally

To run a development build, simply download the repository, change into its directory, install the required packages(`npm install`), and start it(`npm start`). You should be directed to `htpp://localhost:3000` in your browser shortly after.

## Testing

The tests use the `Jest` framework and are triggered by running `npm test`. The test cases cover every pre- and post-condition of every speech act for each type of dialogue.

## Implementation Details

The application is developed using the Node.js and React.js frameworks. The protocols rely heavily on the Tau Prolog module—a Prolog interpreter written entirely in JavaScript— which brings the needed functionality for knowledge representation to Diners' Discourse.

On the front-end's side, Carbon Design's React.js components are utilised to enable an efficient construction of the website while delivering a responsive UI.

## Glossary

|Term|Definition| 
|----|----------|
|Agent|An autonomous computer entity which learns and uses knowledge to execute independent actions towards achieving goals (Russel and Norvig, 2003).|
Commitment Store|A set of statements to which an agent has become committed in the course of a dialogue (Atkinson et al., 2013).|
Deliberation dialogue|A dialogue in which deliberation arises from a dilemma about what option is collectively acceptable where each party tries to find the best available course of action for the group as a whole (Walton and Krabbe, 1998).|
Persuasion dialogue|A dialogue in which persuasion arises from a conflict of opinions on what the best available choice of action is where one party tries to persuade the other(s) towards their preferred option (Walton and Krabbe, 1998).|
Protocol|Rules by which a dialogue pans out. These can specify the allowed speech acts at any point, the effects of utterances on the participants’ commitments, the outcome of the dialogue, the turn-taking function, and the termination criteria (Prakken, 2006).|
Speech acts|A set of moves which participating agents in a dialogue can make in regards to statements. They comprise "claim", "why", "concede", "retract", "since", and "question" (Prakken, 2006).|

## References

- Atkinson, K., Bench-Capon, T., & Walton, D. (2013). Distinctive features of persuasion and deliberation dialogues. _Argument and Computation_, 4(2), 105-127.
- Prakken, H. (2006). Formal Systems for Persuasion Dialogue. _The Knowledge Engineering Review_, 21(2), 163–188.
- Russell S., & Norvig, P. (2003). _Artificial Intelligence: A Modern Approach (2nd ed.)_. Upper Saddle River, New Jersey: Prentice Hall.
- Walton, D., & Krabbe, E. (1995). _Commitment in Dialogue: Basic Concepts of Interpersonal Reasoning_. Albany, New York: State University of New York Press.
