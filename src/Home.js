import React, { Component } from 'react';

import DemoDialogue from './DemoDialogue';

class Home extends Component {
  render() {
    return (
      <div>
        <div className="bx--row">
          <div className="bx--offset-md-1 bx--col-md-10 bx--offset-xl-2 bx--col-xl-8">
            <div className="heading"></div>
            <h2 className="heading">About</h2>
          </div>
        </div>
        <div className="bx--row">
          <div className="bx--offset-md-1 bx--col-md-10 bx--offset-xl-2 bx--col-xl-8">
            <p className="paragraph">
              Diners' Discourse lets you generate persuasion and deliberation dialogues set in a
              familiar restaurant selection scenario and showcases their differences side-by-side.
            </p>
            <p className="paragraph">
              To learn more about the creation of this web application, go to "Background".
            </p>
            <p className="paragraph">
              To start generating dialogues, go to "Generate".
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
            <DemoDialogue />
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
