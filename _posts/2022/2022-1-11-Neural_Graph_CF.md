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