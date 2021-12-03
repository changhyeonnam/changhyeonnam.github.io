---
title: Network | Delivery and Forwarding of IP Packets
layout: post
Created: December 4, 2021 4:17 AM
tags:
    - Network
use_math: true
comments: true
---

> 인하대학교 컴퓨터공학과 권구인 교수님 네트워크 수업을 바탕으로 정리한  내용입니다.
>

### Delivery

- 네트워크 구축할때, 경로 설정할때도 ip주소가 필요하다. 라우터들이 패킷을 받았을때 목적지 주소를 보고 어느 경로로 갈지 라우팅 테이블을 보게 되는데, 라우팅 테이블이 어떻게 생겼는지 대략적으로 보는게 6장의 내용이다.

- network layer에서는 physical networks에 의해 Packet이 handling되는 것을 감독한다. 이 handling을 delivery of packet이라고 정의한다. direct 과 indirect delivery라는 두가지 다른 방법을 통해 최종 목적지까지 delivery of packet을 완수한다.

### Direct Delivery

![Untitled](/images/2021/network/ch06/u0.png)


- 최종 목적지로 가는 패킷의 ip 헤더에 받는쪽 ip, 보내는쪽 Ip가 들어있다. (tcp 헤더를 보면 받는쪽, 보낸쪽 포트번호가 들어가 있는 것과 동일하게 ip 헤더에도 있다.) 이때 받는쪽 Ip, 보내는쪽 Ip가 같은 네트워크에 있으면 직접전달이고, 두가지 케이스가 있다.
    1. 일반적인 컴퓨터 a→b 도 직접 전달이다.
    2. 다른 네트워크에서 와서 라우터에서 b로 보낼때. 패킷에 있는 destination =b인 경우도 직접전달이다.
- 스위치(네모 박스)에서 최종 목적지가 B인걸 알고있으면 B로 바로 보내고, 모른다면 c,d,e,a(스위치에 연결되어 있는 다른 컴퓨터) 모두 보내본다. 테이블을 관리해서 해당 맥주소가 어떤 인터페이스 있는지 관리를하여 필터를 한다.(2장에서 배움)

### Indirect delivery

![Untitled](/images/2021/network/ch06/u1.png)

- 간접전달은 상식적인 것이다. A→B로 보내려고 할때, 라우터를 통해 다른 네트워크를 통과하여 B로 가야하고, 이것이 indirect delivery이다.
- source → router : indirect delivery, router → router : indirect delivery. router → 최종 목적지 : direct delivery이다.

### Forwarding

- forwarding은 라우팅 테이블을 보고 next hop으로 가기위해 interface에 패킷을 갔다 놓는것을 의미한다. forwarding을 하기 위해선 라우팅 테이블을 봐야한다!
- 최종목적지가 주어졌을때, forwarding을 통해 어떻게 경로설정을 하는지 살펴보자.

### Next-hop method

![Untitled](/images/2021/network/ch06/u2.png)

- 라우팅 테이블을 어떻게 만들 수 있는지 여러 경우를 보여준다. 라우터 r1,r2를 거쳐서 B까지 간다.
- a가 목적지 b를 보면 어떻게 가야하는지 보이고, 경로들에 대한 정보를 주고 받아서 full path가 어딘지 알아야만 최단 경로를 구하고 거기서 next만 적게되어있다. 라우터들은 full path에 대해 어디로 가야하는지 정보를 모두 갖고있다.
- 미국으로 가는데 경로가 20개 이상이다. full path를 알고있는 상태에서 next를 적어놓은것이다.
- 사실은 next hop만 제대로 알고있으면 문제가 없다. full path를 알고있는 상태에서 next만 적어놓은것이다. 서로 약속된 상태에서 next만 갖고있는것이다. 그래서 지금 쓰고 있는 인터넷은 next hop만을 갖고있다. (구지 다 적을 필요가 없어서!)

### Network-specific method

![Untitled](/images/2021/network/ch06/u3.png)

- IPv4 address를 계산하는 것에서 왜 네트워크 주소가 필요한지 배웠다. 해당 네트워크에 도달하기 위해 네트워크 주소만 (=시작주소) 알면 도달할 수 있다.
- 예를들어 클래스 a주소라고 하면 1600만개의 주소가 있다. 만약에 R1이 16000만개의 주소를 관리하려면 routing table 안에 class A에 대해 16000만 길이가 있어야한다. 근데 class a만 있는 것이 아니라 b,c,d도 있다.
- S는 누구한테 보내야 하는지만 알면된다. N2는 공통된 네트워크주소이다. 16000만개 필요없다. 네트워크 주소만 저장하면 된다.

### Host-specific routing

![Untitled](/images/2021/network/ch06/u4.png)

- 테이블 안에 무조건 네트워크 주소만 갖고있지는 않다. 네트워크 에 어떤 specific한 경로는 구체적으로 적어 놓는 경우도 있다. 그럴때는 table에 host주소가 들어간다. host specific routing이라고한다.   왜 사용되는지 뒤에서 살펴본다.

### Default routing

![Untitled](/images/2021/network/ch06/u5.png)

사실 각 네트워크는 주변의 네트워크 정보만을 갖고있다. Network N1은 2가지 방향이다.  N2 혹은 해당되는게 아니라면 default router로 보낸다.

### Simplified forwarding module in classful address without subnetting

![Untitled](/images/2021/network/ch06/u6.png)

- classful 주소에 대한 forwarding module를 살펴보자.
- 패킷이 오면 패킷에 목적지 주소가 있다. 그 주소에서 네트워크 주소를 끄집어내야 한다. 네트워크 주소 알기 위해서 클래스 별로 mask가 다르다. 그래서 클래스 먼저 찾아놓은 다음에, 클래스별로 mask를 적용해서 주소 찾는다.클래스별로 라우팅 테이블 따로 관리한다. 네트워크 주소 끄집어내면, 해당 클래스의 라우팅 테이블로 가서 찾아보면된다.
- ARP는 맥주소를 알아오는 프로토콜이다. hop to hop을 보내기 위해선 맥주소를 알아야한다.  맥주소를 가져와야하는데, next hop을 알아온 다음에 ARP를 통해 맥주소를 가져오면 frame으로 만들어 보내는 단계만 남게된다.

![Untitled](/images/2021/network/ch06/u7.png)

- R1 : R1은 direct하게 연결된 네트워크가 세개가 있다.  default 네트워크는 R2를 통해서 간다.
- R1의 라우팅 테이블이 어떻게 구성되어있는지 보자. class B,B,A에 해당하는 table이 있다. 각 class에 맞는 네트워크 주소를 끄집어 낸다.

    ![Untitled](/images/2021/network/ch06/u8.png)

- r1이 어떻게 연결되어있는지 보자. class A인 111.0.0.0과 direct로 연결되어있으므로, next hop이없다. class b로 2개의 네트워크 또한 direct로 연결되어있으므로, next hop이없다.
- class C에 해당하는 192.16.7.0은 indirect 연결 되어 있으므로, next-hop 주소가 라우터 R3 주소이다.
- default router로 보내게 되면 ARP 프로토콜을 통해 hop-to-hop을 한다.

Simplified forwarding module in classful address with subnetting

![Untitled](/images/2021/network/ch06/u9.png)

- subnet이 있는 경우를 보자. 네트워크내에서 서브넷 몇개이고, mask를 얼마써야 하는지 setting해야한다.
- 목적지 주소 보고, 서브넷 주소 찾아서, 테이블에서 탐색하면 된다.

![Untitled](/images/2021/network/ch06/u10.png)

- 네개의 서브넷 각각의 네트워크 주소들이 라우터 테이블에 적힌다. 라우터는 최소한 네트워크가 어떻게 구성되었는지 알아야한다.
- 원래 이 네트워크 mask가 16이다. 네개의 서브넷이므로, 18비트를 주어진 주소와 and연산을 하여 서브넷 네트워크 주소 끄집어냄.  mask를 사용하여 서브넷 주소를 알아내서 해당 테이블에서 찾아낸다.

### Simplified forwarding module in classless address

![Untitled](/images/2021/network/ch06/u11.png)

- classful addressing에서의 routing table은 최소한 세개의 열로 이뤄진다. (subnet address, next-hop address, interface number, ..) classless에서는 최소한 4개의 열로 이뤄진다. (mask, destination address, next-hop address, interface number, ...)

![Untitled](/images/2021/network/ch06/u12.png)

- mask,네트워크주소 따라서 어느 네트워크에 갈지 안다.

![Untitled](/images/2021/network/ch06/u13.png)

- 네개의 네트워크와 direct하게 연결되있고, next  hop이 없다.
- 사용자가 보낸 패킷 안에있는 ip주소는 classless에서도 바뀌는게 없다.

    ![Untitled](/images/2021/network/ch06/u14.png)


    TCP header의 기본 20바이트 구성이 어떻게 되어있는지 보았다. source/destination port번호가 있다. ip header에는 source/destination ip 주소가 있다.

- 네트워크 디자인에서 라우터들만 테이블에서 classless 주소 찾아볼 때 일을 하는것이고, 일반 개인 사용자는 서버 ip주소만 알고, 그 네트워크가 어떻게 구성되어있는지 알 필요가 없다. 라우터들이 저것을 관리하는 것이다.

### Topology

- 주어진 라우팅 테이블에서 네트워크가 어떻게 구성되어있는지 그릴 수 있어야 한다. 그려보는 것을 Topology라한다.
- direct하게 연결되어 있는 것부터 그려야한다.
- 그 다음 table을 보고, network address로 가기 위해선 next-hop address에 적힌 주소로 보내면 되고, next-hop address는 어떤 interface number라고 적혀있는것을 참고하여 그리면된다.

### Address aggregation

![Untitled](/images/2021/network/ch06/u15.png)

- R2입장에서는 R1에 연결되어있는 각 network주소를 모두 알 필요가 없다. mask를 24로 설정하여 R1라우터 까지 도달할 수 있따. 이렇게 줄일 수 있는 것이 address aggregation이다. organization들은 subnet이어야 하는것은 아니다.
- 전제조건이 있다. 방향이 모두 같고, 공통된 주소가 있어야한다.
- 예외도 있다.

    ![Untitled](/images/2021/network/ch06/u16.png)

    위 경우가 방향이 다른 경우이다. 하지만 이 경우 또한 aggregation할 수 있다. m1으로 가는 경우부터 확인해보고, 아니라면 aggregation하면 된다.

    이런 것을 longest mask matching이라 한다. 가장 긴 mask부터 table에 적으면 된다.


### Multiprotocol label switching (MPLS)

![Untitled](/images/2021/network/ch06/u17.png)

- mlps protocol label switching을 하기 위해선 추가적으로 헤더를 바꾼다. 이더넷 헤더 뒤에 ip 헤더가 왔었는데 중간에 헤더를 추가한다. mpls가 가능한 라우터 끼리는 mpls forwarding을 하고, 아닌 경우는 이것을 사용하지 못한다. mpls에서는 forwarding을 high speed로 할 수 있다. 일정 크기, 고정된크기의 label을 사용한다.

### MPLS forwarding tables

![Untitled](/images/2021/network/ch06/u18.png)

- R1~R4는 mpls가 가능한 라우터이다. R6,R5는 ip 주소보고 하는 일반 라우터들이다. mpls 가능한 둘 사이에 패킷들이 왔다갔다 할 때는 패킷의 포맷을 수정하여 전달한다. mpls를 벗어나면 mpls 헤더를 띠고 보낸다.
- 택배에 인천광역시 미추홀구 인하로100 인하대 하이테크1109라고 명시되어 있다고 하자. 택배하는 사람이 하이테크 센터만 택배를 한다고 하면, 1109만 볼것이다. 동일한 예시로 아파트 택배도 동호수만 적어서 나른다. 저 동호수는 유일하다. 이것이 label 방식.
- 네트워크 패킷들도 전달될 때를 보자. R1이 A와 direct하게 연결되어 있다는 정보를 가지고 출발을 한다. 나갈때는 mpls 헤더를 띄고 A에게 보내준다. 그 대신 주변 노드에게 A로 가는 패킷들은  6번으로 해서 받는다고 말해준다. 모든 노드끼리 싱크 맞추긴 어렵기때문에 저 6번은 R1과 R2,R3사이에서만 유일하면 된다.
- R3는 표를 보자. R4에게 A를 보낼게 있으면 10번으로 보내달라고 말한다. 그리고 D에대한 정보도 추가된다. R4에게 D를 보낼 패킷들은 레이블 12를 해서 보내달라고 알린다.
- R4에 왼쪽 연결된것들은 mpls 불가능함. R4,R2도 유사한 방식으로 테이블을 만든다.
- 라우팅 테이블을 모두 그린것은 아니다. R4를 보면 A로 가능길이 2가지 존재한다. 한가지가 깨지면 다른 길을 고르면된다.
- 필드를 나가면 라우팅 테이블이 레이블로 되어있다고 했을때, mpls를 모르면 안된다.
- MPLS는 레이블링해서 포워딩을 한다!.
