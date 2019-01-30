distance(zingara,5,0).
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
cuisine(X,med):-cuisine(X,italian).
healthy(X):-cuisine(X, med).
healthy(X):-vegetables(X).
vegetables(X):-cuisine(X,thai).
trustworthy(colleague).
trustworthy(husband).
recommended(thaiPalace,colleague).
recommended(zingara,husband).
recommended(nosh,students).
totalTime(X,T):-distance(X,Td,_),mealTime(X,Tm), T is Td+Tm.
totalCost(X,C):-distance(X,_,Cd),price(X,Cm), C is Cd+Cm.
acceptableRestaurant(X):-cuisine(X, thai).
acceptableRestaurant(X):-quality(X,good),(quality(Y,good),cheaper(Y,X)->false;true).
acceptableRestaurant(X):-quality(X,good),healthy(X).
acceptableRestaurant(X):-quality(X,good),atmosphere(X),wine(X),distance(X,Tx,0),(quality(Y,good),atmosphere(Y),wine(Y),quicker(Y,X)->false;true).
cheaper(X,Y):-totalCost(X,Cx),totalCost(Y,Cy),Cy < Cx.
quicker(X,Y):-totalTime(X,Tx),totalTime(Y,Ty),Ty < Tx.
