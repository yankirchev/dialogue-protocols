import React, { Component } from "react";
import { Accordion, AccordionItem, Button, ListItem, UnorderedList } from 'carbon-components-react';

import './DialogueAccordion.css';

class DialogueAccordion extends Component {
  constructor() {
    super();

    this.state = {
      accordionItems: null,
      currentSpeechActIndex: 1
    };

    this.decrementSpeechActIndex = this.decrementSpeechActIndex.bind(this);
    this.incrementSpeechActIndex = this.incrementSpeechActIndex.bind(this);
    this.maximiseSpeechActIndex = this.maximiseSpeechActIndex.bind(this);
  }

  decrementSpeechActIndex() {
    this.setState({
      currentSpeechActIndex: this.state.currentSpeechActIndex - 1
    });
  }

  incrementSpeechActIndex() {
    this.setState({
      currentSpeechActIndex: this.state.currentSpeechActIndex + 1
    });
  }

  maximiseSpeechActIndex() {
    this.setState({
      currentSpeechActIndex: this.props.dialogue.commitmentStoreHistory.length
    });
  }

  componentDidMount() {
    this.setState({
      accordionItems: this.props.dialogue.text.split('\n').map((speechAct, speechActIndex) => speechAct !== '' && (
        <AccordionItem key={speechActIndex} title={<div><strong>{speechAct.split(':')[0]}</strong>:{speechAct.split(':')[1]}</div>}>
          <UnorderedList>
            {this.props.dialogue.agents.map((agent, agentIndex) =>
              <ListItem className="list-item" key={agentIndex}>
                {agent.name}'s commitment store:
                <UnorderedList nested className="unordered-nested-list">
                  {this.props.dialogue.commitmentStoreHistory[speechActIndex][agentIndex].split('\n').map((commitment, commitmentIndex) => commitment !== '' &&
                    <ListItem className="nested-list-item" key={commitmentIndex}>
                      {commitment}
                    </ListItem>
                  )}
                </UnorderedList>
              </ListItem>
            )}
          </UnorderedList>
        </AccordionItem>
      ))
    });
  }

  render() {
    return (
      <div>
        <div className="heading"></div>
        <h2 className="heading">{this.props.dialogueType} Dialogue</h2>
        <Accordion className="dialogue-accordion">
          {this.state.accordionItems && this.state.accordionItems.slice(0, this.state.currentSpeechActIndex)}
        </Accordion>
        <div className="buttons-wrapper">
          <Button small kind='secondary' disabled={this.state.currentSpeechActIndex === 1} onClick={this.decrementSpeechActIndex}>
            Previous
          </Button>
          <Button small kind='primary' disabled={this.state.currentSpeechActIndex === this.props.dialogue.commitmentStoreHistory.length} onClick={this.incrementSpeechActIndex}>
            Next
          </Button>
          <Button small className="tertiary" kind='tertiary' disabled={this.state.currentSpeechActIndex === this.props.dialogue.commitmentStoreHistory.length} onClick={this.maximiseSpeechActIndex}>
            Reveal all
          </Button>
        </div>
      </div>
    );
  }
}

export default DialogueAccordion;
