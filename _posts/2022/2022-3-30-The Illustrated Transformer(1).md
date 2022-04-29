---
title: The Illustrated Transformer
layout: post
Created: March 30, 2022 23:30 PM
tags:
    - Natural Language Processing
use_math: true
comments: true
sitemap :
  changefreq : daily
  priority : 1.0
---
> [The Illustrated Transformer](http://jalammar.github.io/illustrated-transformer/)  다음 링크의 포스트를 정리한 내용이다. Transformer이루고 있는 각 component들과 수식에 대한 근거가 헷갈려서, 이번기회에 한번 더 정리 해보고자 한다.
>

---

Transformer model의 가장 큰 장점은 parallelization에서 온다는 것이고, 특정 task에서 Google Neural Machine Translation model보다 좋은 성능을 보였다.

## High-Level Look

<a href="https://imgur.com/qwGOp9C"><img src="https://i.imgur.com/qwGOp9C.png" title="source: imgur.com" /></a>
Machine Tranlation task에서의 transformer 모델을 Single black box로 표현해보면 위와 같이 표현해볼 수 있다.

<a href="https://imgur.com/tkCMW9l"><img src="https://i.imgur.com/tkCMW9l.png" title="source: imgur.com" /></a>

그리고 이 single black box는 Encoder, Decoder로 나눌 수 있다.

<a href="https://imgur.com/GdMvg9V"><img src="https://i.imgur.com/GdMvg9V.png" title="source: imgur.com" /></a>
그리고, 각 Encoder, Decoder componet들은 그것들의 stack으로 이뤄져있다.

<a href="https://imgur.com/u5dXFpH"><img src="https://i.imgur.com/u5dXFpH.png" title="source: imgur.com" /></a>
각 Encoder, Decoder block은 다음과 같은 구조로 이뤄져 있다.

여기서 핵심은 self-Attention block이다.

---

## Bringing The Tensors Into The Picture

Trained model에 어떻게 input이 들어가서, output이 계산되는지에 대한 flow를 살펴볼것이다. 각 word는 [embedding algorithm](https://medium.com/deeper-learning/glossary-of-deep-learning-word-embedding-f90c3cec34ca) 을 통하여, 정해진 dimension의 embedding으로 표현된다. 이 embedding들은 bottom-most encoder로 들어간다. Bottom-most encoder를 제외한 encoder들의 input은 바로 전의 encoder의 output이 들어간다. Encoder의 input으로 들어가는 크기는 대부분 512 크기의 vector로 이루어진 list를 받는다. List의 크기는 hyper parameter로써, training dataset에서 가장 긴 sentence의 길이가 된다.

<a href="https://imgur.com/0TWRCzG"><img src="https://i.imgur.com/0TWRCzG.png" title="source: imgur.com" /></a>
여기서 볼 수 있는 Transformer의 key point 중 하나는 각 position에 있는 각 word가 encoder에서 own path를 갖는다는 것이다. Self-Attention에서는 이러한 paths에 대해 dependencies가 있다. 하지만 Feed-forward layer에서는 이러한 dependencies가 없다. 그래서 feed-forward layer를 통해 여러개의 paths들이 parallel하게 실행될 수 있다.

---

## Now We’re Encoding!

위에서 언급했듯이, encoder는 list of vectors를 input 으로 받는다. Input들은 ‘self-attention’ 로 전달하고, 그 layer의 output은 다시 ‘feed-forward neural network’으로 전달된 후에 그 output이 다음 encoder로 전달된다.

<a href="https://imgur.com/ajAQ2u5"><img src="https://i.imgur.com/ajAQ2u5.png" title="source: imgur.com" /></a>

---

## Self-Attention at a High Level

다음과 같은 문장이 input sentence로 주어지고, 이 문장을 해석하고 싶다고 가정하자.

`“The animal didn’t cross the street because it was too tired”`

위의 문장에서 `it` 이 문장에서의 어디를 가르킬까? `street`일까 아니면 `animal`일까?. Human에게는 쉬운 질문이지만, 알고리즘에게는 단순한 질문이 아니다.

Model이 `it`  이라는 word를 process하고자 할때, self-attention은 `it`이 `animal`과 associate하다고 알려준다.

Model이 각 word를 process하고자 할때, self-attention은 해당 word를 더 잘 encoding하기 위한 단서를 찾기 위해서 input sequence의 다른 posistion들을 보게된다.  RNN과 친숙하다면, RNN의 hidden state들이 current word를 process할때, previous words/vectors에 대한 representation을 어떻게 incorporate하여 maintain하는지 생각보면 좋을 것 같다.

<a href="https://imgur.com/ueNuWFO"><img src="https://i.imgur.com/ueNuWFO.png" title="source: imgur.com" /></a>
---

## Self-Attention in Detail

vectors를 이용하여 self-attention을 어떻게 계산하는지 살펴보고 나서, matrices로 어떻게 구현하는지 살펴보자.

**Self-attetion에서의 첫번째 단계는** encoder의 각 input vector로부터 three vectors를 만들어야 한다. (세개의 vector는 각각 embedding of each word이다.) 각 단어에 대해, Query vector, Key vector, Value vector를 만든다. 이 벡터들은  training할때, 세개의 matrices를 통해 embedding을 곱하여 만들어진다.

이 세개의 새로운 벡터들은 embdding vector들보다 dimension이 작다. 이 세개의 벡터의 dimensionality는 64이고, encoder의 input/output인 embedding vector의 dimensionality는 512이다. 이것들이 작아야할 필요는 없지만, multiheaded attention constant의 계산을 하기 위한 architecture choice이다.

<a href="https://imgur.com/4WD7QcH"><img src="https://i.imgur.com/4WD7QcH.png" title="source: imgur.com" /></a>
Query, Key, Value vector들은 무엇인가?

Attention에 대해 계산하고, 생각할 수 있게끔 하는 abstractions라고 할 수 있다. 이후에 나올 계산과정을 이해하면, 세개의 vector들이 어떤 역할을 하는지 충분히 이해할 수 있을 것이다.

**Self-attetion에서의 두번째 단계는** score를 계산하는 과정이다. 첫번째 단어 `‘thinking’` 에 대해 self-attention을 계산한다고 해보자. `‘thinking’` 이라는 단어에 대해 문장의 각 단어의 score를 계산해야 한다. Score는 input sentence의 다른 부분에 대해 얼마나 focus해야 하는지 나타내는 값이다.

<a href="https://imgur.com/Wr68Waa"><img src="https://i.imgur.com/Wr68Waa.png" title="source: imgur.com" /></a>
Score는 Query vecotor와 scoring하려는 각 단어의 Key vecotor의 dot product을 통해 계산된다. 그래서 만약 첫번째 #1 위치의 단어에 대해 self-attetion을 계산하려 한다면, 첫번째 score는 dot product of k1 and q1이고, 두번째 score는 q1과 k2이다.

**Self-attetion에서의 세번째, 네번재 단계는** scores를 8 (square root of the dimension of key vectors \sqrt(64))로 나누는 것이다. 이렇게 나눔으로써, 더 stable한 gradient를 갖게 해준다.

<a href="https://imgur.com/jKocOdr"><img src="https://i.imgur.com/jKocOdr.png" title="source: imgur.com" /></a>
계산된 scores를 Softmax 함수에 전달하여, 합이 1이 되게끔 normalize시켜준다.

**다섯번째 단계는** 각 value vector들을 softmax의 결과와 곱해준다. 여기서의 intuition은 우리가 focus하고 싶은 단어들의 본연의 값을 유지시키고, 연관되지 않은 단어들을 제거할 수 있다. (예를들어 0.001과 같은 작은 값의 score와 곱함으로써)

**여섯번째 단계는** weighted value vector들을 더해주는 것이다**.** Weighted value vector의 합이 그 position에서의 self-attention layer의 output이다.

<a href="https://imgur.com/SRRcG3y"><img src="https://i.imgur.com/SRRcG3y.png" title="source: imgur.com" /></a>

위의 단계들이 self-attention의 계산과정이다. Resulting vector를 이제 Feed-forward layer로 전달한다. 실제 구현에서는, 빠른 계산을 위해 matrix form을 통해 계산된다. 이제 Matrix Calculation of self-attention을 살펴보자.

---

## Matrix Calculation of Self-Attention

<a href="https://imgur.com/ONFl1O8"><img src="https://i.imgur.com/ONFl1O8.png" title="source: imgur.com" /></a>
첫번째 단계는 Query, Key, Value matrix를 계산하는 것이다. Embeddings를 matrix X로 packing하고,  $W^Q,W^K,W^V$와 곱한다.

<a href="https://imgur.com/46ncEjb"><img src="https://i.imgur.com/46ncEjb.png" title="source: imgur.com" /></a>
마지막 단계(?)는 이전의 2번째부터 6번째 단계를 압축했는데, 위 그림의 formula를 통해 계산할 수 있다.

## The Beast With Many Heads

논문에서는 self-attention을 “multi-headed” attention이라는 메커니즘을 추가하여 개선했다. 이 메커니즘은 attention layer 성능을 두가지 방법으로 향상시킨다.

<a href="https://imgur.com/ZbPaT0V"><img src="https://i.imgur.com/ZbPaT0V.png" title="source: imgur.com" /></a>
1. 다른 위치에도 focus할 수 있게 끔 model’s ability를 확장시킨다. 위의 예시의 z1은 모든 encoding에 대해 일부분을 포함하고 있지만, 그 단어 자체에 의해서 dominate될 수 있다. `“The animal didn’t cross the street because it was too tired”` 라는 문자에서 it이 어떤 단어를 가리키는지 알고 싶을때, 유용할 수 있다.
2. Attention layer에 “representation subspaces”를 제공한다. 이후의 설명에 나오겠지만, multi-headed attention은 multiple sets of Query/Key/Value weight matrices를 갖고 있다. (Transformer는 8개의 attention heads를 이용하므로, eight sets for each encoder/decoder를 갖게된다.) 각각의 set은 랜덤하게 초기화 된다. 학습한 이후에, 각 set들은 input embeddings를 different representation subspace로 project하기 위해 사용된다.

<a href="https://imgur.com/UQ20k9W"><img src="https://i.imgur.com/UQ20k9W.png" title="source: imgur.com" /></a>
위에서 설명한 같은 self-attention calculation 한다면, different weight matrices로 여덟번 다른 계산을 하게 되고, 8개의 different Z matrices를 갖게된다.

<a href="https://imgur.com/AAMzQQg"><img src="https://i.imgur.com/AAMzQQg.png" title="source: imgur.com" /></a>
이것은 약간의 challenge를 만든다. Feed-forward layer는 여덟개의 matrices를 기대하지 않는다 - single matrix를 기대한다. (각 단어에 대해 하나의 vector) 그래서 여덟개의 matrices를 single matrix로 압축해야한다. Concat을 하고, 추가적인 matrix $W^O$와 곱하여 하나의 matrix로 만든다.

<a href="https://imgur.com/76kFkFv"><img src="https://i.imgur.com/76kFkFv.png" title="source: imgur.com" /></a>
이것이 multi-headed self attention의 전부이다. 위의 그림이 모두 합친 그림이다.

<a href="https://imgur.com/eKFxBaM"><img src="https://i.imgur.com/eKFxBaM.png" title="source: imgur.com" /></a>
Single attention layer의 경우 it이 focus하고 있는 그림은 다음과 같았다.

<a href="https://imgur.com/E8gvNcp"><img src="https://i.imgur.com/E8gvNcp.png" title="source: imgur.com" /></a>
Mulit-headed atttention을 사용하면 위와 같이 표현할 수 있게된다.

---

## reference

1. [The Illustrated Transformer](http://jalammar.github.io/illustrated-transformer/)
