const generalKnowledgeBase = `distance(restaurantOne,5,0).
distance(restaurantTwo,10,10).
distance(restaurantThree,1,0).
mealTime(restaurantOne,90).
mealTime(restaurantTwo,60).
mealTime(restaurantThree,15).
quality(X,good):-recommended(X,Y),trustworthy(Y).
quality(X,poor):-recommended(X,students).
price(restaurantOne,25).
price(restaurantTwo,15).
price(restaurantThree,7).
atmosphere(restaurantOne).
atmosphere(restaurantTwo).
beverage(restaurantOne).
beverage(restaurantTwo).
cuisine(restaurantOne,cuisineOne).
cuisine(restaurantTwo,cuisineTwo).
cuisine(restaurantThree,cuisineThree).
cuisine(X,med):-cuisine(X,cuisineOne).
healthy(X):-cuisine(X,med).
healthy(X):-vegetables(X).
vegetables(X):-cuisine(X,cuisineTwo).
trustworthy(colleague).
trustworthy(husband).
recommended(restaurantOne,husband).
recommended(restaurantTwo,colleague).
recommended(restaurantThree,students).
totalTime(X,T):-distance(X,Td,_),mealTime(X,Tm), T is Td+Tm.
totalCost(X,C):-distance(X,_,Cd),price(X,Cm), C is Cd+Cm.
acceptableRestaurant(X):-quality(X,good),healthy(X).
acceptableRestaurant(X):-cuisine(X,cuisineTwo).
acceptableRestaurant(X):-quality(X,good), (quality(Y,good),cheaper(Y,X)->false;true).
acceptableRestaurant(X):-quality(X,good),atmosphere(X),beverage(X),distance(X,_,0), (quality(Y,good),atmosphere(Y),beverage(Y),quicker(Y,X)->false;true).
acceptableRestaurant(X):-healthy(X),atmosphere(X),beverage(X),distance(X,_,0).
acceptableRestaurant(X):-quality(X,good),healthy(X),atmosphere(X),beverage(X).
acceptableRestaurant(X):-quality(X,good),atmosphere(X).
cheaper(X,Y):-totalCost(X,Cx),totalCost(Y,Cy), Cx < Cy.
quicker(X,Y):-totalTime(X,Tx),totalTime(Y,Ty), Tx < Ty.`

export default generalKnowledgeBase;
