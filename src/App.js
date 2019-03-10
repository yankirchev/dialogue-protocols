import React, { Component } from 'react';
import { Button, ContentSwitcher, Switch } from 'carbon-components-react';

import Generate from './Generate';
import Home from './Home';

import './App.css';

class App extends Component {
  constructor() {
    super();

    this.state = {
      switchIndex: 0,
      switchName: 'Diners\' Discourse'
    };

    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    this.setState({
      switchIndex: event.index,
      switchName: event.name
    });
  }

  render() {
    return (
      <div>
        <div className="announcement">
          <p className="announcement">Check out the source code of this website.</p>
          <Button small className="announcement" kind="tertiary" onClick={() => window.open('https://github.com/yankirchev/diners-discourse', '_blank').focus()}>
            Go to GitHub
          </Button>
        </div>
        <div className="header">
          <div className="bx--grid">
            <div className="bx--row">
              <div className="bx--offset-md-1 bx--col-md-10 bx--offset-xl-2 bx--col-xl-8">
                <h1 className="header">{this.state.switchName}</h1>
              </div>
            </div>
          </div>
        </div>
        <div className="bx--grid">
          <div className="bx--row">
            <div className="bx--offset-md-1 bx--col-md-10 bx--offset-xl-2 bx--col-xl-8">
              <ContentSwitcher className="content-switcher" onChange={this.onChange}>
                <Switch name="Diners' Discourse" text="Home" />
                <Switch name="Background" text="Background" />
                <Switch name="Generate" text="Generate" />
              </ContentSwitcher>
            </div>
          </div>
          <div hidden={this.state.switchIndex !== 0}>
            <Home />
          </div>
          <div hidden={this.state.switchIndex !== 1}>
            <div className="bx--row">
              <div className="bx--offset-md-1 bx--col-md-10 bx--offset-xl-2 bx--col-xl-8">
                <div className="heading"></div>
                <h2 className="heading">TBA</h2>
              </div>
            </div>
            <div className="bx--row">
              <div className="bx--offset-md-1 bx--col-md-10 bx--offset-xl-2 bx--col-xl-8">
                <p className="paragraph">
                  TBA
                </p>
              </div>
            </div>
          </div>
          <div hidden={this.state.switchIndex !== 2}>
            <Generate />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
