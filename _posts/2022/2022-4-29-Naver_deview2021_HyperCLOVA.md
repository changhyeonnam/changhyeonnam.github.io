---
title: HyperCLOVA에게 무엇이든 물어보살
layout: post
Created: April 28, 2022 9:31 AM
tags:
    - Conference
use_math: true
comments: true
sitemap :
  changefreq : daily
  priority : 1.0
---

> Naver Deview 2021에서 **‘Bring Your Own Data: Business AI 고민? HyperCLOVA에게 무엇이든 물어보살’** 이라는 주제의 발표에 대해 정리한 내용이다. 이전에 추천시스템 개발할때, 가장 문제가 되었던 것이 User id가 없는 user의 정보에 대해 user embedding을 어떻게 표현할 지에 대한 것이었다. 해당 발표에서는 user에 대한 프라이버시 때문에, 유저의 정보만을 이용하여 user embedding을 표현하기 때문에 앞서 언급한 상황과 동일했다. 또한 NLP에서의 BERT나, Computer vision에서의 SimCLR을 사용하여 Foundation model을 만드는 것 또한 흥미로웠다. 이전에 대부분의 발표들이 연구에 초점을 맞췄다면, 해당 발표는 business ai 제품을 Foundation model을 통해 어떻게 효율적으로 양산할 것인지에 대한 내용이었다.
>

---

## 1. Business AI 제품 양산의 가능성

### 1.1 AI 모델 개발 파이프라인

먼저 AI 모델을 직접 만드는 것과 클라우드 서비스에서 제공하는 모델을 사용하는 것을 음식점에 비유하여 비교했다. 전자는 충분한 분석과 계산 시간이 필요하므로 고급 레스토랑인 반면, 후자는 음식의 질은 떨어지지만 빠르게 받을 수 있는 패스트푸드점과 유사하다고 하였다.

AI 모델 개발 파이프라인은 크게 3단계 의사결정을 거치게 된다.

![Untitled](https://i.imgur.com/i6hVjMg.png)

1. 어떤 feature를 쓸지 결정. (직접 db에서 data를 꺼내어 feature를 개발)
2. 알고리즘 디자인 (gausssian, Tweedie, 최신 최적화 기법)
3. 학습과정 (batch, learning rate, etc)

그리고 위의 3단계를 반복적으로 수행하게 된다. 반복 작업이므로 빠른 시간안에 결과를 내기 어렵다. 즉, 요리과정에 혁신이 없으면 제품 양산이 어려운 것과 유사하다.

### 1.2 최신 AI 연구 트렌드 TL;DR (# 선크게후고민)
![Untitled 1](https://i.imgur.com/bEL7iBq.png)

최신 ai 연구는 Big이 대세이다. Model, Data, Resource 모두 크게 하는 추세이다. 큰 모델은 성능은 좋지만 서비스 측면에서 빠른 latency를 만족시키 어렵고, 많은 GPU를 항상 사용할 수도 없다. 그래서 서비스에 big model(=pretrained model)을 직접 사용하는 것이 아니라 knowledge transfer를 사용한다. Transfer learning이라고 부르기도 하는데, 큰 모델이 학습한 것을 작은 모델에 주입하여, 작은모델을 이용하여 대신 서비스를 하는 것이다.

![Untitled 2](https://i.imgur.com/goRAJMT.jpg)

Big model 자체는 육수와 유사하다고 할 수 있다. 육수를 사용하여 여러 국밥(!)을 만드는 것과 유사하게 transfer 과정을 거쳐서 다른 모델을 쉽게 만든다.

### 1.3 GPT-3가 보여준  놀라운점

GPT-3은 매우 큰 언어  모델이다. Transformer를 엄청 많이 쌓고(175B), 다음 단어(token) 맞추는 것으로 pretrain되어 있다.  데이터는 1T tokens를 사용했고, GPU v100 10,000장을 사용하였다. GPT-3를 사용할 때는 transfer learning(few shot learning)을 거쳐 사용한다.  

### 1.4 Foundation Model

![Untitled 3](https://i.imgur.com/DuMJmB2.png)
최근에 stanford에서 foundation model이라는 것을 정의하엿다. GPT-3와 같은 매우 큰 모델이 Foundation model의 예시가 될 수 있다. Foundation model 자체로는 서비스에 사용할 수 없지만, 부가적인 기능들을 transfer learning을 통해 서비스에 사용할 수 있게된다. Machine Learning, Deep  Learning, Foundation model을 Emergence,  Homogenization  관점에서 비교하여 설명하였다.

- Emergence : 의도했던 능력 + 추가능력.
- Homogenization : 비슷한 능력을 갖고있는 그룹.

|  | Emergence | Homogenization |
| --- | --- | --- |
| 룰베이스 | 없음 | 서로 다른 툴로 작성된 개별 프로그램 |
| 머신러닝 | How | 학습 알고리즘 |
| 딥러닝 | feature | 아키텍쳐 |
| 파운데이션 모델 | Functionalities | 모델 |

### 1.5 앞으로 바뀔 AI 모델 개발 파이프라인

Foundation model은 육수와 같기 때문에, 빠른 시간안에 국밥을 만들 수 잇다. GPT-3에 들어가는 text만 바꿔주면 시를 쓰고, 대본도 쓸 수 있게 된다.  또한 AI 모델을 몰라도 개발이 가능해진다. Application 개발자가 foundation model과 관련된 API를 사용하여 쉽게 개발할 수  있다.

---

## 2. Foundation Model  for business

온라인 생태계 속에서 일어나는 다양한 사용자의 질 향상과 사용자 경험 증대를 위한 Foundation model은  무엇이 있었는지, 무엇을 시도 했는지에 대한 내용이다.

### 2.1 Related Works

최근 BERT, GPT 등의 Pre-text task를 응용해 business model을 만드려는 시도가 활발했다. 하지만 NLP, Computer vision의 foundation model이기 때문에 한계점이 존재한다. Model, Dataset의 규모가 작고, Diversity of Downstream tasks가 낮고, Unimodal한 dataset을 사용했기 때문에 다른 시스템으로의 전이가 불가능 했다.

### 2.2 ShopperBERT(initial approach)

처음 시도한 business foundation model로써, BERT의 아이디어를 차용했다. 쇼핑 구매 기록을 Masked Language Model(MLM) 방식으로 학습하였다.

- 1,300만  유저와  4,800만 개의 상품을 대상으로 한 2년치 기록 데이터(8억) 수집
- sentenceBERT를 이용해 상품명을  embedding vector로 넣어줌.
- 상품의 계층별 카테고리를 supervision으로 사용.
- Pretrained한  User-embedding은 단순한 NLP를 이용해 기존의 curation된 6개의 down stream model들의 성능을 뛰어 넘음.

### 2.2 Shopper BERT(Concept Figure)

![Untitled 4](https://i.imgur.com/cjePWSj.png)구매 상품을 상품단위로 나타내는 것이 아닌, 상품이 속한 하위 카테고리로 변환시켜 input으로 넣어줌. 이 목록을 적절한 방식으로 augmentation 한뒤, 랜덤하게 마스크 토큰을 씌워다음 마스크 토큰의 상품 category를  예측하는 것으로 학습하였다.  

User  Embedding을  추출할때는 Pretrain된  ShopperBERT에 augmentation을 적용하지 않고, 원본 그대로 사용자 쇼핑 구매기록을 넣어 CLS 토큰으로 embedding을 추출하였다. 추출한 embedding으로 각 downstream task를 풀게된다.

### 2.2 ShopperBERT(analysis)

shopperBERT를 통해 여러 가설들을 실험적으로 증명하였다.

![Untitled 5](https://i.imgur.com/ZDu5j3f.png)왼쪽 그림은 데이터 수집기간에 따른 성능변화이다. Pretrained dataset의 수집기간을 늘릴 수록 downstream tasks의 성능이 많이 향상되었다.

오른쪽 그림은 Downstream task에서 사용기록이 적은 cold user와 기록이 많은 heavy user에 대해 pretrain된 user embedding이 얼마나 효과적인지 비교한 그래프이다. From scratch 추천 모델(T-trans)과 pre-trained user embedding 모델의 (U-MLP)성능을 비교했을 때 Cold에서 더 큰 향상을 보였다.

### 2.2 ShopperBERT(findings)

- 쇼핑 데이터를 이용한  pretrained user embedding이 쇼핑과 연관된 다양한 task에서 task-specific 추천모델을 뛰어넘음.
    - Global user embedding의 가능성 발견
    - 학습된 user embedding을 이용하면 편리하고 빠르게 MLP 모델을 이용하여 복잡한 추천 모델의 성능을 뛰어넘을 수 있음 (2,458배 빠른 속도)
- 데이터 수집 기간에 따른 downstream tasks 성능 향상 발견

### 2.2 ShopperBERT(limitations)

- 모델 크기를 늘려도 성능 향상이 두드러지지 않음
    - 상품의 카테고리를 맞추는 task가 상당히 쉽다
- 쇼핑과 연관된 도메인에 국한된 downstream task
- Unimodal dataset : 사용한 training dataset은  한가지 domain의 dataset이었고, 오로지 naver 내에서만 활용될 수 있는 모델이었다.
- 다른 시스템으로의 전이 불가능

### 2.3 SimCLR(second approach)

ShopperBERT에서  사용하던 target  objective가 다방면의 규모확장을 제한한다고 판단했다. 그래서  contrastive objective를 사용하는  contrastive learning으로 연구방향을 선회하였다. Computer vision field에서 활용되는 contrastive 모델 중 가장 널리 알려진 SimCLR을 활용하였다.

SimCLR은 contrastive setup을  따르기 때문에 상품의 category와 같은 정보를 target objective로 사용할 필요가 없다. 구매 상품의 설명만을 이용해 자연어 레벨로 떨어진 사용자 구매기록 data를  구축하였다. 최종적으로 SimCLR 모델은 Downstream task에서 더 좋은 성능을 보였다.

### 2.3 SimCLR(concept figure)

![Untitled 6](https://i.imgur.com/dPezMLr.png)기존의 SimCLR은 한개의 이미지를 augmentation한뒤, 서로 다른 2개의 이미지를 만들고, Contrastive Learning을 통해 유사도를 Maximize하는 방향으로 학습한다.

이 아이디어를 차용해 user의 구매기록을 자르거나 섞어, 서로 다른 2개의 augmented 구매기록을 만들고, 같은 user는 유사도를 높게, 서로 다른 user는 유사도를 낮게 만드는 contrastive learning을 통해 모델을 학습시켰다. user feature를 뽑는 방법과 평가 protocol은 ShopperBERT와 유사하다.

### 2.3 SimCLR(findings)

- Contrastive objective를 사용함으로써 pre-text task가 더 어려워 졌다.
    - ShopperBERT와  다르게 모델 크기를 키울 수록 향상 되었다.
- Pre-train하는 데 있어, 상품명만 필요함으로 다른 시스템으로의 전이가 가능했다.

### 2.3  SimCLR(limitations)

- 쇼핑과 연관된 도메인에 국한된 downstream task
- Unimodal dataset → 쇼핑 데이터
- 정밀하게 가공된 augmentation 기법 필요

ShopperBERT와 SimCLR에서 여러가지 한계점과 발견들이 있었다. 이 모델들을 발판 삼아 business foundation 모델로 한발짝 나아갔다.

---

## 2.4 Next-Generation Business Foundation Model

다양한 Domain과 system으로 transfer learning이 가능한 CLUE와 HyperClova LM을 활용해 만든 Hyper Clova Biz에 대한 내용이다.

### 2.4 Contrastive Learning User Embedding(CLUE)

CLUE는 SimCLR와 마찬가지로 contrastive model이다. CLUE에서는 augmented된 구매(서비스)기록이 아닌, 동일한 user의 서로다른 서비스 기록을 가져와 유사도를 maximize하게 된다. 64개의 v100 gpu로 725M parameter개를 갖은 모델과 50B 서비스 로그(Byte-level BPE 사용) 를 통해 hyper scale business foundation model을 만들었다.

### 2.4 CLUE(Concept Figure)

![Untitled 7](https://i.imgur.com/RbRshEa.png)NAVER 내의 다양한 서비스 기록을 받아, 각종 downstream task로 transfer한다. 어떠한 augmentation도 필요없다는 것이 클루의 장점이다. 다양한 서비스 도메인을 함께 학습하므로, multi-modal 한 특성 또한 CLUE의 큰 경쟁력이다. User feature를 downstream task로 transfer했을때, SimCLR 대비 10~20% 성능 향상이 일어남. 텍스로 변형된 서비스 로그르 encoding한뒤, 유사도를 maximize하게 된다.

### 2.4 CLUE(analysis)

![Untitled 8](https://i.imgur.com/70sT6B7.png)왼쪽 그래프들은 Dataset 고정 후, batch/model 사이즈를 변경한 실험이다. batch size, model size 모두를 적절하게 같이 증가시켜야 성능이 향상된 것을 볼 수 있다. 오른쪽 그래프들은 batch size를 고정한 뒤 dataset, model size 크기를 키웠다. 데이터 길이를 증가시키면 성능이 향상된 것을 확인할 수 있다.

### 2.4 CLUE(analysis)

![Untitled 9](https://i.imgur.com/nuoPvkH.png)위의 그래프들을 petaflop/s-day(24시간 동안 초당 10^15개의 부동소수점 연산을 수행하는 데에 소요되는 전력)에 따라 그린 그래프이다**.** Batch size가 작다면 Compute Resource를 투자해 모델 크기를 키워도 성능이 향상되지 않는다. Batch size가 크다면 모델 크기를 증가시켜 성능을 향상시킬 수 있다.

Compute Resource는 데이터 셋 길이보다 모델 크기에 먼저 투자하는게 좋다.

### 2.4 CLUE(analysis)

![Untitled 10](https://i.imgur.com/eUGDNfd.png)Loss와 petaflop/s-day에 대한 그래프이다. Compute Resource가 많이 투입될 수록 Test Loss가 줄어든다.(Linear) Pre-text task의 test loss가 작다면 downstream의 test loss도 작은 경향이 나타난다.

### 2.4 CLUE(analysis)

![Untitled 11](https://i.imgur.com/sIZ14vD.png)학습 정도와 user embedding output dimension에 관한 비교 실험이다. 더 많은 Epoch를 학습할 수록, 모델 사이즈가 클수록 downstream 성능이 향상되었다.  Model embedding인 user embedding의 차원 크기가 downstream 성능에 영향을 미치지 않았다. User embedding의 차원은 다양한 서비스에 보급할 때, 저장소 크기와 직결되는 문제이다.

### 2.4 CLUE(findings)

CLUE는 NLP, Computer vision에서 활용되는 Foundation model과 같은 확장성을 보인 business, foundation model이다. CLUE에서 적절한 computer resource를 투입하여 상응하는 성능 향상을 확보 하였다. 단일 서비스 로그가 아닌 서로 다른 다양한 서비스 로그를 텍스트화 하여 서비스에 사용함으로 다양한 domain, system으로의 효과적인 transfer가 가능해졌다.

### 2.4 CLUE(limitations)

Equivalent predictive objectives를 사용하는 모델들과 달리 Contrastive setup으로 인해 Complicated Scaling Law를 활용해야 했다.

### 2.5 HyperCLOVA-Biz

text화된 input을 가장 잘 활용하는 것은 Language Model이라는 것으로 돌아가 Hyper CLOVA LM을 사용하였다. HyperCLOVA-LM을 Finetuning 한뒤 feature를 뽑아 user embedding으로 사용하였다. CLUE 대비 2~3% 성능 향상, CLUE feature와 함께 사용하였을 때 Downstream tasks에서 sota대비 5~10% 성능 향상을 이뤘다.

### 2.5 HyperCLOVA-Biz (Concept Figure)

![Untitled 12](https://i.imgur.com/kPnxx0T.png)1. HyperCLOVA-LM을 Naver 쇼핑 데이터로 Finetuning.
2. 실제 사용될 때는 해당 Task의 Task-specific 데이터로 한 번 더 Finetuning
3. 마지막 [SEP] 토큰을 [CLS] 토큰 처럼 사용

### 2.5 HyperCLOVA-Biz (analysis)

![Untitled 13](https://i.imgur.com/1n57V1F.png)이전의 추천모델들은 기존의 아이템들을 골라주는 것과 달리, 모델이 직접 살만한 아이템을 골라주는 방식으로 추천을 한 것을 볼 수 있다. (앞으로 인공지능이 추구해야 할 방향이다.)

### 2.5 HyperCLOVA-Biz(findings)

HyperCLOVA-Biz를 통해 언어모델에서 성공적으로 사용자 feature 추론 가능해졌다. 언어모델과 추천시스템 사이를 잇는 중요한 발견이라고 할 수 있다.

### 2.5 HyeprCLOVA-biz(limitations)

Finetuning 과정이 복잡하고, user-embdding을 뽑는 방식이 정교하지 않다. 또한 학습의 단순화와 embedding 추출의 정교화는 아직 미지의 영역이다. 큰 Language Model을 학습하고 fine tuning 해야 하므로 매우 큰 computing resource가 든다.

### 3. Business Transfer Learning

지금까지 설명한 business model을 활용하여 다양한 business 문제로 transferring하는 방법과 그 결과에 대한 내용이다.

### 3.1 Business Transfer Learning Requirements

![Untitled 14](https://i.imgur.com/zB4mjeF.png)
### 3.6 Business Transfer Learning

![Untitled 15](https://i.imgur.com/omhx9Ed.png)
### 3.9 다른 서비스의 기록이 도움이 되는가?

![Untitled 16](https://i.imgur.com/1SzW0kH.png)서로 많이 달라보이는 서비스의 정보가 서로 도움 되는지 실험하였다. Business 모델의 user feature가 도움되지 않으면 인기순보다 비슷하거나 낮을 것이다. 서로 관계가 없는 서비스까지 유의미한 transfer learning이 가능한 것을 볼 수 있다. 여러 서비스 데이터를 활요한 CLUE와 같은 경우 SimCLR보다 압도적으로 성능이 향상되었다.

### 3.10 네이버 쇼핑 기획전 추천 온라인 실험

![Untitled 17](https://i.imgur.com/tOkvjzG.png)실제 서비스에 CLUE 모델을 적용한 결과이다. 기획전 data와 기본적인 user 정보만을 활용하는 모델들이다. api 서비스로 배포할 계획을 갖고 있고, 관련 시스템을 개발하고 있다. api를 사용하게 되면, 사용자의 기본적인 data를 활용하여 강력한 추천 모델을 만들 수 있고, 우수한 추론 결과를 얻을 수 있다.

### 3.13 HyeprCLOVA for Biz System

![Untitled 18](https://i.imgur.com/fuOCX9b.png)
