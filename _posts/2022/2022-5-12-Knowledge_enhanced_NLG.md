---
title: Knowledge-enhanced text generation on colloquial language
layout: post
Created: April 28, 2022 9:31 AM
tags:
    - Conference
    - Natural Language Processing

use_math: true
comments: true
sitemap :
  changefreq : daily
  priority : 1.0
---
> [[서울대 AI 여름학교] 딥러닝으로 똑똑한 챗봇 만들기(김병창 연구원)](https://www.youtube.com/watch?v=Ug3eQMoNNJs)에서 발표하신 내용을 바탕으로 정리한 내용이다. Useful한 text를 만들기 위해, summarize knowledge → knowledge selection → Ensure faithfulness 과정 각각에 대해서 발표하신 논문을 짧게 설명해주셨다. NLG에서 decoding algorithm이 가장 중요하다고 생각했었는데, knowledge enhanced를 통해 useful한 text를 만드는 과정 또한 성능에 큰 영향을 미친다는 것을 배웠다.
>

---

Text Generation : system that focuses on producing coherent, useful text.

useful에 초점을 맞춤. useful한 text generation이란?
  - 사용자에게 정보를 줘서, 쓸모있는 정보가 있어야한다.
  - noisy text environment 에서도 잘 작동해야 useful.

Knowledge-enhanced text generation on colloquial language 라는 큰 테마로 연구를 진행중.

![Untitled](https://i.imgur.com/pHA8Jik.png)
이러한 Knowledgeable chatting machine을 만들기 위한 마일스톤을 생각해봄.

![Untitled 1](https://i.imgur.com/mnKxz4i.png)
1. Summarizing knowledge : knowledge enhance를 위한 웹상의 데이터를 summarize,
2. Using Knowledge : 가져온 knowledge를 NLG에 사용할 수 있어야 하고,
3. Ensure Faithfulness : (거짓말 x) 맞는 말만 하는 것을 보장할 수 있어야하고,
4. Deploy : Make fast & scalable, 빠른 inference.

1~3에 대해서만 다룰 예정.

---

## 1. Summarizing Knowledge : Abstractive Summarization of reddit Posts with Multi-level Memory.

![Untitled 2](https://i.imgur.com/JHt9Rjy.png)
colloquial language(구어체)의 새로운 데이터셋을 만들고, SOTA한 새로운 모델 제시.

### Dataset

이전 연구들의 데이터셋은 대부분 뉴스와 관련된 글 들이어서, formal한 데이터셋이었다. Formal한 기존의 데이터셋에는 다음과 같은 문제점이 있었다.

1. Lead bias : 앞쪽 문장만 가져와도 (두괄식) 대부분 요약이 된다. Relative Location을 시각화 했을때도, 앞부분에 편향되어있다.
2. Copy-and-Paste : 표현을 대부분 가져와 사용한다. 기존 benchmark model들은 절반 이상을 그대로 가져와 사용하였다.

reddit TIFU(Today I fucked Up)을 크롤링해서 가져왔고, 이 글들은 앞쪽엔 short summary, 뒤쪽엔 Long Summary를 다루는 특징이 있슴. reddit TIFU에 대해 Lead bias가 거의 없고, copy-and-paste에 대해서도 많이 줄어들음.

### model

word level, sentence level, document level representation을 만들어서, 세가지를 모두 혼합하여 사용함.

![Untitled 3](https://i.imgur.com/yAVvJBM.png)
convolution layer를 쌓았는데, 볼수있는 범위가 처음에는 좁았다가 점점 넓어짐. 예를들어 아래쪽 feature는 phrase level, 뒤쪽의 feature는 sentence level이라고 할 수 있다. 여러 benchmark에서 SOTA를 달성함.

**Concluding Remarks : 기존의 dataset에 존재하는 bias를 제거한 새로운 dataset과 different levels of representations을 capture할 수 있는 model을 만들었다.**

---

## 2. Using Knowledge : Sequential Latent Knowledge Selection for Knowledge-Grounded Dialogue (SKT)

앞서 만든 knowledge를 어떻게 잘 활용하는지에 대한 연구.

knowledge-grounded Dialogue의 dataset인 WoW(wizard of wikipedia)를 사용함.

![Untitled 4](https://i.imgur.com/Arpj9E4.png)
어떤 user가 질문을 했을때, (1) wizard가 wikipedia에서 knowledge를 select하여, (2) (1)에서 고른 knowledge를 이용해서 대답(utterance)을 만들어 낸다. 여기서 wizard를 modeling하는게 목표인 task이다.

![Untitled 5](https://i.imgur.com/plgQTRK.png)
기존의 model들은 multi-turn으로 이뤄진 dialogue context에 적합한 sequence 고려한 모델이었지만, Knowledge selection할때는 현재 turn만을 고려하여 대답을 만들어 냈다.

![Untitled 6](https://i.imgur.com/EXkFu1b.png)
하지만, Knowledge selection에 대해서도 sequence를 고려하여 해야 한다고 생각해서 추가했다. Knowledge-grounded-dialogue task에서 대답을 보면, 어떤 knowledge를 사용했는지 유추하기 쉽다. 그래서 response를 보고, knowledge label을 추측하게 하는 mechanism을 추가하여 semi-supervised/unsupervised로 학습이 가능하게 만들었다. 해당 모델은 두가지 데이터 (WoW, Holl-E)에서 SOTA를 달성했다.

첫번째 task인 Knowledge Selection에서 성능 향상이 있었고, 뒤에 따라오는 Response(utterance) generation task에서도 성능 향상을 보였다. 여기서 주목 할 것은, test-unseen dataset에 대해서도 성능 향상이 있었다.

**Concluding Remarks: dialogue model에 knowledge를 섞어(selection)줄때, 대화 구조를 고려하면 성능이 더 좋다. 또한 Response signal을 활용하면 relevant knowledge를 더 잘 선택한다.**

---

## 3. Ensure Faithfulness : How Robust are Fact Checking Systems on Colloquial Claims? (NAACL2021)

FEVER라는 기존의 fact-checking dataset이 있었고, 1번에서의 기존의 dataset과 동일한 formal한 style이었다. Colloquial한 데이터셋에는 적용시키기 어려웠다. FEVER를 style-transfer과 저자가 만든 pipeline을 이용하여 annotation 없이 Colloquial claims라는 Colloquial한 style의 fact-checking dataset을 만들어 냈다.

![Untitled 7](https://i.imgur.com/q84Zxgg.png)
위의 예시가 Fact-checking과 관련된 것이다. (링컨 1865년 사망. 인터넷 1969년에 탄생) 참/거짓을 판단해야하는 text가 Claim, 증거가 되는 것이 Evidence이다.

Style transfer을 통해 한 문장당 500개를 oversampled했고, Filtering pipeline을 통해 3개만 선택하여 사용하였따. 최종적으로 45k개의 dataset를 얻음. 해당 dataset의 이름은 Colloquial Claims.

Colloquial Claims에 대해 Quality check도 진행을 하였다.

- Humanness → closer to Colloquial style)
- HumanNLI → Label Preserved)

Colloquial Claims의 특성은 다음과 같다.

- Diverse Claims : Longer and more divers in length.
- Colloquial Style : Top-20 Frequent tokens in the claims.

![Untitled 8](https://i.imgur.com/BGIx67E.png)
위와 같이 Fact-check task에 대해 base model을 실험하였다. FEVER에서 가장 잘 작동한 모델이 Colloquial Claims에서 성능이 안좋았다. (박살이 났다.)

Colloquial Claims의 Challenges는 다음과 같다.

- Filler words : Word-matching retrieval systems(WikiAPI) are vulnerable for filer words. (filer words는 말할때 중간 중간에 나오는 말들이다. 의미가 없고, 문장에도 영향이 없다. `근데, 아니` 이런 말들이다.

    **→ Dense-matching retrieval (e.g.DPR)을 사용하여 해결함.**

- Lexical Variations & polysemy

    `‘Niko Coster-Waldau is also the hosts of the show. He was with Fox at one point’` : 에서 fox는 fox broadcasting company를 의미하는데, word단위여서 Fox를 retrieval하게 된다.

    **→ 원래 단어나 대명사가 어떤 단어를 나타내는지, 복원시키기 위해 Coreference Resolution에대한 knowledge가 담긴 CorefBERT를 사용하였다. (BERT말고 CorefBERT claim verifier를 사용하였다.)**


**Concluding Remarks: style transfer pipeline을 만들어서 dataset을 만들고, Colloquial dataset에 존재하는 어려운 특성들에 대한 해결책을 제시하였다.**
