import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

 // Import Tau Prolog core and create a session
var pl = require( 'tau-prolog' );
var session = pl.create( 1000 );

// Load the program
var program = `distance(zingara,5,0).
distance(thaiPalace,10,10).
distance(nosh,1,0).
mealTime(zingara,90).
mealTime(thaiPalace,60).
mealTime(nosh,15).
quality(X,good):-recommended(X,Y),trustworthy(Y).
quality(X,poor):-recommended(X,students).
price(zingara,25).
price(thaiPalace,15).
price(nosh,7).
atmosphere(zingara).
atmosphere(thaiPalace).
wine(zingara).
wine(thaiPalace).
cuisine(zingara,italian).
cuisine(thaiPalace, thai).
cuisine(nosh,american).
healthy(X):-cuisine(X, med).
healthy(X):-vegetables(X).
cuisine(X,med):-cuisine(X,italian).
vegetables(X):-cuisine(X,thai).
trustworthy(colleague).
trustworthy(husband).
recommended(thaiPalace,colleague).
recommended(zingara,husband).
recommended(nosh,students).
totalTime(X,T):-distance(X,Td,C),mealTime(X,Tm), T is Td+Tm.
totalCost(X,C):-distance(X,Td,Cd),price(X,Cm), C is Cd+Cm.
acceptableRestaurant(X):-cuisine(X, thai).
acceptableRestaurant(X):-quality(X,good),\u005C\u002B(quality(Y,good),cheaper(Y,X)).
acceptableRestaurant(X):-quality(X,good),healthy(X).
cheaper(X,Y):-totalCost(X,Cx),totalCost(Y,Cy),Cy < Cx. 
quicker(X,Y):-totalTime(X,Tx),totalTime(Y,Ty),Ty < Tx.`

session.consult( program );

// Query the goal
session.query( "acceptableRestaurant(X)." );

// Show answers
session.answers( x => console.log( pl.format_answer(x) ) );