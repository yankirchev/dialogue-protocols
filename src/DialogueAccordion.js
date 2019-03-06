import React, { Component } from "react";
import { Accordion, AccordionItem, UnorderedList, ListItem, Button } from 'carbon-components-react';

import './DialogueAccordion.css';

class DialogueAccordion extends Component {
  constructor() {
    super();

    this.state = {
      currentSpeechActIndex: 1
    };

    this.decrementSpeechActIndex = this.decrementSpeechActIndex.bind(this);
    this.incrementSpeechActIndex = this.incrementSpeechActIndex.bind(this);
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

  render() {
    return (
      <div>
        <Accordion className="dialogue-accordion">
          {this.props.dialogue.text.split('\n').map((speechAct, speechActIndex) => speechAct !== '' && speechActIndex < this.state.currentSpeechActIndex && (
            <AccordionItem key={speechActIndex} title={<div><strong>{speechAct.split(':')[0]}</strong>:{speechAct.split(':')[1]}</div>}>
              <UnorderedList>
                {this.props.dialogue.agents.map((agent, agentIndex) =>
                  <ListItem key={agent.name}>
                    {agent.name}'s commitment store:
                    <UnorderedList nested>
                      {this.props.dialogue.commitmentStoreHistory[speechActIndex][agentIndex].split('\n').map((commitment, commitmentIndex) => commitment !== '' &&
                        <ListItem key={commitmentIndex}>
                          {commitment}
                        </ListItem>
                      )}
                    </UnorderedList>
                  </ListItem>
                )}
              </UnorderedList>
            </AccordionItem>
          ))}
        </Accordion>
        <div className="speech-acts-buttons-wrapper">
          <Button kind='secondary' disabled={this.state.currentSpeechActIndex === 1} onClick={this.decrementSpeechActIndex}>
            Previous
          </Button>
          <Button kind='primary' disabled={this.state.currentSpeechActIndex === this.props.dialogue.commitmentStoreHistory.length} onClick={this.incrementSpeechActIndex}>
            Next
          </Button>
        </div>
      </div>
    );
  }
}

export default DialogueAccordion;
