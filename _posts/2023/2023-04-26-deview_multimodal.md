---
title: Review | 이제는 AI가 읽고(Language), 보고(Vision), 생성하는 Large-scale Multimodal의 시대입니다.
layout: post
Created: April 25, 2023 4:18 PM
tags:
    - Conference
    - Recommendation System
use_math: true
comments: true
sitemap :
  changefreq : daily
  priority : 1.0
---

> Naver Deview 2023에서 “이제는 AI가 읽고(Language), 보고(Vision), 생성하는 Large-scale Multimodal의 시대입니다”이라는 주제의 발표에 대해 정리한 내용이다. 이전에 네이버의 옴니서치와 유사하게, CLIP 모델에 Prompt learning을 적용해서 검색 알고리즘으로 [졸업프로젝트](https://github.com/changhyeonnam/FindYourShoes_with_CLIP)를 진행한 경험이 있었다. 해당 발표에서 다뤘던 프로세스와 우리 팀이 했던 프로세스가 겹치는게 있어서 재밌게 보았다. [[Link]](https://tv.naver.com/v/33860378)
>

---

![Untitled 0](https://i.imgur.com/yHQ55Tb.png)

MDS : 멀티 모달 문서 검색 서비스

![Untitled 1](https://i.imgur.com/Ma6z55v.png)

![Untitled 2](https://i.imgur.com/pTsr9PC.png)

![Untitled 3](https://i.imgur.com/DoTaXMN.png)

최근 Openai에서 모델 사이즈와 데이터 크기가 커지면 커질수록 성능이 좋다는 것에 대한 Scaling law것으로 증명한 바가 있다. 아래 표를 보면, 학습 corpus도 Billion scale을 넘어서 Thrillion scale로 보여주고 있다.

![Untitled 4](https://i.imgur.com/CvrhgKW.png)

LLM이후로 Vision Language model에서도 동일하게 Transformer 구조로 확장이 가능함을 보여주고 있다. CLIP(150M size, 400M image-text pair)로 Vision Language Foundation model로서의 가능성을 보여주었고, 구글에서는 ALIGN, MS에서는 Florence와 같은 VLM 모델을 내었다.

이러한 Encoder 구조 뿐만 아니라, Image2text 생성을 위한 Decoder 구조 모델 또한 나왔다. (e.g, SimVLM, Flamingo). Encoder-Decoder 기능 모두 할 수 있는 모델들도 나왔다.  

아래 그림을 보면, 모델의 크기가 커짐에 따라 imagenet zeroshot 분류 성능이 계속해서 올라가는 것을 볼 수 있었다.

![Untitled 5](https://i.imgur.com/c69k0NA.jpg)

DALL-E와 같은 Text2Image 생성모델도 있었고, 모델사이즈와 학습 데이터 사이즈가 계속해서 커지고 있다.

위 그림은 Parti 논문에서 공개한 모델 크기에 따른 텍스트 이미지 생성 퀄리티를 보여주는 그림이다. 생성모델들은 글자를 생성하는 것에 굉장히 약한 편인데, 20B가 되어서야 완벽하게 만들어졌다.

![Untitled 6](https://i.imgur.com/Q1nFIzt.png)

![Untitled 7](https://i.imgur.com/4oqJmta.png)

![Untitled 8](https://i.imgur.com/K5w5Xpg.png)

![Untitled 9](https://i.imgur.com/rmOsyH7.jpg)

학습에 노이즈가 될 수 있는 이미지들은 필터링 하는 과정을 많이 거쳤다.

![Untitled 10](https://i.imgur.com/VWFgQc8.png)

![Untitled 11](https://i.imgur.com/GoXmlEG.png)

이미지와 텍스트에서 각각 필터링할 뿐만아니라 최종적으로 이미지가 이렇게 텍스트와 얼라인된 경우에 실제로 연관성이 있는지 여부를 네이버 내부의 KELIP으로 확인하는 과정을 거침.

이미지 텍스트간의 유사도 점수를 계산하는데 얼마를 기준으로 정해야하는지는 모호한 부분이 있어서, 작은 데이터셋에서 제로샷 성능을 뽑아보며 몇점을 잡아야 하는지, 어떤 텍스트를 사용하는게 모델에게 더 좋은지 이런 것들을 정성적으로 비교했다.

오른쪽 그림은 Image-text score에 따른 데이터의 분포이고, 오른쪽 그래프는 이미지 텍스트 스코어에 따른 Imagenet에서의 성능 경향성을 분석해본 결과이다. 데이터의 양과 성능을 고려해서 최적점을 찾았다.

![Untitled 12](https://i.imgur.com/RybMD1H.png)

이러한 필터링과 전처리과정을 모두 사용해서 이미지 텍스트 쿼리 정보를 수집하는 파이프라인에 대한 내용이다.

1. 이미지 중복처리 및 이미지 기반 필터링
2. 텍스트 기반 필터링
3. image_hash/문서/클릭 정보로 JOIN
4. GPU가 많이드는 연산 한꺼번에 실행. (Watermark, OCR, Image-text score)
5. 이미지와 텍스트 표의 개수와 용량이 너무 크기 때문에 학습하기 좋게 webdataset format이라는 포맷으로 함께 묶어준다.
데이터 예시가 오른쪽 아래 Json file이다.

이 데이셋을 이용해서 Multimodal Foundation인 VLM을 만들게 된다.

![Untitled](https://i.imgur.com/DE6JiaV.png)

![Untitled 13](https://i.imgur.com/q8prbqr.jpg)

첫번째 멀티모달모델로 패션 상품의 속성을 검색할 수 있는 모델을 만들어 보았다. Imagenet 분류에서 좋은 성능을 보여주었지만, 오른쪽 그림을 보면 세부적인 domain들에 대해서는 각각의 성능차이가 심했다.

![Untitled 14](https://i.imgur.com/vSmdFTP.jpg)

상품의 속성을 추출하는 모델을 만들기 위해, 클립과 비슷한 구조에서 Target text로서는 패션 데이터에서 구축되어 있던 Texanomy구조로 상품 속성을 가져왔고, 이미지 인코더에는 상품이미지를 PAthfy(??)해서 인풋으로 넣어주고, 그리고 속성정보를 좀더 잘 얼라인 시켜주기 위해서 상품의 타이틀이나 카테고리같은 정보를 추가로 넣었다. Text encoder, Image encoder 각각에 대해 pretrain된 모델들로 initialization해 주었더니 성능이 올라가는 것을 확인할 수 있었다.

![Untitled 15](https://i.imgur.com/icDzewA.png)

66M 정도의 데이터셋을 확보할 수 있었다. 인풋으로는 이미지와 categorical 정보를 사용하고, 아웃풋 검색으로는 속성 정보를 사용헀다.

어떤 이미지와 신발 이라는 카테고리 정보를 인풋으로 넣어주면, 속성 키와 거기에 해당하는 속성 값들을 문장화 해서 학습을 시켰다. 카테고리는 신발 말고도 대분류, 중분류, 소분류 등 다양한 단계로 있기 때문에 학습 시에는 랜덤하게 선택해서 variation을 주었다.

![Untitled 16](https://i.imgur.com/hQvcsjp.jpg)

이미지, 이미지+’신발’, 이미지+’치마’에 따라서 나오는 속성 추론 결과 이다.

![Untitled 17](https://i.imgur.com/EXeUfBp.png)

구글에서 발표한 CoCa 모델을 타겟으로 했다. Text captioning도 학습을 해서, image-to-text 생성에서도 좋은 성능을 보여주었다. 분류, image-text retrieval, captioning 등 다양한 테스크에서 SOTA모델의 성능을 갱신했다.

![Untitled 18](https://i.imgur.com/2q6m0hk.png)

이미지 인코더와 텍스트 인코더의 [CLS] token을 활용해서, 기존의 클립처럼 Contrastive Loss를 사용하고, 이미지 인코더의 결과에서 [CLS]를 제외한 hidden state들에 대해 Attention pooling을 적용한 후에, multimodal text decoder와 Cross Attention을 시켜서 이미지 정보를 Decoder에 녹여주게 된다. 그리고 이제 언어 모델에서 사용한 NSP task를 활용해서 Captioning Loss를 만들고, 최종적으로 두개의 Loss에 대해 Weighted summation을 한다. Base 383M부터 Large는 787M, 최종 적으로으로 2.1B까지 scale up한 것을 보여주었다.

![Untitled 19](https://i.imgur.com/4vwQoBl.png)

문제는 영어 데이터 셋과 다르게, 소스별로 텍스트 스타일이 달랐다. (문제 제목 스타일, 쿼리 스타일, 캡션 스타일, etc)

![Untitled 20](https://i.imgur.com/pq3LftQ.png)

그래서 Coca모델이 데이터 소스별로 프롬프트를 구분해서 학습할 수 있도록 유도 하였다. Special token [PROMPT], [QUERY], [SHOPPING]을 붙여서 학습을 시켰다.

![Untitled 21](https://i.imgur.com/jCeaXT2.png)

Prompt CoCa의 선응은 이미지넷을 한글로 번역한 제로샷 평가에서 성능을 확인할 수 있었다.

![Untitled 22](https://i.imgur.com/sifoxfj.jpg)

이미지에서 텍스트를 생성하려면, 디코더 부분을 분리하여 따로 파인튜닝을 추가로 해줘야 한다.

![Untitled 23](https://i.imgur.com/iNSYbBr.png)

그 다음으로는 더 확장하여 Modality-agnostic Model을 만들어 보고자 하였다.

> modality-agnostic model이라는 것을 처음 들어보았다. Model에 관계없이 적용 가능한 방법론 이라는 의미라고 한다. AAAI 2023에서 발표하신 논문을 읽어봐야 제대로 알것 같다. [[Link]](https://arxiv.org/abs/2211.11153)
>

하나의 모델 타워로 이미지, 텍스트 모두에 대해서 좋은 Representation을 학습시키는 것이었다. 이미지와 텍스트를 Weighted Share를 해서 동시에 처리할 수 있는 One Tower encoder Model을 만들었다. 왼쪽 그림은 기존의 Clip과 같은 two tower model 구조이고, 가운데 그림은 two tower model에 Fusion layer를 하나 얹은 2 leg model, 그 오른쪽 그림은 One Tower에서 2 head 모델을 각각 이지와 텍스트에 따로 따로 헤드를 가지는 모델이고, 마지막 그림은 네이버에서 제안한 One Tower One head 모델이다.

![Untitled 24](https://i.imgur.com/V7We2aO.jpg)

첫 시작은 메타에서 제안했던 Moco v3의 Contrastive Self-Supervised Learning Framework에서 아이디어를 발전 시켰다. 예를들어 하나의 이미지에 대해 View 1, View 2와 같이 Augmentation을 하고, 하나의 인코더 모델을 Student model인 Query Encoder와 Teacher model인 Momentum Encoder로 나누어서 Contrastive Learning을 시키게 하는 framework였다.

여기에 Input으로 View1, View2를 Naive하게 이미지와 텍스트로 사용하게 된다면 Modality gap을 극복하지 못하고 학습에 실패하게 된다.

> Modality gap이 발생하는 이유가 처음에 이해가 안됬다. View 1, View 2 대신하여 Image와 Text를 넣었을 때 Modality gap이 발생하여 학습이 안되고, Constrastive Learning을 적용해도 정보의 성격이 다르기 때문에 학습이 안된다고 이해했다.
>

![Untitled 25](https://i.imgur.com/2gETfSW.jpg)

이 Modality gap을 해결하기 위해, Vision분야에서 널리 사용되는 Mixup을 적용해 보았다.

이미지와 텍스트를 각각 인코더에 통과시킨 후에, 그 임베딩의 평균을 낸 값에 대해서 Contrastive Learning을 적용해보았다. 이렇게 적용하니 학습이 비교적 잘되었다.

Vision에서의 Mixup은 Decision Boundary를 smoothing하기 위한 목적이었다면, XMC에서는 이미지와 텍스트에 대해서 어떤 common ground로 Projection 시켜주는 것을 확인할 수 있었다.

초반 학습 Epoch에서 파란색을 나타내는 것은 Image embedding이고, 주황색 점들은 text embedding을 나타내고, 초록색 점들은 Image와 text embedding의 평균값을 의미한다.

처음에 이것들이 모두 떨어져 있었다면, 최종적으로 학습이 완료된 40Epcoh에서의 결과를 본다면 이미지와 텍스트끼리 잘 Align된것이 서로 가까이에 표현되는 것을 확인했다.

![Untitled 26](https://i.imgur.com/I4pvzru.png)

XMC Loss에 추가로 Contextual Invariance Loss를 추가로 설계 하였다. Transformer 정보처리 과정에서 이미지와 텍스트를 서로 동일한 방식으로 활용할 수 있게 만들었다.

예를들어서 Text를 Transformer의 key, value로 했을때 Image query representation과 Image를 트포의 key, value로 했을 떄의 representation을 근사하게 만들 수가 있다면, modality agnostic한 reasoning에 가까워 질 수 있다고 판단을 하였다.

따라서 앞서 XMC objective에 추가로 Text에 대한 image representation과 Image에 대한 text representation의 평균, 즉 modality agnostic한 값과 Image-text에대한 representation 평균에 대해서 Contrastive Learning Loss를 만들었다.

> XMC objective = modality agnostic한 값
Image-text에대한 representation을 겹랍하여 최종 Contrastive Learning Loss를 만들었다는 의미.
>

![Untitled 27](https://i.imgur.com/5UXEu4B.jpg)

최종적으로 앞에 CIC objective를 보존한되, 좀 더 단순하고 일반화 된 형태의 CMC 로스로 최종 제안을 했다.

전체적인 구조를 보면, 이미지와 텍스트에 대해서 각각 Masked Image Modeling과 Masked Language Modeling을 처리하고, 각 모델의 [CLS] token으로 Image-text contrastive Learning을 하게 된다.  그 다음 Image, text 각각에 대한 representation에 평균을 취해 CMC Loss의 오른쪽 Term을 만들게 된다. 마지막으로 Image와 Text를 같이 인풋으로 Concat해서 모델에 태워 Masked Multi-Modaling을 수행하게 된다.

오른쪽 표에서 각 Loss term에 따른 성능을 확인할 수 있다. ITC = image,text를 나이브하게 넣었을 때의 성능.

![Untitled 28](https://i.imgur.com/Sb9MU6c.jpg)

![Untitled 29](https://i.imgur.com/Ssk6xB6.png)

![Untitled 30](https://i.imgur.com/KaHLART.jpg)

기본적으로 Stable Diffusion model을 사용했다. 생성 모델에 Conditioning을 어떻게 주느냐에 따라서 text2image, image2image, image inpainting/outpainting 등 다양한 이미지 생성이나 편집이 가능하게 되었다.

![Untitled 31](https://i.imgur.com/WC2sXlp.jpg)

하지만 Stable Diffusion model도 영어 위주의 텍스트로 학습이 되었기 때문에, 한글 prompt를 사용하면 전혀 엉뚱한 이미지들이 생성되는 한계점들이 있었다. Condition을 주는 Text encoder가 CLIP모델의 text encoder인데, 이게 영어로 학습되었다. “강아진 사진”이라는 것에 대해 이상한 결과를 볼 수 있다.

![Untitled 32](https://i.imgur.com/oYayj0a.png)

기존의 영어 Text Encoder를 Knowledge distillation을 활용해서 기존 영어 Latent space에 한글 embedding을 붙일수 있도록 유도했다. 기존의 영어 text encoder는 Teacher model로 freezing을 시키고, 영어 embedding을 만든 다음, 새로 만든 Multilingual text encoder에 영어와 한글을 모두 태워서 만든 embedding에 대해서 각각에 대해 mse loss를 계산하고, summation을 해서 모델에 흘려줘서 학습 시키면 결국에 한영 모두 같은 latent space상에서 표현이 가능해지게 된다.

![Untitled 33](https://i.imgur.com/P6FKMeL.jpg)

tsne로 시각화 해보면, 학습전에는 한영 사이의 명확한 gap이 존재하고, 학습 후에는 동일한 데이터에 대해서 기존의 영어 임베딩에 붙어서 한국어 embedding이 같은 Latent space에 표현되는 것을 확인할 수 있다.

![Untitled 34](https://i.imgur.com/zpct2uo.png)

Text2image 구조에  위에서 만든 Multilingual text encoder로 바꿔 끼우면 심플하게 적용이 가능하다.

![Untitled 35](https://i.imgur.com/gNPRDEA.jpg)

서비스 적용하기 위해선 inference time이 중요하다. Stable diffusion은 느리다는 단점이 있다. 20 step(1sec)으로도 퀄리티 있는 이미지를 생성해 냈다.

![Untitled 36](https://i.imgur.com/9ZYVttO.jpg)

패션 관련 이미지 생성에서도 잘 생성되는 것을 확인할 수 있었다.

![Untitled 37](https://i.imgur.com/Q8n1aNN.png)
Foundation model을 기반으로 Multimodal document search 서비스인 MDS를 적용한 사례에 대해 설명해보겠다.

![Untitled 38](https://i.imgur.com/CzMIEx1.jpg)

유저의 이미지 쿼리가 들어오면, 이미지 텍스트 feature를 추출하고, UGC feature들과 같이 분석하고 랭킹을 통해 해당 이미지와 관련된 UGC 문서를 쭉 보여준다.

![Untitled 39](https://i.imgur.com/PtnddlO.png)

![Untitled 40](https://i.imgur.com/mMdPpPL.png)

문서의 썸네일이 어떤 것이냐에 따라서 사용자의 클릭률이 달라질 만큼 중요한 부분이다. 유저의 텍스트 쿼리와 관련도 순으로 랭킹을 시킨 다음에, 좀더 썸네일로써 좋은 이미지를 선택하는 기술이다.

> 어떻게 고르지?? 그냥 텍스트만으로 판별 가능한건가. 운동화 코디가 들어올땐 가운데사진, 운동화 리뷰는 세번째 사진..!!!  아 다음 슬라이드~
>

![Untitled 41](https://i.imgur.com/Y6kY5Cz.jpg)

![Untitled 42](https://i.imgur.com/BIqvEf3.png)

ASIS는 기존의 서비스로 나가고 있는 썸네일들이다.  60개에 대해서 49개, 44개가 썸네일로 나가도 된다고 판단. Large model에서 썸네일로의 적절성 점수가 가장 높다.

![Untitled 43](https://i.imgur.com/EGc9eoj.jpg)

Object detector로 신발부분 crop해오고, 이미지 Feature 뽑는 것에는 내부적으로 다양한 네이버 VLM 모델 사용했다. 각 모델별로 추출되는 특징이 달라서 여러 모델들을 사용했고, 1차적으로 여러 후보군을 뽑는게 성능에서 좋았다. 각 모델별로 검색 db풀에 미리 구축해 놓은 이미지 벡터들과 ANN을 계산해서 Top k개의 1차 상품군을 모으게 된다.

마지막으로 VLM 기바능로 한번더 이미지 텍스트 기반으로 Re-Ranking을 하면서 좀더 정확한 최종 상품 랭킹을 하게 된다. 파운데이션 모델이 새로 나오더라도 유연하고 효율적으로 바꿀 수 있는 파이프라인을 만들었다.

> ANN : Approximate Nearest Neighbor
>

![Untitled 44](https://i.imgur.com/iMFNIFV.png)

신발에는 시리즈 명이 있지만 의류 같은 경우 특정되는 상품명이 없다는 것이 문제이다.

> 그래서 우리가 졸업프로젝트 할때, 신발로 상품군을 축소한 이유도 있다. 의류는 이름은 물론 브랜드도 분류하기 어려웠다.
>

그래서 의류에서는 패턴이나 컬러같은 요소들을 같이 추출하여, 특징인점을 뽑아야 했고, 문서 검색용으로 같이 태깅을 시켰다.

![Untitled 45](https://i.imgur.com/0bY56uF.png)

VLM 모델들은 제로샷으로도 좋은 성능을 보여주기 때문에 대상 색상이나 어떤 대상 패턴들을 잘 설계해 놓으면 이미지와 텍스트 사이의 Cosine Similarity 계산을 통해 이미지와 관련도가 가장 높은 패턴 그리고 색상 같은 경우를 뽑아 낼 수 있다.

![Untitled 46](https://i.imgur.com/STWNq4l.jpg)

![Untitled 47](https://i.imgur.com/wy2FT4C.png)

![Untitled 48](https://i.imgur.com/5GkqYI3.jpg)

![Untitled](https://i.imgur.com/Yz7SS8d.png)
