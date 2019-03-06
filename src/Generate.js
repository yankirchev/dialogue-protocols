import React, { Component } from "react";
import { Button, FormGroup, ProgressIndicator, ProgressStep, RadioButton, RadioButtonGroup, TextInput } from 'carbon-components-react';

import DialogueAccordion from './DialogueAccordion';
import Simulation from './protocols/Simulation';

import './Generate.css';

class Generate extends Component {
  constructor() {
    super();

    this.state = {
      progressIndex: 0,
      firstAgentsName: '',
      secondAgentsName: '',
      thirdAgentsName: '',
      isFirstAgentsNameInvalid: false,
      isSecondAgentsNameInvalid: false,
      isThirdAgentsNameInvalid: false,
      firstRestaurantsName: '',
      secondRestaurantsName: '',
      thirdRestaurantsName: '',
      isFirstRestaurantsNameInvalid: false,
      isSecondRestaurantsNameInvalid: false,
      isThirdRestaurantsNameInvalid: false,
      firstRestaurantsCuisine: 'Italian',
      secondRestaurantsCuisine: 'Thai',
      thirdRestaurantsCuisine: 'American',
      beverage: 'Wine',
      simulation: null
    };

    this.decrementProgressIndex = this.decrementProgressIndex.bind(this);
    this.incrementProgressIndex = this.incrementProgressIndex.bind(this);
    this.onChange = this.onChange.bind(this);
    this.checkInputValues = this.checkInputValues.bind(this);
    this.resetState = this.resetState.bind(this);
  }

  decrementProgressIndex() {
    this.setState({
      progressIndex: this.state.progressIndex - 1
    });
  }

  incrementProgressIndex() {
    if (this.checkInputValues()) {
      if (this.state.progressIndex + 1 === 4) {
        this.setState({
          simulation: new Simulation(
            [this.state.firstAgentsName, this.state.secondAgentsName, this.state.thirdAgentsName],
            [this.state.firstRestaurantsName, this.state.secondRestaurantsName, this.state.thirdRestaurantsName],
            [this.state.firstRestaurantsCuisine, this.state.secondRestaurantsCuisine, this.state.thirdRestaurantsCuisine],
            this.state.beverage)
        });
      }

      this.setState({
        progressIndex: this.state.progressIndex + 1
      });
    }
  }

  onChange(event) {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  checkInputValues() {
    switch (this.state.progressIndex) {
      case 0:
        this.state.firstAgentsName === '' ? this.setState({ isFirstAgentsNameInvalid: true }) : this.setState({ isFirstAgentsNameInvalid: false });
        this.state.secondAgentsName === '' ? this.setState({ isSecondAgentsNameInvalid: true }) : this.setState({ isSecondAgentsNameInvalid: false });
        this.state.thirdAgentsName === '' ? this.setState({ isThirdAgentsNameInvalid: true }) : this.setState({ isThirdAgentsNameInvalid: false });

        if (this.state.firstAgentsName === '' || this.state.secondAgentsName === '' || this.state.thirdAgentsName === '') {
          return false;
        } else {
          return true;
        }
      case 1:
        this.state.firstRestaurantsName === '' ? this.setState({ isFirstRestaurantsNameInvalid: true }) : this.setState({ isFirstRestaurantsNameInvalid: false });
        this.state.secondRestaurantsName === '' ? this.setState({ isSecondRestaurantsNameInvalid: true }) : this.setState({ isSecondRestaurantsNameInvalid: false });
        this.state.thirdRestaurantsName === '' ? this.setState({ isThirdRestaurantsNameInvalid: true }) : this.setState({ isThirdRestaurantsNameInvalid: false });

        if (this.state.firstRestaurantsName === '' || this.state.secondRestaurantsName === '' || this.state.thirdRestaurantsName === '') {
          return false;
        } else {
          return true;
        }
      default:
        return true;
    }
  }

  resetState() {
    this.setState({
      progressIndex: 0,
      firstAgentsName: '',
      secondAgentsName: '',
      thirdAgentsName: '',
      isFirstAgentsNameInvalid: false,
      isSecondAgentsNameInvalid: false,
      isThirdAgentsNameInvalid: false,
      firstRestaurantsName: '',
      secondRestaurantsName: '',
      thirdRestaurantsName: '',
      isFirstRestaurantsNameInvalid: false,
      isSecondRestaurantsNameInvalid: false,
      isThirdRestaurantsNameInvalid: false,
      firstRestaurantsCuisine: 'Italian',
      secondRestaurantsCuisine: 'Thai',
      thirdRestaurantsCuisine: 'American',
      beverage: 'Wine',
      simulation: null
    });
  }

  render() {
    return (
      <div>
        {this.state.progressIndex !== 4 && (
          <div>
            <div hidden={this.state.progressIndex !== 0}>
              <div className="bx--row">
                <div className="bx--col-xs-12">
                  <p className="generate-paragraph">
                    Choose names for the agents who will be participating in the dialogue:
                </p>
                </div>
              </div>
              <div className="bx--row">
                <div className="text-input-wrapper">
                  <div className="bx--col-xs-12 bx--col-md-4">
                    <TextInput
                      id="firstAgentsName"
                      className="text-input"
                      labelText="First agent's name"
                      invalid={this.state.isFirstAgentsNameInvalid}
                      invalidText="Please provide a valid name"
                      onChange={this.onChange}
                    />
                  </div>
                  <div className="bx--col-xs-12 bx--col-md-4">
                    <TextInput
                      id="secondAgentsName"
                      className="text-input"
                      labelText="Second agent's name"
                      invalid={this.state.isSecondAgentsNameInvalid}
                      invalidText="Please provide a valid name"
                      onChange={this.onChange}
                    />
                  </div>
                  <div className="bx--col-xs-12 bx--col-md-4">
                    <TextInput
                      id="thirdAgentsName"
                      className="text-input"
                      labelText="Third agent's name"
                      invalid={this.state.isThirdAgentsNameInvalid}
                      invalidText="Please provide a valid name"
                      onChange={this.onChange}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div hidden={this.state.progressIndex !== 1}>
              <div className="bx--row">
                <div className="bx--col-xs-12">
                  <p className="generate-paragraph">
                    Choose names for the restaurants which the dialogue will revolve around:
                </p>
                </div>
              </div>
              <div className="bx--row">
                <div className="text-input-wrapper">
                  <div className="bx--col-xs-12 bx--col-md-4">
                    <TextInput
                      id="firstRestaurantsName"
                      className="text-input"
                      labelText="First restaurant's name"
                      invalid={this.state.isFirstRestaurantsNameInvalid}
                      invalidText="Please provide a valid name"
                      onChange={this.onChange}
                    />
                  </div>
                  <div className="bx--col-xs-12 bx--col-md-4">
                    <TextInput
                      id="secondRestaurantsName"
                      className="text-input"
                      labelText="Second restaurant's name"
                      invalid={this.state.isSecondRestaurantsNameInvalid}
                      invalidText="Please provide a valid name"
                      onChange={this.onChange}
                    />
                  </div>
                  <div className="bx--col-xs-12 bx--col-md-4">
                    <TextInput
                      id="thirdRestaurantsName"
                      className="text-input"
                      labelText="Third restaurant's name"
                      invalid={this.state.isThirdRestaurantsNameInvalid}
                      invalidText="Please provide a valid name"
                      onChange={this.onChange}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div hidden={this.state.progressIndex !== 2}>
              <div className="bx--row">
                <div className="bx--col-xs-12">
                  <p className="generate-paragraph">
                    Choose the cuisines for each restaurant:
                </p>
                </div>
              </div>
              <div className="bx--row">
                <div className="radio-button-groups-wrapper">
                  <div className="bx--col-xs-12 bx--col-md-4">
                    <FormGroup legendText="First restaurant's cuisine">
                      <RadioButtonGroup
                        name="first-restaurants-cuisine-radio-button-group"
                        valueSelected="Italian"
                        onChange={(event) => this.setState({ firstRestaurantsCuisine: event })}
                      >
                        <RadioButton value="Italian" labelText="Italian" />
                        <RadioButton value="Greek" labelText="Greek" />
                        <RadioButton value="Spanish" labelText="Spanish" />
                      </RadioButtonGroup>
                    </FormGroup>
                  </div>
                  <div className="bx--col-xs-12 bx--col-md-4">
                    <FormGroup legendText="Second restaurant's cuisine">
                      <RadioButtonGroup
                        name="second-restaurants-cuisine-radio-button-group"
                        valueSelected="Thai"
                        onChange={(event) => this.setState({ secondRestaurantsCuisine: event })}
                      >
                        <RadioButton value="Thai" labelText="Thai" />
                        <RadioButton value="Indian" labelText="Indian" />
                        <RadioButton value="Japanese" labelText="Japanese" />
                      </RadioButtonGroup>
                    </FormGroup>
                  </div>
                  <div className="bx--col-xs-12 bx--col-md-4">
                    <FormGroup legendText="Third restaurant's cuisine">
                      <RadioButtonGroup
                        name="third-restaurants-cuisine-radio-button-group"
                        valueSelected="American"
                        onChange={(event) => this.setState({ thirdRestaurantsCuisine: event })}
                      >
                        <RadioButton value="American" labelText="American" />
                        <RadioButton value="Bulgarian" labelText="Bulgarian" />
                        <RadioButton value="Turkish" labelText="Turkish" />
                      </RadioButtonGroup>
                    </FormGroup>
                  </div>
                </div>
              </div>
            </div>
            <div hidden={this.state.progressIndex !== 3}>
              <div className="bx--row">
                <div className="bx--col-xs-12">
                  <p className="generate-paragraph">
                    Choose the beverage which will be preferred by the agents:
                </p>
                </div>
              </div>
              <div className="bx--row">
                <div className="radio-button-groups-wrapper">
                  <div className="bx--col-xs-12">
                    <FormGroup legendText="Beverage">
                      <RadioButtonGroup
                        name="beverage-radio-button-group"
                        valueSelected="Wine"
                        onChange={(event) => this.setState({ beverage: event })}
                      >
                        <RadioButton value="Wine" labelText="Wine" />
                        <RadioButton value="Champagne" labelText="Champagne" />
                        <RadioButton value="Cocktails" labelText="Cocktails" />
                      </RadioButtonGroup>
                    </FormGroup>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="bx--row">
                <div className="bx--col-xs-12">
                  <div className="progress-buttons-wrapper">
                    <Button className="progress-button" kind="secondary" onClick={this.decrementProgressIndex} disabled={this.state.progressIndex === 0}>
                      Previous
                  </Button>
                    <Button className="progress-button" onClick={this.incrementProgressIndex}>
                      {this.state.progressIndex !== 3 ? "Next" : "Generate"}
                    </Button>
                  </div>
                </div>
              </div>
              <div className="bw--row">
                <div className="bx--col-xs-12">
                  <div className="progress-indicator">
                    <ProgressIndicator currentIndex={this.state.progressIndex}>
                      <ProgressStep label="Agents' names" description="Choose names for the agents" />
                      <ProgressStep label="Restaurants' names" description="Choose names for the restaurants" />
                      <ProgressStep label="Restaurants' cuisines" description="Pick the restaurants' cuisines" />
                      <ProgressStep label="Beverage" description="Pick the preferred beverage" />
                    </ProgressIndicator>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {this.state.progressIndex === 4 && this.state.simulation && (
          <div>
            <div className="bx--row">
              <div className="bx--col-xs-12 bx--col-md-6">
                <DialogueAccordion dialogue={this.state.simulation.simulatePersuasionDialogue()} />
              </div>
              <div className="bx--col-xs-12 bx--col-md-6">
                <DialogueAccordion dialogue={this.state.simulation.simulateDeliberationDialogue()} />
              </div>
            </div>
            <div className="bx--row">
              <div className="bx--col-xs-12">
                <div className="reset-button">
                  <Button kind="danger" onClick={this.resetState}>
                    Reset Dialogues
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default Generate;
