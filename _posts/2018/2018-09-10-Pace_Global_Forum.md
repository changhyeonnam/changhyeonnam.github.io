---
title: PACE Global Annual Forum GM Warren 2018 후기
layout: post
Created: Dec 8, 2020 9:08 PM
tags:
    - Competition
comments: true
use_math: true

---

PACE Global Annual Forum, GM Warren Tech Center, July 22-25, 2018 후기
2018년 에 team2에 합류하여 약  6개월 동안 프로젝트를 진행했고, 7월 25일 award ceremony을 기점으로 프로젝트를 마무리 했습니다.

![alsist](/images/2018/pace/alsist.png)
---

### PACE Global Annual Forum

Forum의 주제는 PUMA(Portable Urban Mobility Access)로서, 52세에서 71세 사이를 뜻하는 baby boomer들을 위한 이동 지원 장치를 설계하는 것이 었습니다.

2018년에는 2017년에 참여한 팀원들의 디자인을 토대로 실물 제작 및 엔지니어링, 디자인, market anlaysis를 포함한 마케팅과 생산에 대해 프로젝트를 진행하였습니다.

---

### Team2에서 개발한 ALSIST(Always Assist)

![PACE%20Global%20Annual%20Forum,%20GM%20Warren%20Tech%20Center%20,J%203163bb469c1b4004b4983bd54672b814/Untitled%201.png](/images/2018/pace/design.png)

Design by  국민대 디자인팀

Hub motor와 worm geared motor를 이용하여 Automatic folding 기능을 구현하였고, 보행자를 따라오는 tracking기능을 구현했습니다.

사실 인체공학적 설계와 시장 분석을 통한 디자인 설계를 포함한 수많은 엔지니어링 해석을 담고있는 Aslsist이지만, 너무 내용이 방대하고 제가 맡은 역할은 실제 구현에 초점이 맞춰져 있습니다. (모든 내용을 설명할 수 없는게 아쉽네요.)

---

### Team2에 들어간 동기와 내가 맡은 역할

대학교 2학년때 모터 PID제어에 대해 관심이 생겨 공부하고 있었던 차에 PACE 팀에서 모터 제어에 대해 팀원을 모집하는 이야기를 듣고 지원하여 팀에 합류하게 되었습니다.

제가 속한 인하대가 Team2의 리드 대학을 맡았고, 인하대는 실제 이동 지원 장치에 대한 구현과 엔지니어링에 대한 해석을 맡았습니다. 팀에서 제가 맡은 주된 역할은 허브 모터 제어 및 조향제어와 공장에서의 제조 과정에대한 커뮤니케이션 이었습니다.

---

### Hub motor 제어

**Hub motor**

hub motor가 일반적인 DC motor와 다른점은 모터의 구조에 있습니다. 원통구조의 영구 자석과 함께 안쪽에 코일이 감긴 모터로 이루어져있습니다. 우리가 사용한 hub motor에는 hall sensor라는것이 있었는데, 이 센서는 magnetic sensor로써 컨트롤러가 모터의 위치를 알게 하여 계속해서 돌수 있게 합니다.

**Hub motor 선택**

test track의 규정에 맞는 배터리와 모터를 사용해야 했기 때문에 tailg T7 hub motor(36V, 350W)를 사용하였습니다. 처음에는 안에 있는 허브모터만을 구입한다음, 원하는 바퀴 크기를 만들기 위해 wheel frame을 모두 조립하고 하였으나 배보다 배꼽이 꺼질 것같아서 기성품을 구입하였습니다.

**Motor 제어**

![PACE%20Global%20Annual%20Forum,%20GM%20Warren%20Tech%20Center%20,J%203163bb469c1b4004b4983bd54672b814/Untitled%202.png](/images/2018/pace/control.png)

단순히 main throttle를 이용해 두 바퀴를 제어하면 두 바퀴 사이의 속도차이가 생기기 때문에 PID(Proportional-Integral-Differential controller) 제어가 필요했습니다. 이를 위해 encoder와 digital potentionmeter(DAC)를 사용하였습니다.

input( main throttle의 값이자, 우리가 원하는 속도!)와 encoder에서 측정한 rpm의 차이를 error로 두고 PID제어를 하고, 이를 dual digital potentionmeter을 통해 motor driver로 전달했습니다.

Digital potentionmeter(DAC)는  mixed signal IC로써 아두이노와 같은 MCU를 통해  internal resistors(main throttle input)값을 dynamic하게 바꿀 수 있었습니다.

**Hub motor video**


![test](/assets/test.gif)
요렇게 프로토타입에 허브모터 고정시켜서 실험을 한 결과물이 다음과 같은 ALSIST가 되었습니다.
![race](/assets/race.gif)
test track에서의 Alsist

---

### 그외의 기능에 대한 구현

**Folding mechanism**

![folding](/assets/folding.gif)

worm geared motor를 이용하여 folding mechanism을 구현하였습니다.

### 공장에서의 제조 과정에대한 커뮤니케이션에서 배운것

각 파트에  대한 설계와 캐드를 받아 공장과 연락하여 일정과 견적에 맞춰 제조과정을 진행하였습니다.

처음에는  전체 장치에 대한 설계와 캐드를 완성하고 각 파트를 각 제조 공장에 맡기면 건담 로봇처럼 딱 완성되는지 알았습니다.  사실 그렇게 단순한게 아니었습니다.

입력한 수치 대로 모든 부품이 조립되는게 아니고, 모든 가공품에는 공차가 존재해야 했습니다. 게다가 수 많은 부품 간에 간섭이 없이 구현되어야 한다는 것을 몸소 배웠습니다. 그래서 간섭나는 부품은 모두 다시 제조 해야했습니다.

또한 조립에 대한 어려움을 생각하지 않고 설계를 하면 한 부품이 고장 나면 처음부터 다 분해해서 다시 조립해야 했습니다. 한국과 미국에서 folding에 사용하는 웜기어 모터의 커플러가 부셔져서 몇번이고 분해하고 조립하는 번거로움을  겪어야 했습니다.

---

### 미국에서의 episode

**Battery lab에서 제작에서의 고난과 과정**

디트로이트에 있는 GM Warren Tech Center에 있는 Battery lab에서 분해해서 가져온 Alsist의 부품을 재 조립하는 과정을 갖었습니다.

우리 팀이 직면한 문제는 운송수단의 배터리가 미국 시카고 공항의 통관에서 걸려서 대회 당일 날까지 배터리를 받을 수 없게 되었다는것이 었습니다. 배터리에 대한 BMS(Battery Management System)서류와 통관에 필요한 서류를 다 준비했음 에도 문제가 생겼습니다. 하루 하루가 부족한 시점에서 저희 팀은 빠르게 현실적인 해결방안을 고려했고, 디트로이트에 있는 모든 전기자전거 혹은 전기 배터리를 파는 업체를 모두 연락하고 방문하여 저희 스펙에 맞는 배터리를 구할 수 있었습니다.

**Presentation & Race judge**

<style>.embed-container { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; } .embed-container iframe, .embed-container object, .embed-container embed { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }</style><div class='embed-container'><iframe src='https://www.youtube.com/embed//Axa3c8FSyy4' frameborder='0' allowfullscreen></iframe></div>

Team2 Presentation

![PACE%20Global%20Annual%20Forum,%20GM%20Warren%20Tech%20Center%20,J%203163bb469c1b4004b4983bd54672b814/Untitled%203.png](/images/2018/pace/race.png)
test track

**Award Ceremony**

![PACE%20Global%20Annual%20Forum,%20GM%20Warren%20Tech%20Center%20,J%203163bb469c1b4004b4983bd54672b814/Untitled%204.png](/images/2018/pace/award.png)

babyboomer를 위해 제시된 컨셉 중 차체의 폴딩 시스템과 tracking 기능에 대한 개발을 인정받아 1st Place on Industrial Design을 받았고 track race (주행) 부문에서  2nd Place on Track Race를 받았습니다.

---

### 대회에서 배운것과 아쉬웠던 부분

실제 자동차의 생산과정과 유사한 마켓팅, 디자인, 엔지니어링 및 실제 구현까지의 프로세스를 몸소 겪을 수 있어서 정말 좋았습니다. 처음으로 개발을 포함한 여러가지 분야에서 수많은 사람과 협업을 할  수 있었고, 이를 통해 팀원간의 커뮤니케이션, 책임감의 중요성을 배울 수 있었습니다.

더 자세히 말하자면  배움에 대한 적극적인 자세가 팀원 들간의 협력에도 도움이 된다는 것을 프로젝트를 하며 몸소 느꼈습니다. 커뮤니케이션 을 잘하려면 제가 담당하지 않은 파트를 맡은 팀원의 말을 잘 이해해야 했었습니다. 프로젝트를 더 효율적으로 진행하기 위해서 제 파트 뿐만 아니라 다른 사람들의 파트에 대해서도 열심히 배워야 한다고 느꼈습니다.

아쉬웠던 것은 기술적인 면에서 더 깊은 내용을 이해하지 못하는데서 오는 구현의 미흡함과 비효율적인 시행착오의 과정이었습니다. 물론  이런 것들이 제가 성장하는 데 밑거름이 되고 더 나아갈 수 있게 해주는 것같다고 생각합니다.
