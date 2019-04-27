import React, { Component } from 'react';

import DemoDialogue from './DemoDialogue';

import './Home.css'

class Home extends Component {
  render() {
    return (
      <div>
        <div className="bx--row">
          <div className="bx--offset-md-1 bx--col-md-10 bx--offset-xl-2 bx--col-xl-8">
            <div className="heading"></div>
            <h2 className="heading">Welcome</h2>
          </div>
        </div>
        <div className="bx--row">
          <div className="bx--offset-md-1 bx--col-md-10 bx--offset-xl-2 bx--col-xl-8">
            <p>
              Diners' Discourse lets you customise and generate persuasion and deliberation dialogues
              that are set in a classic restaurant selection scenario.
              The application also allows you to observe the differences between the two types side-by-side
              and to peek into the commitment stores of the participating agents at any point.
            </p>
            <p className="not-first">
              To learn more about the creation of Diners' Discourse
              and to gain more insight into dialogue protocols, go to "Background".
            </p>
            <p className="not-first">
              To start generating your own dialogues, go to "Generate".
            </p>
          </div>
        </div>
        <div className="bx--row">
          <div className="bx--offset-md-1 bx--col-md-10 bx--offset-xl-2 bx--col-xl-8">
            <div className="heading"></div>
            <h2 className="heading">Demo Dialogue</h2>
          </div>
        </div>
        <div className="bx--row">
          <div className="bx--offset-md-1 bx--col-md-10 bx--offset-xl-2 bx--col-xl-8">
            <p className="description">
              Check out a snippet of a persuasion dialogue below.
              You can see how the commitment stores of the agents evolve
              as they carry out various speech acts by expanding the accordion components.
              Hover over the tooltips for further explanations.
            </p>
          </div>
        </div>
        <div className="bx--row">
          <div className="bx--offset-md-1 bx--col-md-10 bx--offset-xl-2 bx--col-xl-8">
            <DemoDialogue />
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
