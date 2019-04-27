## About

Diners' Discourse is a web application developed by Yanko Kirchev in 2019 as part of his Honours Year Computer Science Project—Implementing Dialogue Protocols—to earn the degree of B.Sc. (Hons) Computer Science with Year in Industry at the Department of Computer Science at the University of Liverpool.

The application implements dialogue protocols for multi-agent systems based on the characterisations of persuasion and deliberation dialogues established by Atkinson, Bench-Capon, and Walton \[2\], which draw out the distinctive features of the two types.

Diners' Discourse uses the protocols to generate custom persuasion and deliberation dialogues (with some degree of customisation by the user), which are set in a classic restaurant selection scenario and are parallel to the ones laid out in \[2\], and verifies that the protocols exhibit the expected behaviour when they are put to practice.

Furthermore, the application also allows you to observe the differences between the two types side-by-side and to peek into the commitment stores of the participating agents at any point.

## Project Architecture

```
public                // Public files
src                   // Interface components
└── protocols         // Protocols' classes
    ├── test          // Protocols' tests
    └── utils         // Protocols' utility files 
```

## Running the Project Locally

To run a development build, simply download the repository, change into its directory, install the required packages(`npm install`), and start it(`npm start`). You should be directed to `htpp://localhost:3000` in your browser shortly after.

## Testing the Project

The tests use the `Jest` framework and are triggered by running `npm test`. The test cases cover every pre- and post-condition of every speech act for each type of dialogue protocol.

## Implementation Details

The application is developed using the Node.js and React.js frameworks. The protocols rely heavily on the Tau Prolog module—a Prolog interpreter written entirely in JavaScript— which brings the required support for knowledge representation to Diners' Discourse.

On the front-end's side, Carbon Design's React.js components are utilised, which allowed for the efficient construction of an intuitive and responsive web interface.

## Glossary

|Term|Definition| 
|----|----------|
|Agent|	An autonomous computer entity that learns and uses knowledge to execute independent actions towards achieving goals \[1\].|
Commitment Store|A set of statements to which an agent becomes committed in the course of a dialogue \[2\].|
Deliberation dialogue|A dialogue in which deliberation arises from a dilemma about what option is collectively acceptable where each party tries to find the best available course of action for the group as a whole \[3\].|
Persuasion dialogue|A dialogue in which persuasion arises from a conflict of opinions on what the best available choice of action is where one party tries to persuade the other(s) towards their preferred option \[3\].|
Post-conditions|A set of conditions that state the updates on the agents’ commitment stores that occur immediately after the execution of a speech act \[2\].|
Pre-conditions|A set of conditions that determine the prerequisites that need to be satisfied in terms of available knowledge and prior commitments in order for a speech act to be used legally \[2\].|
Protocol|Rules by which a dialogue pans out. These can specify the allowed speech acts at any point, the effects of utterances on the participants’ commitments, the outcome of the dialogue, the turn-taking function, and the termination criteria \[4\].|
Speech acts|A set of moves that agents participating in a dialogue can make in regard to statements. They comprise "claim", "counterclaim", "why", "concede", "retract", "since", "concede-since" and “question" \[4\].|

## References

1. S. Russell and P. Norvig, Artificial Intelligence: A Modern Approach, 2nd ed. Upper Saddle River, NJ: Pearson Prentice Hall, 2006.
2. K. Atkinson, T. Bench-Capon, and D. Walton, “Distinctive features of persuasion and deliberation dialogues”,Argument and Computation, vol. 4, no. 2, pp. 105-127, June 2013.
3. D. Walton and E. C. W. Krabbe,Commitment in Dialogue: Basic Concepts of Interpersonal Reasoning. Albany, NY: State University of New York Press, 1995.
4. H. Prakken, “Formal systems for persuasion dialogue”,The Knowledge Engineering Review, vol. 21, no. 2, pp. 163–188, Aug. 2006
