import React, { Component } from "react";
import { Accordion, AccordionItem, ListItem, Tooltip, UnorderedList } from 'carbon-components-react';

import './DemoDialogue.css';

class DemoDialogue extends Component {
  render() {
    return (
      <Accordion>
        <AccordionItem
          title={<div><strong>Jane</strong>: I wonder if Thai Palace has property healthy.
            <Tooltip triggerText="&nbsp;">
              <p>Jane poses a question seeking information about Thai Palace and indicating that "quality" is a criterion she finds desirable.</p>
            </Tooltip>
          </div>}
        >
          <UnorderedList>
            <ListItem className="list-item">
              Jane's commitment store:
              <UnorderedList nested className="unordered-nested-list">
                <ListItem className="nested-list-item">
                  healthy(X):-cuisine(X,mediterranean).
                  <Tooltip triggerText="&nbsp;">
                    <p>Jane considers a healthy restaurant to be one that offers mediterranean cuisine.</p>
                  </Tooltip>
                </ListItem>
              </UnorderedList>
            </ListItem>
            <ListItem className="list-item">
              Harry's commitment store:
              <UnorderedList nested className="unordered-nested-list">
              </UnorderedList>
            </ListItem>
          </UnorderedList>
        </AccordionItem>
        <AccordionItem
          title={<div><strong>Harry</strong>: Thai Palace has property healthy.
            <Tooltip triggerText="&nbsp;">
              <p>Harry asserts the claim as true in order to persuade Jane towards Thai Palace.</p>
            </Tooltip>
          </div>}
        >
          <UnorderedList>
            <ListItem className="list-item">
              Jane's commitment store:
              <UnorderedList nested className="unordered-nested-list">
                <ListItem className="nested-list-item">
                  healthy(X):-cuisine(X,mediterranean).
                </ListItem>
              </UnorderedList>
            </ListItem>
            <ListItem className="list-item">
              Harry's commitment store:
              <UnorderedList nested className="unordered-nested-list">
                <ListItem className="nested-list-item">
                  healthy(thaiPalace).
                </ListItem>
              </UnorderedList>
            </ListItem>
          </UnorderedList>
        </AccordionItem>
        <AccordionItem
          title={<div><strong>Jane</strong>: Why is it that Thai Palace has property healthy?
            <Tooltip triggerText="&nbsp;">
              <p>Jane seeks reasoning for Harry's claim as she cannot derive it on her own.</p>
            </Tooltip>
          </div>}
        >
          <UnorderedList>
            <ListItem className="list-item">
              Jane's commitment store:
              <UnorderedList nested className="unordered-nested-list">
                <ListItem className="nested-list-item">
                  healthy(X):-cuisine(X,mediterranean).
                </ListItem>
              </UnorderedList>
            </ListItem>
            <ListItem className="list-item">
              Harry's commitment store:
              <UnorderedList nested className="unordered-nested-list">
                <ListItem className="nested-list-item">
                  healthy(thaiPalace).
                </ListItem>
              </UnorderedList>
            </ListItem>
          </UnorderedList>
        </AccordionItem>
        <AccordionItem
          title={<div><strong>Harry</strong>: Thai Palace has property healthy since Thai Palace has property vegetables.
            <Tooltip triggerText="&nbsp;">
              <p>Harry offers reasoning for his claim and contributes a new rule for what constitutes a healthy restaurant.</p>
            </Tooltip>
          </div>}
        >
          <UnorderedList>
            <ListItem className="list-item">
              Jane's commitment store:
              <UnorderedList nested className="unordered-nested-list">
                <ListItem className="nested-list-item">
                  healthy(X):-cuisine(X,mediterranean).
                </ListItem>
                <ListItem className="nested-list-item">
                  healthy(X):-vegetables(X).
                </ListItem>
                <ListItem className="nested-list-item">
                  vegetables(X):-cuisine(X,thai).
                </ListItem>
                <ListItem className="nested-list-item">
                  cuisine(thaiPalace,thai).
                </ListItem>
              </UnorderedList>
            </ListItem>
            <ListItem className="list-item">
              Harry's commitment store:
              <UnorderedList nested className="unordered-nested-list">
                <ListItem className="nested-list-item">
                  healthy(thaiPalace).
                </ListItem>
                <ListItem className="nested-list-item">
                  healthy(X):-vegetables(X).
                </ListItem>
                <ListItem className="nested-list-item">
                  vegetables(X):-cuisine(X,thai).
                </ListItem>
                <ListItem className="nested-list-item">
                  cuisine(thaiPalace,thai).
                </ListItem>
              </UnorderedList>
            </ListItem>
          </UnorderedList>
        </AccordionItem>
        <AccordionItem
          title={<div><strong>Jane</strong>: I accept that Thai Palace has property healthy.
            <Tooltip triggerText="&nbsp;">
              <p>Jane concedes to the claim as she now has the knowledge to derive it.</p>
            </Tooltip>
          </div>}
        >
          <UnorderedList>
            <ListItem className="list-item">
              Jane's commitment store:
              <UnorderedList nested className="unordered-nested-list">
                <ListItem className="nested-list-item">
                  healthy(X):-cuisine(X,mediterranean).
                </ListItem>
                <ListItem className="nested-list-item">
                  healthy(X):-vegetables(X).
                </ListItem>
                <ListItem className="nested-list-item">
                  vegetables(X):-cuisine(X,thai).
                </ListItem>
                <ListItem className="nested-list-item">
                  cuisine(thaiPalace,thai).
                </ListItem>
                <ListItem className="nested-list-item">
                  healthy(thaiPalace).
                </ListItem>
              </UnorderedList>
            </ListItem>
            <ListItem className="list-item">
              Harry's commitment store:
              <UnorderedList nested className="unordered-nested-list">
                <ListItem className="nested-list-item">
                  healthy(thaiPalace).
                </ListItem>
                <ListItem className="nested-list-item">
                  healthy(X):-vegetables(X).
                </ListItem>
                <ListItem className="nested-list-item">
                  vegetables(X):-cuisine(X,thai).
                </ListItem>
                <ListItem className="nested-list-item">
                  cuisine(thaiPalace,thai).
                </ListItem>
              </UnorderedList>
            </ListItem>
          </UnorderedList>
        </AccordionItem>
      </Accordion>
    );
  }
}

export default DemoDialogue;
