import React, { Component } from 'react';
import { Button, ContentSwitcher, Link, Switch } from 'carbon-components-react';

import Background from './Background';
import Generate from './Generate';
import Home from './Home';

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
    this.setState({
      switchIndex: event.index
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
                <h1 className="header">Diners' Discourse</h1>
              </div>
            </div>
          </div>
        </div>
        <div className="bx--grid">
          <div className="bx--row">
            <div className="bx--offset-md-1 bx--col-md-10 bx--offset-xl-2 bx--col-xl-8">
              <ContentSwitcher className="content-switcher" onChange={this.onChange}>
                <Switch name="home" text="Home" />
                <Switch name="background" text="Background" />
                <Switch name="generate" text="Generate" />
              </ContentSwitcher>
            </div>
          </div>
          <div hidden={this.state.switchIndex !== 0}>
            <Home />
          </div>
          <div hidden={this.state.switchIndex !== 1}>
            <Background />
          </div>
          <div hidden={this.state.switchIndex !== 2}>
            <Generate />
          </div>
        </div>
        <footer className="bx--footer bx--footer--bottom-fixed footer">
          <div className="bx--footer-info">
            <div className="bx--footer-info__item">
              <p className="bx--footer-label">Copyright &copy; Yanko Kirchev 2019</p>
              <Link href="mailto:yankirchev.dinersdiscourse@gmail.com">Contact the author</Link>
            </div>
            <div className="bx--footer-info__item">
              <p className="bx--footer-label">Powered by Carbon Components (React)</p>
              <Link href="https://www.carbondesignsystem.com">Carbon Design System</Link>
            </div>
            <div className="bx--footer-info__item">
              <p className="bx--footer-label">Powered by Tau Prolog</p>
              <Link href="http://tau-prolog.org">Tau Prolog</Link>
            </div>
          </div>
        </footer>
      </div>
    );
  }
}

export default App;
