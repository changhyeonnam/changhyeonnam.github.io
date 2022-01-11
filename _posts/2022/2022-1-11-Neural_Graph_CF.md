---
title: Neural Graph Collaborative Filtering
layout: post
Created: January 11, 2022 4:23 PM
tags:
    - Recommender system
    - Paper
use_math: true
comments: true
sitemap :
  changefreq : daily
  priority : 1.0
---

> Matrix Factorization, Neural Collaborative Filtering 혹은  CF 관련된 기본적인 내용은 생략했습니다. 다 읽고 보니, NCF에서 사용한 데이터셋인 Movie Lens를 사용하진 않지만 implicit feedback 데이터를 쓰고, negative sampling을 통해 interaction이 없는 데이터셋을 만드는것이 동일하여 MovieLens dataset 또한 사용해볼 수 있을것같다.
>

Neural Graph Collaborative Filtering에서의 핵심은 다음과 같다.

1. NGCF은 크게 3가지의 layer로 이뤄진다. (1) user,item embedding layer. (2) high-order connectivity relation을 고려하여 embedding을 refine(=update)하는 multiple embedding propagation layer. 논문에서는 3개의 embedding propagation layer를 사용했다. (3) different propagation layer들로부터 refine된 embedding을 모두 합쳐서 user-item pair의 affinity score(관련성 점수)를 출력하는 prediction layer. 이때 prediction은 단순히 concatenation된 user와 item의 inner product이다.
2. 이전의 MF, NeuMF 등과 같은 다른 work들은 CF signal을 implicit하게  encode했다. NGCF에서는 embedding propagation layer를 쌓음으로써, high-order  connectivities에서 collaborative signal을 capture할 수 있다. 이 방법은 explicit하게 user와 item간의 interaction을 encode하는 방법으로, desired한 recommendation을 가능하게 해준다.
3. Dataset에 interaction의 유무만을 나타내는 implicit feedback dataset을 사용했다.  Negative sampling을 통해 dataset에 negative instance를 생성해준다. (NeuMF(NCF)에서 사용했던 MovieLens를 그대로 사용해도 괜찮을것 같다.)

다음 [repository](https://github.com/changhyeonnam/NGCF)에 NGCF를 구현해보고 있습니다.

# Abstract

user와 item 대해서 vector representation을 학습하는 것은 현대의 modern  recommender system에서 core한 일이다. 이전의 MF와 같은 방식들은 user와 item에 대해서 embedding process를 통해 latent factor를 학습하게 된다. 하지만 embedding들이 collaborative filtering effect을 capture하는데 충분하지 않다. 이 논문에서는 embedding을 propagate 시키는 user-item graph structure를 사용하는 Neural Graph Collaborative Filtering을 개발하고자 한다. 이 모델은 user-item graph에서의 high-order connectivity를 잘 나타낸다.

# 1. Introduction

MF, NCF 등은  효율적이지만, 여기에 사용되는 embedding들은 CF의 user,item을 표현하는 데 있어서 충분하지 않다. user와 item에 관한 behavior similarity를 표현하는 latent factor인 collaborative signal을 encode하는 것에 대해 부족하다. user-item interaction을 고려하지 않는 feature들을 사용하는 대부분 method에서의 embedding function들은 model training에서 objective function을 정의하는 데에만 사용한다.

user-item interaction을 embedding function에 합치면 더 유용할 질것이다. 하지만, scale of interaction이 millions를 넘어 매우 커질  수 있고, 이로인해 desired collaborative signal을 구분하지 못할 수 도 있다. 이 논문에서는 이 interaction graph 구조에서의 collaborative signal을  해석하여 user-item interaction의 high-order connectivity를  이용하는 방법으로 위에서 말한 challenge를 해결한다.

<div class="center">
  <figure>
    <a href="/images/2022/paper/NGCF/lec0.png"><img src="/images/2022/paper/NGCF/lec0.png" width="600"  ></a>
  </figure>
</div>

Figure 1이 high-order connectivity concept을 설명해준다. 왼쪽 그림에서 user $u_1$이 관심있는 item들과 연결되어있고, 오른쪽 그림이 user-item interaction을 표현하고 있다. 오른쪽 그림에서 u1으로부터 expand되는 트리 구조를 보여준다. high-order connectivity는 길이 1 이상의 어떠한 path에서 $u_1$에 도달 하는 path를 의미한다. 이러한 high-order connectivity는 collaborative signal에 관한 rich semantic을 포함한다.

예를들어 $u_1\leftarrow i_2 \leftarrow u_2$의 경로를 보면, $u1, u2$ 둘다 $i_2$를 interact한 behavior similiarity를 나타낸다. 또한 $u_1\leftarrow i_2 \leftarrow u_2 \leftarrow i_4$를  보면, $u_1$와 유사한  $u_2$가 이전에 $i_4$를 소비한 것을 볼 수 있다.

본 논문에서는 embedding function에 high-order connectivity를 모델링 하고자 한다. tree와 같은 interaction graph를 확장하는 것 대신, graph에서 재귀적으로 embedding을 propagate 시키기 위해 neural network을 구축했다. 이 방법은 embedding space에서 information flow를 구축하는 GNN의 영감을  받았다. 특히, interacted item들의 embedding을 합침으로써 user의 embedding을 update할 수  있는 embedding  propagation layer를 고안했다. 여러개의  embedding propagation layer를 쌓음으로써, high-order  connectivities에서 collaborative signal을 capture할 수 있다.

$u_1\leftarrow i_2 \leftarrow u_2$ : 2개의 layer를 쌓은것.

$u_1\leftarrow i_2 \leftarrow u_2 \leftarrow i_4$ : 3개의  layer를 쌓은것.  

information flow의 힘에 따라 추천 우선순위를 결정할 수 있다. 여러 benchmark dataset에 NGCF 방법의 효율성과 합리성을 입증하기 위해 사용했다.

# 2. Methodlogy

<div class="center">
  <figure>
    <a href="/images/2022/paper/NGCF/lec1.png"><img src="/images/2022/paper/NGCF/lec1.png" width="600"  ></a>
  </figure>
</div>


Figure 2가 전반적인 NGCF 구조를 나타내고 있다. NGCF framework에는 3개의 component가 있다. (1) user,item embedding을 initialization하는 embedding layer. (2) high-order connectivity relation들을 사용하여 embedding을 refine하는 multiple embedding propagation layer. (3) different propagation layer들로부터 refine된 embedding을 모두 합쳐서 user-item pair의 affinity score(관련성 점수)를 출력하는 prediction layer. 마지막엔 NGCF의 복잡성에 대해 설명한다.

## 2.1 Embedding Layer

user u에 대한 embedding  vector를 $e_u\in R^d$, item i에 대한 embedding vector를 $e_i \in R^d$ 로 나타내고, d는 embedding size를 의미한다.  embedding look-up table로써, parameter matrix를 build하는 것을로 볼수 있다.

$E = [e_{u_1},...,e_{u_N}, e_{i_1},...,e_{i_M}]$

이것은 user embedding과 item embedding들에 대한 initial state를 표현하는 embedding table의 역할을 하고, end-to-end  방식으로  optimize된다.  전통적인 추천시스템 모델인 MF, NCF와 같은 방법은 이러한 ID embedding을 interaction layer에 집어넣어  prediction score를 계산한다. 하지만  NGCF에서는 user-item interaction에서 embedding들을 propagation하는 것을 통해 refine한다. 추천 시스템을 위한 더 효과적인 embedding을 구현할 수 있고, 이러한 embedding refinement step이 collaborative  signal를 embedding에 넣을 수 있다.

## 2.2 Embedding Propagation Layers

그 다음 graph structure에서의 CF signal을 capture하기 위해 GNN message-passing 구조를 build했고, users와 items의 embedding을 refine했다. 일단 one-layer propagation design을 설명하고, 여러 연속적인 layer들에 대해서 generalize할 것이다.

### 2.2.1 First-order propagation

interacted items들은 user의 선호에 대한 direct evidence를 제공한다. item을 소비한 user들은 item들의 feature로 다뤄질 수 있고, 2개의 item의 collaborative similarity를 측정하는데 사용할 수 있다. 연결된 user들과 item들 사이의 embedding propagation을 구현하기 위해, 두가지 main operation인 message construction과 message aggregation을 이용해 process를 공식화 하였다.

**Message Construction :** 연결된 user-item pair (u,i)에 대해, i에서 u로 가는 message를 다음과 같이 정의했다.

$m_{u\leftarrow i}=f(e_i,e_u,p_{ui})$

- $m_{u\leftarrow i}$ : message embedding, propagate되는 information을 의미한다.
- $f()$ :  input으로 $e_u,e_i$를 사용하고,  $p_{ui}$를 coefficient를 사용하는 message encoding function을 의미한다.

$f()$를 다음과 같이 구현했다.

$m_{u\leftarrow i}={1\over{\sqrt \mid N_u \mid \mid N_i \mid}} (W_1e_i+W_2(e_i\odot e_u))$

- $W_1,W_2\in R^{d'Xd}$: trainable weight matrices로, propagation을 위한 useful한 information을 distill시켜  준다. $d'$은 transformation size이다.
- $e_i$의 contribution만 고려하는 기존의 graph convolution network와 달리, $e_i\odot e_u$를 통해 전달되는 message에서 $e_u,e_i$ 둘 사이의 관계의 interaction을 고려한다. 이것은 message가 $e_u,e_i$의 관계에 더 dependent하게 만들어서, 비슷한 아이템들로 부터 더 많은 message를 전달한다. 이것이 model representation 능력을 향상시키고, 추천시스템 성능을 높여준다. (4.4.2에서 입증되었다.)
- $p_{ui}={1\over{\sqrt \mid N_u \mid \mid N_i \mid}}$ :  $N_u,N_i$ 는 user u와 item i의 first-hop neighbor를 나타낸다. representation learning 관점에서, 이것은 historical item이 얼마나 user preference에 영향을 주는지 의미한다. message passing 관점에서는, $p_{ui}$는 discount factor로 해석될 수 있으며, 전파되는 메시지는 path length에 따라 감소하게된다.

**Message Aggregation:** 이 단계에서는 user u의 representation을 refine하기 위해 u의 neighborhood로부터의 전달된 메시지를 합친다.

$e^{(1)}_u=LeakyReLU(m_{u\leftarrow u}+\sum\limits_{i\in N_u}m_u\leftarrow i)$

- $e^{(1)}_u$: first embedding propagation layer이후에 얻어진 user u의 representation을 의미한다.
- LeakyReLU는 positive, small negative signal 모두를 encode하게 해준다.
- neighbor $N_u$로부터 전파된 메시지들에 대해서, $m_{u\leftarrow u}=W_1e_u$와 같이 u의 self-connection을 고려한다. 그리고 이것은 original feature로부터 정보를 얻을 수 있게 한다. 같은 방식으로 item에도 적용할 수 있다.
- 요약하면, embedding propagation layer의 이점은 user와 item의 representation을 연관시키기 위해 first-order connectivity information을 explicit하게 이용한 것이다.

### 2.2.2 High-order Propagation

first-order connectivity modeling에 의해 augment된 representation으로, high-order connectivity information을 얻기 위해 더 많은 embedding propagation layer를 쌓을 수 있다. 이러한 high-order connectivities는 user와 item사이의 relevance score를 estimate하기 위한 collaborative signal을 encode할때 중요하다.

l개의 embedding propagation layer를 쌓음으로써, user는 l-hop neighbor로부터 전파된 메시지를 받을 수 있다. Figure 2에서 볼수있는 l-th step user의 representation은 다음과 같다.

$e_u^{(l)}=LeakyReLU(m^{(l)}_{u\leftarrow u}+\sum\limits_{i\in N_u} m^{(l)}_{u\leftarrow  i})$

lth step에서 propagate된 메시지들은 다음과 같이 정의된다.

$m^{(l)}_{u\leftarrow i}=p_{ui}(W_l^{(l)}e_i^{(l-1)}+W_2^{(l)}(e_i^{(l-1)}\odot e_u^{(l-1)})$

$m_{u\leftarrow u}^{(l)} = W^{(l)}_1e_u^{(l-1)}$

- $W_1^{(l)},W_2^{(l)} \in   R^{d_lXd_{l-1}}$: trainable transformation  matrix들이고, $d_l$은 transformation size를 의미한다.
- $e_i^{(l-1)}$: previous message-passing step에서 생성된 item representation을 의미하고, (l-1) hop neighbor에서의 message를 저장하고 있다.  이것은 layer l에서 user u의 representation에 기여한다.

<div class="center">
  <figure>
    <a href="/images/2022/paper/NGCF/lec2.png"><img src="/images/2022/paper/NGCF/lec2.png" width="600"  ></a>
  </figure>
</div>

Figure 3에서는 embedding propagation process에서  

u1 ← i2 ← u2 ← i4와 같은 collaborative signal을 보여준다. $i_4$에서의 message가 explicit하게 $e_{u_1}$에 encode된다. 그래서 multiple embedding propagation layer를 쌓는 것을 통해 collaborative signal을 representation learning process안으로 넣어준다.

**Propagation Rule  in Matrix Form:** embedding propagation의 전체 view와 batch implementation을 이용하기 위해, 다음과 같이 layer-wise propagation rule 에 대한 matrix form을 제시한다.

$E^{(l)} = LeakyReLU((L+I)E^{(l-1)}W_1^{(l)}+LE^{(l-1)}\odot E^{(l-1)}W_2^{(l)})$		

- $E^{(l)}\in R^{(N+M)Xd_l}$:  l step의 embedding propagation 이후에 얻은 users와 items의 representation을 의미한다.
- $E^{(0)}$: 처음 message-passing iteration에서의 set $E$을 의미한다. $e_u^{(0)}=e_u, e_i^{(0)}=e_i,I=identity\space matrix$
- $L$: Laplacian  matrix for user-item graph.

    $L = D^{-1\over2}AD^{-1\over2}, \space A= \begin{pmatrix} 0 & R\\ R^T & 0\end{pmatrix}$

- $R\in R^{NXM}$: user-item interaction matrix.
- $A$: adjacency matrix
- $D$: diagonal degree matrix
- t-th diagonal element $D_{tt}=\mid  N_t\mid$
- nonzero off-diagonal entry $L_{ui}=1/\sqrt{\mid N_u \mid \mid N_i \mid}$ (equal to $p_{ui}$

matrix-form propagation rule을 구현함으로써, 모든  user와 모든 item들의 representation을 동시에 효율적인 방법으로 update시킨다. large-scale graph에서 graph convolution netowrk을 동작가능하게 해주는 node sampling 과정을 거치지 않게해준다.

## 2.3  Model Prediction

L layer propagate한 이후에, user u에 대한 multiple representation ${e_u^{(1)},....,e_u^{(L)}}$을 얻는다. 각기 다른 layer에서 얻은 representation들은 다른 connection을 통한 메시지를  강조하므로, user preference에 대해 각각 다른 contribution을 갖는다. 그러므로 이것들을 concatenate하여 user를 위한 final embedding을 구성한다. (item에도 같은 연산을 한다.)

$e^*_u = e_u^{0}\mid \mid ..\mid \mid  e_u^{(L)}$, $e^*_i=e_i^{(0)}\mid \mid ...\mid \mid e_i^{(L)}$,$\mid \mid = concatenation$

이렇게 함으로써, embedding propagation layer로 initial embedding에 대해 충분한 정보를 주었을 뿐만 아니라, $L$를 조절하여 propagation 범위를 제어할 수  있게 된다.

concatenation 말고도, 다른 aggregator들은 또한 적용될 수 있다. ex) weighted average, max  pooling, LSTM, etc. 다른  순서로 connectivities를 합치는 각기 다른 aggregator를 의미한다.

이러한 concatenation의 이점은  단순함에 있다, 추가적으로 학습되는  파라미터가 없고, layer-aggregation 메커니즘이라 불리는 GNN의 최신 work에서 꽤 효율적인 것으로 밝혀졌다.

마지막으로 target item에 대한 user의 preference선호도를  estimate하기 위해 inner product한다.

$\hat y_{NGCF}(u,i)=e_u^{*^T}e^*_i$

이 논문에서는 embedding function을 강조하기 위해 inner product을 사용하여 단순한 interaction function을 사용한다. (NN기반 interaction function은 future work에 남겨둠)

## 2.4 Optimization

model parameter들을 학습하기 위해서, 추천시스템에서 많이 사용되는 pairwise BPR loss를 사용한다. BPR loss는  observed, unobserved user-item interaction에 대해서 상대적인 순서를 고려한다.  특히, BPR은 user의 선호를 많이 반영한 observed interaction들에 대해 unobserved interaction보다 더 높은 prediction을 한다. objective function은 다음과 같다.
