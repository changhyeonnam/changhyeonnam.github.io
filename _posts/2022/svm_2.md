

decision boundary가 linear하지 않을때, penalization, soft margin SVM에 대해 다룰 것이다.

non-linear한 DB를 만드는 경우, 그냥 무시하는 경우가 있다. DB에서 떨어진 거리만큼을 penalization을 주는 경우가 있다.  

error case를 처리하는 방법이 크게 두가지.
1. option1 : more complex DB
2. option2 : penalization.

Error를 어떻게 다룰까.
quadractic programming을 통해 decision boundary를 만들어 냈다. 

C는 임의의 constant. error의 개수.

a =1 이라 임의 의로 설정함.  
