---
title: Metrics about Language Model
Created: June 26, 2022 11:23 PM
tags:
  - Natural Language Processing

use_math: true
comments: true
sitemap :
  changefreq : daily
  priority : 1.0
---

> 최근까지 나온 여러 PLM 모델들은 PPL(Perplexity)를 metric으로 사용하고 있다. 하지만 vocab size, tokenizer, 학습된 여러 데이터셋에 따라 모델의 성능이 달라질 수 있다는 생각을 했고, 어떻게 ppl을 사용하는 지 궁금하여 글을  작성하게 되었다. 이번 글에서는 Entropy, Cross Entropy, Perplexity를 포함한 metric과 Downstream task의 metric으로 자주 사용하는 GLUE, BLUE등도 정리해볼 생각이다. 기본적으로 다음 [[Link]](https://thegradient.pub/understanding-evaluation-metrics-for-language-models/)를 참고하여 작성했다.
>

---

기본적으로 Language Model 성능은 perplexity, cross entropy, bits-per-character(BPC)등을 사용하여 측정 한다. 또는 NLP downstream task에서의 성능을 사용하기도 한다. GLUE와 같은 것이 대표적이다.

하지만 점점 더 많은 metric을 사용하게 되어, LM사이에 성능을 평가하기 어려워 졌다. 예를들어  LM 성능을 특정 downstream task에서의 성능으로 표현하게 되면 LM의 성능이 reliable하다고 할 수 없다.

Perplexity를 최소화 시키는 것을 목표로 하는 대부분의 LM에 대해서 한가지 혼란스러운 점은 perplexity의 lower bound(하한)은 어떤 값인지에 대한 것이다. Perplexity를 0으로 하는것이 불가능하기 때문에, 우리는 optimal value를 알 수 없으며, 얼마나 낮아야 우리의 LM이 좋은지 알 수 있을까?  

또한 모델이 어떻게 학습되었는지 간에, test set에 대해서 90%가 60%보다 성능이 확실하게 좋다고 알 수 있는 Accuracy와 같은 metric과 다르게, 두개의 모델 중 더 낮은 Perplexity만을 보고 어떤것이 더 좋다고 할 수 없다. (vocab size, text의 preprocess방법, context length를 모른채로) 예를들어, character-level LM은 word-level LM보다 ppl이 훨씬 낮지만, character-level이 word-level보다 더 좋다고 할 수 없다. 그래서 서로 다른 모델들의 성능을 어떻게 평가해야 하는지 알아야 한다.

---

## Probability of sequence.

Language model은 임의의 symbol로 이루어진 sequence에 확률을 할당하는데 해당 언어에서 그 sequence가 존재할(likely) 가능성이 높을 수록 확률이 높아진다. Symbol은 word, character, subword가 될 수 있다.

![Untitled](https://i.imgur.com/yGFSGSx.png)
대부분의 LM은 위의 식과 같이 preceding symbols가 주어졌을때, 각 symbol들의 곱으로 이뤄진다.

어떤 LM 모델들은 neighboring symbols가 주어졌을 때, 각 symbol에 대해 확률을 예측하기도 한다. 해당 글에서는 LM을 conditional probability의 곱을 사용하는 LM에 한정지어 설명할 것이다.

---

## Entropy

언어의 목적은 정보를 전달하는 것이다. 전달되는 메시지에 포함되어 있는 평균 정보의 양을 측정하기 위해, 우리는 “entropy”라는 metric을 사용한다. (이때 entropy는 Language와 관련된 것이다. 열역학이 아니라.) Entropy에 대한 본질적인 설명은 이것을 제안한 Shannon의 paper인 “Prediction and Entropy of Printed English”에 다음과 같이 설명되어 있다.

“*The entropy is a statistical parameter which measures, in a certain sense, how much information is produced on the average for each letter of a text in the language. If the language is translated into binary digits (0 or 1) in the most efficient way, the entropy is the average number of binary digits required per letter of the original language.*"

영어 기준으로 각 character가 아스키코드로 8비트(또는 7비트)로 구성되어 있다. 하지만, 모든 character를 8비트로 사용하는 이 방법은 영어에 있는 각 letter를 표현하기 위한 가장 효율적인 방법은 아니다. ( 자주 사용하는 letter는 더 적은 수의 비트를 사용하는 것이 더 효율적이다.) 그러므로 가장 효율적으로 영어의 letter를 표현하는 방법을 고려했을 때, character-level entropy를 8비트 보다 더 적게 하는 것이 맞다.

![Untitled 1](https://i.imgur.com/EcLl79Zl.png)
Shannon은 특정 언어의 Entropy H를 다음과 같은 function $F_N$을 이용하여 근사하였다.

- $F_N$은 인접하여 있는 N개의 letter of text에 대한 것이다.
- $b_n$은 n개의 contiguous letters ($w_1,w_2,...,w_n)$을 의미한다.

함수 $K_n=-\sum p(b_n)log_2p(b_n)$이라고 정의 한다면, $F_n$을 다음과 같이 표현할 수 있다.

![Untitled 2](https://i.imgur.com/Zh2LSqJm.png)
Shannon은 language Entropy H를 다음과 같이 표현하였다. 해당 정의에 따른다면, entropy는 무한개의 symbol을 사용하여 계산한 것이다. 현실에서는, 유한개의 sample text로 부터 empirical entropy만을 근사할 수 있다.

![Untitled 3](https://i.imgur.com/F6UUO2Xm.png)
---

## Cross Entropy

임의의 Language L에 대해서 무한개의 text를 고려할 수 없기 때문에, 실제 language의 distribution은 알려져 있지 않다. Language Model은 Sample text에 대해서 해당 language의 empirical distribution P에 학습되는 distribution Q를 가깝게 하는 것을 목표로 한다. 두가지의 distribution의 “closeness”를 측정하기 위해, cross entropy가 자주 사용된다.

![Untitled 4](https://i.imgur.com/sUmRPSSm.png)
수학적으로, P에 대한 Q의 cross entropy는 다음과 같이 정의된다.

![Untitled 5](https://i.imgur.com/CHqwRuul.png)
만약 P,Q의 distribution이 descrete 하다면 위와 같이 정의될 수 있다. 이때, $D_{KL}(P\mid \mid Q)$은 Kullback-Leibler(KL) divergence of Q from P를 의미한다. 또한 해당 $D_{KL}(P\mid \mid Q)$은 Q에 대한 P의 relative entropy라고 알려져 있다.

그래서 P에 대한 Q의 cross entropy는 식과 같이 다음의 두가지 value의 합이다.

1. $H(P)$ : P에 최적화된 코드를 사용하여 P의 결과를 인코딩하는 데 필요한 평균 비트수.
2. $D_{KL}(P\mid \mid Q)$ : Q에 최적화된 코드를 사용하여 P의 결과를 인코딩하는 데 필요한 추가 비트 수.

이때 empirical entropy인 $H(P)$가 unoptimizable하기 때문에, Language Model을 학습할때 objective인 cross entropy loss를 최소하는 하는것은 KL divergence인 $D_{KL}(P\mid \mid Q)$를 최소화 시키는 것과 같다. 즉, $D_{KL}(P\mid \mid Q)$는 empirical distribution of language로부터 학습한 우리의 LM 모델의 objective이다.

---

## Perplexity

Wiki에서는 Perplexity를 다음과 같이 정의한다.

“*a measurement of how well a probability distribution or probability model predicts a sample.*"

본질적으로 Perplexity는 불확실성의 척도라고 이해할 수 있다. LM의 ppl은 뒤 따라오는 symbol을 predict할때의 level of ppl이라고 할 수 있다. 예를들어, Entropy of three bits인 LM이 있다고 해보자. (각 비트는 2가지 경우의 수가 있다. 0아니면 1) Entropy가 3비트라는 것은 following(다음에 따라오는) symbol을 예측할 때, 8가지 가능한 옵션 중에 골라야 한다는 것을 의미한다. 즉 우리는 해당 LM이 perplexity of 8를 갖는다고 할 수 있다.

![Untitled 6](https://i.imgur.com/MYDN2rDm.png)
즉, Empirical distribution P와 우리의 LM이 학습하는 distribution인 Q의 ppl을 위와 같이 표현할 수 있다.

---

## Bits-per-character and bits-per-word

Bits-per-character(BPC)는 상대적으로 최근에 나온 LM의 metric이다. 이름 그대로를 의미한다. 즉, character를 encode하기 위해 필요한 평균 비트 수를 의미한다. 앞서 언급한 Shannon’s의 entropy of language의 설명을 한번 다시 생각해보자.

“*if the language is translated into binary digits (0 or 1) in the most efficient way, the entropy is the average number of binary digits required per letter of the original language.*"

즉, 정의에 따르면 entropy는 BPC의 average이다. 일부 LM들이 cross entropy와 BPC를 모두 고려하는 경우는 단순히 기술적인 문제 때문이다.

> Question) 이해가 안되는 것이, BPC가 그러면 평균을 적용하지 않은 number of binary digit for encoding character라는 뜻인가. 평균이라 함은 사용된 character를 n개라 했을때, len(binary digit)의 합을 n으로 나눈 값일 것이다. BPC도 이것과 동일한 값을 의미 하는게 아닌가?
>

위의 궁금증을 해결하기 위해 BPC에 대한 좀더 구체적인 정의를 찾아보았다. [[Link]](https://stackoverflow.com/questions/17797922/how-to-calculate-bits-per-character-of-a-string-bpc)

Bits per characters는 compression method의 performance에 대한 지표이다. String을 압축하고, 몇개의 bits로 compressed representation가 표현 되는지 개수를 세어, original string에 있는 전체 symbol(characters) 개수로 나눈 값이다. Compressed version이 사용하는 bits per characters가 적을 수록, compression method가 더 effective한 것이다.

BPC를 어떻게 계산하는지도 찾아 보았다. [[Link]](https://stats.stackexchange.com/questions/211858/how-to-compute-bits-per-character-bpc/261789#261789)

![Untitled 7](https://i.imgur.com/QKvj4YYl.png)
링크에서의 설명과 같이, 위의 식을 보면 bpc는 cross entropy의 평균이다. 위의 식에서 $\hat P_t$는 approximate distribution, $P_t$는 true distribution, n은 각 vector size, $x_t$는 string의 t 위치에 있는 각 character를 의미한다. 그래서 만약에 모델의 string에 대한 bpc를 측정한다면, bpc(string)의 평균을 의미할 것이다.

> Answer) 해당 궁금증에 대해 찾아 보았지만, 지금 말할 수 있는 것은 다음과 같다.  Entropy는 Language에서의 average number of binary digit이었다. 그리고 BPC는 해당 주어진 text에 대한 bits per character이다. 그래서 entropy가 average of BPC라고 한게 아닐까 싶다. (아님말고..)
>

> 추가로, entropy와 cross entropy는 bit를 단위로 사용하므로 log base 2를 이용하여 정의하지만, TensorFlow, Pytorch에서는 자연로그를 이용하여 구현되어 있다. 이것의 이유는 log base 2보다 자연로그가 더 빠르기 때문이다. 자연로그로 구현되어 있어도, fixed scale $ln2$로 나눠주면 log base 2로 바꿀 수 있어서 문제가 되지는 않는다.
>

Word-level LM에 대해서 말할때, bit-per-word(BPW)이라고 하고, 한개의 word를 encode하기 위해 필요한 average bits의 개수를 의미한다.

---

## Reasoning about entropy as a metric.

Perplexity를 cross entropy로, 그 반대로도 바꿀 수 있기 때문에, cross entropy를 metric으로 사용하는 LM에 대해서 고려해볼 것이다. 즉, 글 초반부에서 언급한 lower bound of perplexity에 대한 것은 lower bound of cross entropy로 고려할 수 있다. Cross Entropy의 하한을 모르는 상황에서 우리가 얻은 결과가 좋은지 알 수 없다. 예를들어, 우리가 만약 cross entropy값이 7인 LM을 갖고 있다고 하면, best possible result가 무엇인지 알기전에 7이라는 결과가 좋은지 알 수 없다.

## Mathematical bounds

먼저, Entropy와 Cross Entropy의 수식에 대해 고려해보아야 한다.

1. 어떠한 분포에 대해서도 가장 작은 entropy값은 0이다. 하지만 language의 entropy는 symbol의 개수가 한개가 아닌 이상 0일 수 없다.

    ![Untitled 8](https://i.imgur.com/X51QV6lm.png)
    만약 language가 동일한 확률을 갖는 2개의 character가 있을때 entropy의 값은 1이다.

    ![Untitled 9](https://i.imgur.com/RdHnuicm.png)
2. Entropy의 확률 분포는 uniform할 때, 최대가 된다. 같은 set of symbol을 갖는 language에 대해서, 모든 symbol이 모두 같은 확률을 같는 langauge가 maximal entropy를 갖는다.
    $\mid V \mid$ : 확률 분포 P를 갖는 임의의 언어의 vocabulary size라고 하자.
  ![Untitled 10](https://i.imgur.com/23rhvZol.png)
    27개(공백을 추가한)의 symbol을 갖는 영어의 character-level entropy는 다음과 같다.

    ![Untitled 11](https://i.imgur.com/CFqLrPqm.png)
    평균적인 20살인 미국인은 42,000개의 단어를 알고 있다고 하면, word-level entropy는 다음과 같다.

    ![Untitled 12](https://i.imgur.com/wnuj2Gem.png)
3. 아래의 증명을 통해 LM의 cross entropy는 최소한 LM이 학습한 text의 empirical entropy일 것이라는 것을 알 수 있다.

    ![Untitled 13](https://i.imgur.com/3R1njocl.png)
    Underlying Language가 empirical entropy of 7을 갖는다면, cross entropy는 최소한 7의 값을 갖을 것이다.

4. Shannon의 정의에 따르면, entropy는 $F_N$에서 N이 무한대로 가까워질 때의 값이다. (위에서 언급함.) N이 증가하면 $F_N$이 감소할것이다. 왜 감소하는 지 설명하면 다음과 같다. previous sequence가 더 길 수록, 다음 symbol을 예측할 때 모델은 덜 confuse하게 된다.

    $F_{N+1}\le F_N(N\ge1)$임을 증명 함으로써, 위의 주장을 확인 할 것이다. 각 character $w_i$는 vocab에서 m letters $(x_1,x_2,...,x_m)$로 이루어져 있다고 하자. $F_N$은 N개의 글자를 갖는 인접한 text로 확장 되는 통계로 부터의 정보의 양/ Entropy를 의미한다.

    ![Untitled 14](https://i.imgur.com/vrRt1c6l.png)
    - equation about p

      ![Untitled 15](https://i.imgur.com/NWQs1Ejm.png)
        위의 식이 성립하여, 세번째 줄에서 $\ge$가 성립한다.


    그러므로 다음이 성립한다.

    ![Untitled 16](https://i.imgur.com/y3v8Pxpm.png)
    이를 통해 무한한 양의 text가 있을때, 더 긴 context length를 사용하는 LM이 더 짧은 context length를 사용하는 LM보다 더 작은 cross entropy의 값을 갖는다.


## Estimated bounds

1948년 entropy라는 개념이 나왔을 때, written English에 대한 entropy를 예측하는 것은 언어학자, 정보이론가, 컴퓨터 과학자들에게 인기 있는 주제였다. Entropy에 대해 예측하는 방법은 크게 2가지가 있다.

1. Human prediction
2. Compression

## Human Predctions

이 방법은 해당 언어에 대해 많은 양의 statistical knowledge를 갖고있는 사람이라면 preceding text에 대해 다음 symbol을 추측 가능하게 해준다.

Correct result까지 도달하는 여러개의 추측에 대해, Shannon은 upper/lower bound entopry estimate를 도출 했다. Dumas Malone’s Jefferson the Virginian라는 책에서 각 sample마다 100개의 글자를 갖는 100개의 샘플을 골랐다. Symbol 개수가 26, 27인 경우 모두를 고려하였다.

![Untitled 17](https://i.imgur.com/WjiNWxCl.png)
또 다른 연구는 Cover과 King이 prediction을 gambling problem으로 본 연구이다. 그들은 피실험자가 “다음 symbol의 조건부 확률에 비례하여 현재 자본의 percentage를 베팅하도록”했다. 만약 피 실험자가 다음 symbol의 실제 확률 분포에 따라 각 베팅에 대한 그의 자본을 나눈다면, English Language의 true entropy는 걸고 난후의 자본으로 추론할 수 있다. 27개 letter alphabet(공백 포함)을 사용하는 75개의 글자를 갖는 sequences와 220개의 글자를 갖는 sequences를 사용하였다.

![Untitled 18](https://i.imgur.com/JkrVbgpl.png)
## Compression

Langue Modeling이라는 맥락 밖에서, BPC는 compression에 대한 lower bound를 설정하였다. 만약 BPC가 1.2인 text는 character당 1.2비트 이하로 압축될 수 없다. 예를들어, 1000개의 characters로 이루어진 text가 있다면 최소 1200bits가 필요하다.

우리가 optimal compression algorithm을 갖고 있다면, 가능한 모든 English text를 압축함 으로써, written English language의 entropy를 계산할 수 있고, compressed data의 bits를 개수를 측정할 수 있을 것이다.

![Untitled 19](https://i.imgur.com/zsByruDl.png)
## Comparing perplexities across language models

지금까지 character-level에 대해서만 entropy를 다뤘다. 하지만 word-level, subword-level LM에 대해서도 entropy를 비교할 수 있을까? 또는 다른 symbol type을 갖는 LM들의 entropy도 비교할 수 있을까? 또는 character-level entropy를 word-level entropy로 전환할 수 있을까?

Generating Sequences with Recurrent Neural Networks이라는 논문을 쓴 Graves는 해당 논문에서 다음과 같은 주장을 하였다. 평균적으로 단어들은 encode되기 위해 m개의 비트가 필요하고, 한개의 단어는  l개의 character를 갖는다고 하였다. 즉 각 character를 encode하기 위해서는 $m\over l$개의 비트가 필요하다.  데이터셋에 있는 평균적인 단어는 5.6개의 characters를 갖고 있고, word-level perplexity는 $2^{5.6*BPC}$로 계산된다.

Shannon도 유사한 추론과정을 사용하였다. “the frequency of any word is inversely proportional to its rank in the frequency table” 이라는 Zipf’s law를 참고하여, Shannon은 영어에서의 단어의 빈도를 근사하고, word-level $F_1$을 11.82라는 값으로 추측했다. 평균 단어의 길이가 4.5라고 추정하면, character-level $F_4, F_5$ 사이의  값인 $11.82\over 4.5$= 2.62를 적용할 수 있다. 하지만 2.62는 사실 character level $F_5,F_6$ 사이의 값이다. 이에 대해 Shannon은 다음과 같이 주장한다. “단어는 internal statistical 영향력이 강한 응집력 있는 문자 집단이며, 결과적으로 N-grams는 단어를 연결하는 것보다 제한된다.”

$N\ge 2$인 $F_N$에 대해서, space가 이제 multi-word phrases의 일부분 이므로 word boundary problem은 더이상 존재하지 않는다. 그러므로 sequence length가 2 이상 이라면, 그 값을 평균 단어 길이로 나누어서 word-level entropy를 character-level entropy로 변환하는 것이 자연스럽다.

Subword-level로 고려하면 space boundary problem으로 봐야하기 때문에  이것은 더 복잡해진다.  

---

## Future of Language modeling and Language modeling evaluations.

LM이 다른 NLP task로 transfer learning의 목적으로 점점 더 많이 사용되고 있기 때문에, LM에 대한 본질적인 평가는 downstream task의 성능보다 덜 중요하다. Downstream task에서 모델을 평가하기 위해 생성된 benchmark는 GLUE, SuperGLUE등이 있다.

“XLNet: Generalized Autoregressive Pretraining for Language Understanding"에서 저자들은 LM의 성능이 향상된다고 해서 항상 downstream task의 성능 개선으로 이뤄지는 것은 아니라고 주장하기도 했다. XLNet 논문에서는 “ 모델이 데이터에 대해 under fit하여, 훈련을 계속하는 것이 downstream task에서 성능에 도움이 되지 않는 다는 것을 관찰하였고, 이는 optimization algorithm을 고려했을때 모델이 data scale을 충분히 활용할 수 있는 enough capacity를 갖고 있지 않다는 것을 의미한다 라고 주장한다. “

하지만 Perplexity는 아직 유용한 indicator이다. RoBERT는 Masked LM objective를 위한 더 좋은 perplexity는 sentiment analysis, multi-genre natural language inference에서의 더 좋은 end-task accuracy를 보인다고 보여주었다.

![Untitled 20](https://i.imgur.com/FOallc7l.png)
LM의 성능을 평가할 수 있는 대안적인 방법이 있지만, Perplexity는 사라질 것 같지는 않다. Perplexity는 LM 뿐만 아니라 기계 번역, 음성 인식, 오픈 도메인 대화와 같은 Cross Entropy Loss를 사용하는 모든 generation task에 사용할 수 있는 간단하고 다용도적이며 강력한 metric이다.

---

## GLUE

GLUE : General Language Understanding Evaluation (GLUE) benchmark의 줄임말이며 [[LINK]](https://arxiv.org/pdf/1804.07461.pdf) paper의 내용이다. GLUE는 총 9개의 task로 구성되었으며 각 task는 언어의 특정한 성질을 평가하기 위한 목적으로 만들어졌고, 최종 점수는 각 task 별 점수의 평균 값을 가져간다. task는 크게 3가지 - Single-Sentence Tasks (CoLA, SST-2), Similarity and Paraphrase Tasks (MRPC, QQP, STS-B), Inference Tasks (MNLI, RTE, QNLI, WNLI) 로 구분할 수 있다. (다음 링크에서 가져온 내용이다. : [link](https://inmoonlight.github.io/2019/12/22/GLUE-benchmark/))
