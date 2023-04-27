---
title: Understanding Choice Overload in Recommender Systems (RecSys 2010)
layout: post
Created: April 27, 2023 7:14 AM
tags:
    - Recommendation System
    - Paper
use_math: true
comments: true
sitemap :
  changefreq : daily
  priority : 1.0
---

> Paradox of choice는 선택지가 많아질수록, 선택을 하는 비용의 증가와 기회비용에 대한 매몰 비용으로 만족도가 떨어지는 현상을 말한다. 추천시스템은 이를 해결하는 훌륭한 방법이며, 유저가 확인할 수 있는 결과를 제한함으로서 위의 문제를 해결한다. - [ita9naiwa님의 추천시스템에서의 다양성 포스팅](https://ita9naiwa.github.io/recsys/2018/07/22/Recys-Diversity-and-Metrics.html)
위 글을 읽고서, 선택지가 너무 많을 때는 어떤 문제가 발생하는지 궁금했고, 다시 말하면 Choice overload에 대해 추천시스템은 어떻게 고려하는지 혹은 이를 어떻게 해결하는지에 대해 궁금하여 읽게 되었다. 위 논문은 2010년도에 RecSys에서 발표된 논문이고, Movielens 데이터셋으로 실험을 했다고 한다. 심리학이 메인 주제인 논문을 처음 접해서 읽는데 오래 걸렸다.
>

---

## Abstract

많은 사람들이 매우 크고, 높은 퀄리티의 추천된 세트에 대해 이끌리지만, Choice overload에 대한 심리학 연구에서는 많은 매력적인 아이템들을 포함하는 추천 세트에서 아이템을 고르는 것은 매우 어려운 task라는 것을 보여주고 있다.

MovieLens 데이터 세트를 적용한 MF 기반 실험에서 추천 세트 사이즈, 세트 퀄리티을 이용하여 perceived variety, recommendation set attractiveness, choice difficulty, satisfaction with chosen item에 대해 조사해보고자 했다.  

그 결과는 좋은 아이템 들만을 포함하는 large set가 small set보다 반드시 높은 선택 만족도를 의미하지 않는다고 했다. 그 이유는 증가된 추천 세트의 attractiveness가 추천 세트에서 선택하는 것의 증가된 어려움으로 상쇠되기 때문이다.

## 1. Introdocution

이론적으로, 계속해서 증가하고 있는 디지털 컨텐츠의 양은 우리의 personal needs를 만족하는 컨텐츠를 찾을 가능성을 증가시켜야 한다. 하지만 전형적인 멀티미디어 시스템의 유저는 information overload를 경험하게 되는데, 컨텐츠에 있는 아이템 중 매우 적은 아이템만이 유저의 흥미에 있기 때문이다.

추천시스템의 목표는 유저의 personal preferences에 부합하는 아이템을 제공함으로써, 유저에게 content discovery와 exploration을 support해주는 것이다. Preference와 관련된 정보(구매 기록, 유저의 아이템 평가)를 바탕으로, 추천 시스템은 유저가 어떤 아이템을 좋아할지 예측하게 된다.

대부분 추천시스템에 기저하는 아이디어는 비슷한 유저는 비슷한 흥미를 갖고, 그러므로 닽은 아이템을 좋아할 것이라는 것이다. 유저의 ratings와 다른 유저의 ratings를 비교함으로써, 시스템은 다른 아이템에 대한 유저의 rating을 예측하게 된다. (MF 기반 설명인듯 하다.)

결론적으로 시스템은 개인화된 랭킹 리스트를 유저에게 제공한다. 이러한 information space의 pre-filtering은 유저가 연관되지 않은 아이템에 고려하지 안하도 되므로, Information overload를 줄여준다.

Haubl과 Trifts는 decision making process의 초기 단계에서 이러한 추천시스템이 information overload를 해결하는데 매우 도움이 되지만, 이후 진행될 decision stage에서의 실제 선택이 쉬워질것이라는 것을 의미하진 않는다고 주장한다. 역설적으로, 만약 높은 퀄리티의 추천 시스템의 세트가 매우 크다면, 이것은  유저를 information overload의 상황에서 choice overload의 상황으로 이동시키게 된다.

Choice overload는 좋은 대안책들로 이루어진 large set에서 선택하는 것에 어려움을 겪는 것을 의미한다. 이것은 왜 사람들이 더 large set에 끌리지만, 실제로는 small set로부터 선택하는 것을 더 쉽게 하고, 그들의 만족도 또한 smaller set에서 더 높은지를 설명한다.

## 2. Related Work

### 2.1 Choice overload

Iyengar과 Lepper가 처음 choice overload effect를 증명하였다. 큰 사이즈의 choice set에 끌리지만, 그 동시에 choice difficulty가 증가하고, choice satisfaction이 감소 한다는 것을 잼 (그 잼 맞다. 딸기잼) 미각부스에서의  실험으로 이를 증명했다.

24개의 타입으로 이루어진 잼이 6개의 타입으로 이루어진 잼보다 덜 attractive하다는 것을 실험 했고, 사람들은 더 large set의 미각 부스에 더 많이 attract되었다. 하지만 잼들을 맛본 후 사람들이 구매를 할때, small set의 미각부스에서는 30%, large st에서는 3%의 비율의 사람이 구입을 하였다. 즉, 사람들은 더 small set에서 더 높은 만족도를 보였다는 것을 의미한다.

Choice overload에 기저하는 메커니즘은 무엇일까? 아이템의 세트가 증가됨으로써, 그 세트의 전체 이득 (=the sum of the benefits of each option) 이 증가하기 때문에 더 attractive해진다. 하지만, 그와 동시에 결정과 관련된 심리학적 비용을 증가시켜 결정을 더 어렵게 만든다. 많은 아이템으로부터 제공된 이득은 모든 아이템을 비교하여 선택하는 비용을 능가하고, small set에 비하여 잘못된 선택할 가능성(potential regret associated with the choice)을 증가시키고, small set에 비해 더 높은 퀄리티의 아이템을 고를 수도 있다는 기대를 증가시킨다.  그 결과 크기가 large set는 choice deferral(not choosing at all)할 가능성을 증가시키거나 선택된 옵션에 대해 감소된 만족도를 확인할 수 있었다.

![Untitled](https://i.imgur.com/N0kAyxD.png)

Reutskaja,Hogarth는 benefit of large set은 충분히 만족하지만, 비용이 이득보다 더 빠른 속도로 주장하고, 세트 크기에 대한 함수가 위와 같은 inverted U shape of satisfaction형태가 된다고 한다.

정리하면, Choice overload는 두가지 기저하는 concept들이 상호작용한 결과로 볼 수 있다.

1. Item set attractiveness
2. choice difficulty

위 두가지 컨셉은 Satisfaction에 대해 반대 방향으로 힘을 가한다.

### 2.2 Item set attractiveness and choice difficulty

모든 large item set이 choice overload를 발생시키는 것은 아니다. Choice overload가 발생하기 위해서는 필수적인 전제조건이 있다. Large set에 대해 strong prior preference 는 dominant option이 없어야 한다. 그리고 매력적인 아이템들에 작은 차이만 있을때, 선택하는 것이 더 어려워진다. 이전의 심리학 연구에서는 추천시스템을 사용하지 않은, 모든 아이템에 대해서 이를 확인하려 했고, 아이템 사이의 similarity과 tradeoff에 대한 control이 없는 환경이었기 때문에 연구가 제대로 되지 않았다.

Choice overload을 대해 조절할 수 있는 것 중 하나는 comparability of items이다. 아이템들이 매력적이지만 비교할 수 없는 경우 tradeoff가 어려워져 potential choice overload가 증가한다.  Fasolo은 item set의 entropy가 증가함에 따라 choice effort와 difficulty가 증가할 수 있다는 것을 보여주었다. Entropy는 사용 가능한 item 수에 대한 복잡도의 척도 혹은 the number of levels within each attribute에 대한 복잡성의 척도를 의미한다.

> 이후 내용은 위에서 얘기했던 Choice overload를 효과적으로 보이기 위한 Experimental design과 수치적 결과들인데, 너무 내용이 많아 생략하겠다.
>

## 5. Conclusions

이 논문의 목표는 choice overload effect를 연구하고, 추천시스템이 이러한 effect를 본질적으로 야기하려는 경향이 있는지 보이고자 하였다. 실험의 결과는 Choice overload가 recommendation set attractiveness와 choice difficulty사이에서 상호작용하는 것을 조절함으로써 제어된다는 것을 보여준다. Top-5은 다양성을 제한하지만, 선택하기 쉬웠다. Top-20은 다양하지만, 선택하기 어려웠다. Lin-20은 다양했고 선택하기 쉬웠지만 attractiveness가 떨어졌다. (Lin-20은 Top-5에 나머지 15개를 19등, 199등, .., 1499등으로 채운 추천리스트이다.)

---

## Reference

1. [Understanding Choice Overload in Recommender Systems](https://dl.acm.org/doi/10.1145/1864708.1864724)
