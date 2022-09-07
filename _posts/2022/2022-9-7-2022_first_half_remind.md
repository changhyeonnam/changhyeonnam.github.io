---
title: 2022년 상반기 회고
layout: post
Created: September 7, 2022 16:17 PM
tags:
    - etc
use_math: true
comments: true
sitemap :
  changefreq : daily
  priority : 1.0
---
>장기적인 개발 공부 및 커리어의 방향성 측면에서 리서치 보다는 실제 서비스와 맞닿아 있는 ML powered service 개발하는 것을 목표로 두고 공부하고 있다. (맥가이버 칼같은 만능 ML 엔지니어가 되고 싶다!.)
>

작년에 naver ai rush 이후, nlp에 빠져서 한동안 공부했다. NLP와 관련되어, 관심이 생겼던 분야는 특정 task가 아닌, large scale model 혹은 foundation model을 학습하여 더 효율적이고, 경량화된 모델을 만드는 것에 관심이 있었다. 하지만 공부를 하면 할수록 정말 많은 리소스가 있는 회사에서만 큰 모델에 대해 시도를 해볼 수 있고, 학생의 입장에서 이것저것 시도하기엔 한계가 많았다. (단 inference가 아니라면?, 사실 할라면 할 수는 있었다고 생각함.)

그러던 중 작년 12월 부터 3개월간 정출연 중 하나인 KIST에서 추천관련 모델링 인턴십의 기회를 얻어서 가장 기본적인 MF부터 여러가지 모델을 시도해 볼수 있었다. 애초에 나는 연구보다는 개발을 하고 싶었고, 매우 큰 트래픽의 서비스에 직접적으로 영향을 줄 수 있는 추천시스템이 매력적으로 다가왔다. 게다가 내가 지금까지 공부한 nlp관련 지식들과 무관한 분야도 아니고, transformer/gnn 계열의 다양한 아키텍쳐가 적용되고 있어서 재밌게 개발하며 공부했다.

---

그리고 올해 5월말 부터 8월말까지 약 3달간 naver clova ml x team에서 추천 모델링 관련 인턴십을 진행했다. 내가 소속된 팀은 Long-term engagement 라는 팀으로, supervised learning이 optimise할 수 없는 다양한 metric (e.g, retention rate)을 optimise하고자 Reinforcement Learning을 적용하는 팀이었다. 주로 맡은 업무는 뉴스추천 모델링 및 파이프라인 일부 개발 이었고, 더 많은 일을 하고 싶어 팀원분의 강화학습 모델 일부분에 기여를 했다. 매주 주간 미팅때, cancel됬지만 deview와 관련한 slide 만들기 및 a/b test 방향성도 함께 토론했다. 토론에서 새로 알게된 Insight는 RL을 적용하는 시도 자체가 정말 의미 있고, 만약 가설대로 잘 작동한다면 정말 powerful한 방법 중 하나였다. 3달동안 업무외에, dqn, actor-critic, policy gradient, offline rl 등에 대해 공부하면서 RL에 발을 담궈볼 수 있었고, RL을 이용해 실 서비스에서도 가설대로 잘 작동하고, robust한 추천시스템을 만든다면 앞으로 추천시스템의 게임체인저가 될 수 있을거라 생각했다.

---

![414d8d316d2eec47889d4cc562a3203f](https://i.imgur.com/JpWZUbF.jpg)
(하하하 아직까지는 연구보다는 개발하고 싶다.)

그래서 인턴십이 바로 끝나고 학교에 새로 부임하신 산업경영공학과 교수님 아래서 학부연구생을 하고 있다. 프로젝트 개발이나, 실 데이터를 이용해 딥러닝을 사용해서 해결하는 경험들은 꽤 했다고 생각해서, 이번엔 연구에 도전해보고 있다. 네이버에서 리서쳐로써 어떠한 합리적인 사고를 거쳐 strong claim을 할 수 있는 연구를 하는지 간접적으로 배웠다고 생각해서, 배운 것을 실전에 적용해보며 공부하고 있다. Domain 자체는 추천시스템이 아닌 general한 RL 환경에서의 연구지만, 연구를 해보고 싶어서 학부연을 한 것이기 때문에 domain은 상관없다고 생각한다.

---

![Screen Shot 2022-09-07 at 4.34.37 PM](https://i.imgur.com/unXBwxF.png)
교수님께서 post-doc때 연구하신 내용인 Imitation learning / policy transfer learning과 관련된 RL에서 내가 어느정도 잘 알 고있는 attention/transformer 및 여러가지 딥러닝 모델등을 이용해서 기존의 black box처럼 학습하던 문제를 좀더 explainable한 학습을 하게 시도해보고 있다. (아직 background 공부하고 있어서 사실 내가 어떤 것을 하는지 명확하게 설명할 수 가 없다. 이번 달 말 정도되야 명확하게 알고, 실험을 시작할 수 있을것 같다.)

---

![Screen Shot 2022-09-07 at 4.32.44 PM](https://i.imgur.com/0sTTq4E.png)

작년부터 현업에서 실 서비스에 적용할 수 있는 ml-powered service를 만들기 위해, 얼마나 백엔드에 대해서 공부해야하는 지 고민이 있었다. 두번의 인턴십을 경험하면서 MLops를 직접 써보면서 파이프라인을 개발하지는 않았지만, 스프링/장고 등 백엔드 프레임워크보다는 정말 ml service pipeline에 필요한 component들인 database, 적절한 inference 방법, kubeflow/airflow 등을 공부하는 게 더 중요하다는 것을 느꼈다. [2022 FSDL(full stack deep learning)](https://fullstackdeeplearning.com/)을 수강하고 있는데, 그 수업의 큰 주제가 mlops framework 이기 보다는 ml powered product을 만드는 데 고려해야하는 모든 것이 주제이다. 수업은 무료이지만 돈 안내면 안들을 것 같아서, 돈내고서 팀 프로젝트도 하면서 듣고 있다. 이 수업을 통해서 실 서비스와 맞닿아 있는 지식들 및 고려해야하는 것을 배우기를 기대하며 공부하고 있다.
