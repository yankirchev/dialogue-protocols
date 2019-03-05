import React, { Component } from 'react';
import { ContentSwitcher, Footer, Switch } from 'carbon-components-react'

import Generate from './Generate';

import './App.css';

class App extends Component {
  constructor() {
    super();

    this.state = {
      switchIndex: 0
    };

    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    this.setState({ switchIndex: event.index });
  }

  render() {
    return (
      <div>
        <div className="bx--grid">
          <div className="bx--row">
            <div className="bx--col-xs-12">
              <h1 className="app-title">Diners' Discourse</h1>
            </div>
          </div>
          <div className="bx--row">
            <div className="bx--col-xs-12">
              <ContentSwitcher className="content-switcher" onChange={this.onChange}>
                <Switch name="home" text="Home" />
                <Switch name="background" text="Background" />
                <Switch name="generate" text="Generate" />
              </ContentSwitcher>
            </div>
          </div>
          {this.state.switchIndex === 0 && (
            <div className="bx--row">
              <div className="bx--col-xs-12">
                <p className="home-paragraph">
                  Diners' Discourse lets you generate persuasion and deliberation dialogues set in a
                  familiar restaurant selection scenario and showcases their differences side-by-side.
                </p>
                <p className="home-paragraph">
                  To learn more about the creation of this web application, go to "Background".
                </p>
                <p className="home-paragraph">
                  To start generating dialogues, go to "Generate".
                </p>
              </div>
            </div>
          )}
          {this.state.switchIndex === 1 && (
            <div className="bx--row">
              <div className="bx--col-xs-12">
                <p className="home-paragraph">
                  TBA
                </p>
              </div>
            </div>
          )}
          {this.state.switchIndex === 2 && (
            <p className="home-paragraph">
              TBA
            </p>
          )}
        </div>
        <Footer
          labelOne="Copyright &copy; 2019 Yanko Kirchev"
          linkTextOne="Contact the author"
          linkHrefOne="mailto:sgykirch@liverpool.ac.uk"
          labelTwo="Department of Computer Science, University of Liverpool"
          linkTextTwo="Contact the department"
          linkHrefTwo="mailto:cstudy@liverpool.ac.uk"
        />
      </div>
    );
  }
}

export default App;
