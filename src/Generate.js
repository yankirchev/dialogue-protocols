import React, { Component } from "react";
import { Button, FormGroup, InlineNotification, RadioButton, RadioButtonGroup, TextInput } from 'carbon-components-react';

import DialogueAccordion from './DialogueAccordion';
import Simulation from './protocols/Simulation';

import './Generate.css';

class Generate extends Component {
  constructor() {
    super();

    this.state = {
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
      isErrorNotificationVisible: false,
      simulation: null
    };

    this.onChange = this.onChange.bind(this);
    this.checkInputValues = this.checkInputValues.bind(this);
    this.generateDialogues = this.generateDialogues.bind(this);
    this.resetState = this.resetState.bind(this);
  }

  onChange(event) {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  checkInputValues() {
    this.state.firstAgentsName === '' ? this.setState({ isFirstAgentsNameInvalid: true }) : this.setState({ isFirstAgentsNameInvalid: false });
    this.state.secondAgentsName === '' ? this.setState({ isSecondAgentsNameInvalid: true }) : this.setState({ isSecondAgentsNameInvalid: false });
    this.state.thirdAgentsName === '' ? this.setState({ isThirdAgentsNameInvalid: true }) : this.setState({ isThirdAgentsNameInvalid: false });
    this.state.firstRestaurantsName === '' ? this.setState({ isFirstRestaurantsNameInvalid: true }) : this.setState({ isFirstRestaurantsNameInvalid: false });
    this.state.secondRestaurantsName === '' ? this.setState({ isSecondRestaurantsNameInvalid: true }) : this.setState({ isSecondRestaurantsNameInvalid: false });
    this.state.thirdRestaurantsName === '' ? this.setState({ isThirdRestaurantsNameInvalid: true }) : this.setState({ isThirdRestaurantsNameInvalid: false });

    if (this.state.firstAgentsName === '' || this.state.secondAgentsName === '' || this.state.thirdAgentsName === ''
      || this.state.firstRestaurantsName === '' || this.state.secondRestaurantsName === '' || this.state.thirdRestaurantsName === '') {

      this.setState({
        isErrorNotificationVisible: true
      });

      return false;
    }

    return true;
  }

  generateDialogues() {
    if (this.checkInputValues()) {
      this.setState({
        simulation: new Simulation(
          [this.state.firstAgentsName, this.state.secondAgentsName, this.state.thirdAgentsName],
          [this.state.firstRestaurantsName, this.state.secondRestaurantsName, this.state.thirdRestaurantsName],
          [this.state.firstRestaurantsCuisine, this.state.secondRestaurantsCuisine, this.state.thirdRestaurantsCuisine],
          this.state.beverage
        )
      });
    }
  }

  resetState() {
    this.setState({
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
      isErrorNotificationVisible: false,
      simulation: null
    });
  }

  render() {
    return (
      <div>
        {!this.state.simulation && (
          <div>
            <div className="bx--row">
              <div className="bx--offset-md-1 bx--col-md-10 bx--offset-xl-2 bx--col-xl-8">
                <div className="heading"></div>
                <h2 className="heading">Customise</h2>
              </div>
            </div>
            <div className="bx--row">
              <div className="bx--offset-md-1 bx--col-md-10 bx--offset-xl-2 bx--col-xl-8">
                <p>
                  Use the form below to generate your own custom persuasion and deliberation dialogues.
                  None of the information you provide will be stored for future use by the system.
                </p>
              </div>
            </div>
            <div className="bx--row">
              <div className="bx--offset-md-1 bx--col-md-10 bx--offset-xl-2 bx--col-xl-8">
                <div className="heading"></div>
                <h2 className="heading">Agents' names</h2>
              </div>
            </div>
            <div className="bx--row">
              <div className="bx--offset-md-1 bx--col-md-10 bx--offset-xl-2 bx--col-xl-8">
                <p className="description">
                  Choose names for the agents that will be participating in the dialogues.
                </p>
              </div>
            </div>
            <div className="bx--row">
              <div className="bx--offset-md-1 bx--col-md-10 bx--offset-xl-2 bx--col-xl-8">
                <div className="text-input">
                  <TextInput
                    id="firstAgentsName"
                    labelText="First agent's name"
                    invalid={this.state.isFirstAgentsNameInvalid}
                    invalidText="Please provide a valid name"
                    onChange={this.onChange}
                  />
                </div>
              </div>
            </div>
            <div className="bx--row">
              <div className="bx--offset-md-1 bx--col-md-10 bx--offset-xl-2 bx--col-xl-8">
                <div className="text-input">
                  <TextInput
                    id="secondAgentsName"
                    labelText="Second agent's name"
                    invalid={this.state.isSecondAgentsNameInvalid}
                    invalidText="Please provide a valid name"
                    onChange={this.onChange}
                  />
                </div>
              </div>
            </div>
            <div className="bx--row">
              <div className="bx--offset-md-1 bx--col-md-10 bx--offset-xl-2 bx--col-xl-8">
                <div className="text-input">
                  <TextInput
                    id="thirdAgentsName"
                    labelText="Third agent's name"
                    invalid={this.state.isThirdAgentsNameInvalid}
                    invalidText="Please provide a valid name"
                    onChange={this.onChange}
                  />
                </div>
              </div>
            </div>
            <div className="bx--row">
              <div className="bx--offset-md-1 bx--col-md-10 bx--offset-xl-2 bx--col-xl-8">
                <div className="heading"></div>
                <h2 className="heading">Restaurants' names</h2>
              </div>
            </div>
            <div className="bx--row">
              <div className="bx--offset-md-1 bx--col-md-10 bx--offset-xl-2 bx--col-xl-8">
                <p className="description">
                  Choose names for the restaurants around which the dialogues will revolve.
                </p>
              </div>
            </div>
            <div className="bx--row">
              <div className="bx--offset-md-1 bx--col-md-10 bx--offset-xl-2 bx--col-xl-8">
                <div className="text-input">
                  <TextInput
                    id="firstRestaurantsName"
                    labelText="First restaurant's name"
                    invalid={this.state.isFirstRestaurantsNameInvalid}
                    invalidText="Please provide a valid name"
                    onChange={this.onChange}
                  />
                </div>
              </div>
            </div>
            <div className="bx--row">
              <div className="bx--offset-md-1 bx--col-md-10 bx--offset-xl-2 bx--col-xl-8">
                <div className="text-input">
                  <TextInput
                    id="secondRestaurantsName"
                    labelText="Second restaurant's name"
                    invalid={this.state.isSecondRestaurantsNameInvalid}
                    invalidText="Please provide a valid name"
                    onChange={this.onChange}
                  />
                </div>
              </div>
            </div>
            <div className="bx--row">
              <div className="bx--offset-md-1 bx--col-md-10 bx--offset-xl-2 bx--col-xl-8">
                <div className="text-input">
                  <TextInput
                    id="thirdRestaurantsName"
                    labelText="Third restaurant's name"
                    invalid={this.state.isThirdRestaurantsNameInvalid}
                    invalidText="Please provide a valid name"
                    onChange={this.onChange}
                  />
                </div>
              </div>
            </div>
            <div className="bx--row">
              <div className="bx--offset-md-1 bx--col-md-10 bx--offset-xl-2 bx--col-xl-8">
                <div className="heading"></div>
                <h2 className="heading">Restaurants' cuisines</h2>
              </div>
            </div>
            <div className="bx--row">
              <div className="bx--offset-md-1 bx--col-md-10 bx--offset-xl-2 bx--col-xl-8">
                <p className="description">
                  Pick the cuisines for each restaurant.
                </p>
              </div>
            </div>
            <div className="bx--row">
              <div className="bx--offset-md-1 bx--col-md-10 bx--offset-xl-2 bx--col-xl-8">
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
            </div>
            <div className="bx--row">
              <div className="bx--offset-md-1 bx--col-md-10 bx--offset-xl-2 bx--col-xl-8">
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
            </div>
            <div className="bx--row">
              <div className="bx--offset-md-1 bx--col-md-10 bx--offset-xl-2 bx--col-xl-8">
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
            <div className="bx--row">
              <div className="bx--offset-md-1 bx--col-md-10 bx--offset-xl-2 bx--col-xl-8">
                <div className="heading"></div>
                <h2 className="heading">Beverage</h2>
              </div>
            </div>
            <div className="bx--row">
              <div className="bx--offset-md-1 bx--col-md-10 bx--offset-xl-2 bx--col-xl-8">
                <p className="description">
                  Pick the beverage that will be preferred by the agents.
                </p>
              </div>
            </div>
            <div className="bx--row">
              <div className="bx--offset-md-1 bx--col-md-10 bx--offset-xl-2 bx--col-xl-8">
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
            <div className="bx--row">
              <div className="bx--offset-md-1 bx--col-md-10 bx--offset-xl-2 bx--col-xl-8">
                <div className="heading"></div>
                <h2 className="heading">Generate</h2>
              </div>
            </div>
            <div className="bx--row">
              <div className="bx--offset-md-1 bx--col-md-10 bx--offset-xl-2 bx--col-xl-8">
                <p className="description">
                  Click the button below to generate your custom dialogues.
                  {this.state.isErrorNotificationVisible && (
                    <InlineNotification
                      hideCloseButton={true}
                      kind="error"
                      title="Invalid names"
                      subtitle="Some of the names for the agents or restaurants are invalid."
                    />
                  )}
                </p>
              </div>
            </div>
            <div className="bx--row">
              <div className="bx--offset-md-1 bx--col-md-10 bx--offset-xl-2 bx--col-xl-8">
                <Button onClick={this.generateDialogues}>
                  Generate
                </Button>
              </div>
            </div>
          </div>
        )}
        {this.state.simulation && (
          <div>
            <div className="bx--row">
              <div className="bx--offset-md-1 bx--col-md-10 bx--offset-xl-2 bx--col-xl-8">
                <div className="heading"></div>
                <h2 className="heading">Remarks</h2>
              </div>
            </div>
            <div className="bx--row">
              <div className="bx--offset-md-1 bx--col-md-10 bx--offset-xl-2 bx--col-xl-8">
                <p>
                  Check out your custom dialogues below.
                  You can observe the differences between the two types speech act by speech act,
                  but you can also reveal their full lengths at any point.
                </p>
                <p className="not-first">
                  While inspecting the persuasion dialogue, note how {this.state.simulation.agentNames[1]}
                  &nbsp;asserts {this.state.simulation.restaurantNames[1]} as an acceptable choice at the very start.
                  The agent then tries to prove that it is acceptable for the others
                  as they make objections indicating points on which they wish to be convinced.
                </p>
                <p className="not-first">
                  On the other hand, {this.state.simulation.agentNames[1]} is not committed
                  to their preferred option in the deliberation dialogue.
                  The agents rather collectively introduce properties that are later either rejected or accepted
                  as part of an agreed rule of what constitutes an acceptable restaurant.
                </p>
              </div>
            </div>
            <div className="bx--row">
              <div className="bx--offset-md-1 bx--col-md-5 bx--offset-xl-2 bx--col-xl-4">
                <DialogueAccordion dialogue={this.state.simulation.persuasionDialogue} dialogueType="Persuasion" />
              </div>
              <div className="bx--col-md-5 bx--col-xl-4">
                <DialogueAccordion dialogue={this.state.simulation.deliberationDialogue} dialogueType="Deliberation" />
              </div>
            </div>
            <div className="bx--row">
              <div className="bx--offset-md-1 bx--col-md-10 bx--offset-xl-2 bx--col-xl-8">
                <div className="heading"></div>
                <h2 className="heading">Reset</h2>
              </div>
            </div>
            <div className="bx--row">
              <div className="bx--offset-md-1 bx--col-md-10 bx--offset-xl-2 bx--col-xl-8">
                <p className="description">
                  Click the button below to reset the dialogues and start over.
                </p>
              </div>
            </div>
            <div className="bx--row">
              <div className="bx--offset-md-1 bx--col-md-10 bx--offset-xl-2 bx--col-xl-8">
                <Button kind="danger" onClick={this.resetState}>
                  Reset
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Generate;
