---
title: Network | Congestion Packets
layout: post
Created: November 29, 2021
tags:
    - Network
use_math: true
comments: true
---

> 인하대학교 컴퓨터공학과 권구인 교수님 네트워크 수업을 바탕으로 정리한 내용입니다. 혼잡제어를 이해해야, 파일을 다운받을떄나 인터넷 접속할때 속도가 왜 변하는지 이해할 수 있다. tcp fair 위주로 다룬 내용입니다. 
>

### Congestion Window size

![Untitled](/images/2021/network/ch15/u0.png)

RTT는 실제로는 1초 단위는 아니다. congestion window size(=cwnd)는 절대 0으로 안떨어지고, 최소 1부터 출발을 한다. 0초에 1로 세팅을 하고, 보내고 1초에 갔다온다. delay 무시한다.  timeout이 8초에 발생하고 15초에 3-duplicated ACK을 감지한다.

![Untitled](/images/2021/network/ch15/u1.png)

위의 그래프에서 cwnd를 어떤식으로 변화시키는지에 대해 메커니즘이다.

### Why is TCP fair

![Untitled](/images/2021/network/ch15/u2.png)

- 하나의 구간에 대해 R(=100mbps)에 대해 connection 1,2가 경쟁하여 가져간다고 해보자. 그래프에서 x,y축은 각각 connection1의 throughput, connection2의 throughput이다. x와 y가 쓰루풋이 같은 경우가 Equal bandwidth share를 의미하는 x=y가 된다. x+y = R 보다 쓰루풋의 합이 크면 바깥쪽, 작으면 안쪽이다.
- (45,10), 둘의 합이 55정도 되는 곳을 보자. AIMD(Additive increase & multiplicative decrease)만 고려해 보자. (slow start 무시) cwnd = cwnd+1/RTT. RTT마다 +1이다. 전재조건은 connection1과 2의 RTT가 같을 경우이다. 1,2가 같은 양만큼 증가하므로, 45도 기울기로 증가를 하다가 합이 R인 그래프를 넘어가면 혼잡이 생하여 3 duplicated ack을 받았다고 하자. throughput을 sending rate / receving rate 이라 가정해보자. congetstion이 발생하면 반으로 줄인다. 증가량은 다시 현재 window size에서 +1씩 증가하므로, 45도 기울로 증가하게 되어있다.
- 그래서 equal bandwidth 선상으로 가까워진다. tcp가 혼잡제어를 하면, 마지막엔 50대 50으로 가져간다. 관리자가 개입하지 않아도, connection 1이 처음에는 2보다 더 많이 가져가다가 수렴한다. 그래서 RTT가 같은경우 tcp가 fair하다라고 한다.

### RTT가 다를경우 TCP가 fair할까?

![Untitled](/images/2021/network/ch15/u3.png)

- $Throughput \propto {1\over{RTT\sqrt lossrate}}$를 따르기 때문에, throughput은 rtt에 반비례한다. window size(=cwnd)는 rtt마다 증가하므로 작은 rtt를 갖는 connection이 throughput이 더 좋다.
- connection1의 RTT는 connection2의 절반이므로, throughput의 비율은 위의 방식과 동일하게 결국 $y=1/2*x$으로 수렴한다. RTT가 다르면 TCP는 fair하지 않다.
- connection1이 flow를 2개를 만든다. client가 socket 두개를 만들고, 각 소켓에 포트 번호를 할당하여 구현한다. 라우터에는 connection이 세개(connection1의 flow 2개, connection2의 flow 1개)가 들어와 경쟁한다.

    라우터는 경로설정에 대한 일, next가 누군지 결정하는 것을 한다. flow가 세개가 들어오면, 세개에 대해 공평하게 취급을 한다. 전체 throughput을 flow 3개가 나눠 갖는다. 그래서 전체 100mbps라 하면, connection1이 66.6mbps, connection2는 33.3mbps를 가져간다. 즉 tcp는 fair하지만, rtt가 다르다면 fair하지 않고, flow가 많아지면 fair하지 않다.

    옜날에는 고속 다운로드와 일반다운로드가 있었는데, 고속을 누르면 flow가 여러개 생겼다.

- 만약에 connection flow 개수가 99:1 인 극단적인 상황을 보자. 99 mbps. 1mbps이 할당될까? 우리나라에서 미국까지 가는데 라우터를 20개정도 거치고, 혼잡은 여러군데서 발생한다. tcp는 혼잡이 어디서 발생하는 지 모르고, 보수적으로 어느 구간에 혼잡이 발생했으니 내가 보내는 양을 반으로 줄이자. 혼잡을 detect한 애들이 다 같이 줄인다. 즉 라우터 입장에서 보내는 양이 확줄어서 빈공간이 많아져서 혼잡을 해결한다.
- connection의 flow가 많이 가서 많이 가져오면 더 많이 쓴다. 우리가 쓰는 인터넷은 중앙통제가 아니다. 실제 인터넷의 성능이 문제가 있는 이유 : (1) 서버의 문제 (2) 라우터의 고장. (3) 내 컴퓨터의 문제 및 브라우저의 문제. (4)tcp 때문이기도 하다.

---

### TCP VS UDP

- tcp와 udp가 경쟁한다. tcp는 서버 - 클라이언트 사이의 reliability(신뢰성)을 보장하기 위해 sequence number, ack#을 사용하여 Packet loss를 detect 한다. 그다음 flow control 하여 상대방의 application의 상태를 봐가면 상대방이 받을 수 있을 만큼만 보넀다. 또한 network 상황을 봐가면 congestion control을 했다.
- udp는 이 네개의 과정을 다 안한다. 셋업 과정이 없다. tcp는 전화이고, udp는 엽서로 비유를 한다. 전화를 하려면 상대방이 있어야 하고, 셋업과정을 필요로 한다. udp는 받는 사람 신경쓰지 않고 주소만 적어서 보낸다. 셋업 과정이 필요하지 않다. udp는 reliability 신경쓰지 않는다. 없어지면 없어진대로 application에 올려보낸다.
- tcp를 사용하는 application이라면 application에서 packet loss에 대해 고려하지 않아도 된다. tcp가 다 해결하여 올려 보내준다.
- udp는 packet loss 일어나면 신경쓰지 않지만, application에서 해결을 해야한다. udp는 flow control하지 않는다. ack이 없다. tcp는 ack을 통해서 받았는지 안받았는지 체크를 하여 rwnd로 처리한다. udp는 ack없고, packet을 그냥 보낸다. tcp는 congestion control하지만 udp는 congestion control하지 않는다. tcp에서는 write()을 사용하여 sending buffer에 가져다 놓는다. udp에서는 write() 대신 send to를 사용하여 오는대로 그냥 나간다. udp에서 1초에 100개씩 보내준다 하면 무조건 1초에 100개씩 보내는것이다.
- 네트워크 관리자 입장에서는 tcp는 착한 애들이다. 혼잡이 발생하여 네트워크가 포화가 되면 tcp가 알아서 조절한다. udp는 네트워크 상황 고려하지 않는 무대뽀이다. 혼잡이 발생해도 보내는양을 줄이지 않고 그냥 보낸다. 그래서, 네트워크 관리자들이 보수적으로 네트워크를 setup 한다고 하면, 30퍼센트 정도 udp, 70퍼센트는 tcp에 할당을 한다. udp는 udp끼리, tcp는 tcp끼리 한다. 회사나 학교애서 관리를 한다.

---

### P2P

- 파일이 조각 조각 나있다고 하자. 나와 peer간에 tcp로 다 연결되어 있다고 하자. 전체 네트워크는 정해져 있다. 네트워크 전체 속도가 1Gbps라하자. 어떤 connection이 flow를 비 정상적으로 많이 만들어서, 200,300 mbps를 가져간다고 하자. 정상적인 flow가 하나가 간다고 하자. 경쟁하는 구간은 정해져있고, 내가 flow를 많이 만들어서 사용하는 것은 남의 꺼 뺏어서 가져온것이다.
- flow를 엄청 만들어서 가져올 경우 문제가 생긴다. 집에서 쓰면 문제가 없을 수 있지만, 기숙사 같은 곳에서 사용하면 문제가생긴다.  p2p는 즉 flow를 비정상적으로 많이 만들어서 다운받는 방법이다. (불공평한 tcp 방법이다.)

---

### UDP가 TCP보다 빠르다?

- TCP의 혼잡제어를 이해하지 못했다면 위와 같이 생각할수도 있다.
- udp는 빠르다라고 검색하면 나온다. tcp는 RTT(Round Trip Time)만큼의 setup시간이 필요하다. 그리고 tcp는 혼잡제어로 전송하는 속도가 결정된다. udp는 constant bit rate으로 , 예를들어 일정하게 1mbps로 계속 보낸다. tcp는 혼잡제어에 따라서 늘었다가 줄었다 해서 100mps까지 증가할 수도 있다.
- packet 하나 보내는 것 같이 짧은 것은 udp가 셋업 과정 없으니 빠르지만, 좀 긴것은 tcp가 보낸다. 하지만 네트워크 상황이 0.5mbps라면 udp가 빠를수도 있다. 네트워크 상황에 따라 udp, tcp 중 빠른것이 다르다.
- udp는 constant bit rate이고, tcp의 rate는 변할 수 있다. 빠르다, 느리다는 판단할 수 없다.
