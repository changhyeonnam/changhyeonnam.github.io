---
title: Network | IPv4 Addresses
layout: post
Created: November 30, 2021 10:33 PM
tags:
    - Network
use_math: true
comments: true
sitemap :
  changefreq : daily
  priority : 1.0
---

> 인하대학교 컴퓨터공학과 권구인 교수님 네트워크 수업을 바탕으로 정리한  내용입니다.
>

### IPv4 Address (IP version 4)

- 예외가 존재하기는 하지만, 내 컴퓨터에 할당된 IP주소는 전세계에 딱 하나 밖이 존재하지 않는다. 예외는 대표적인 것이 사설망을 사용할때 192.168로 시작하는 IP주소이다. 공유기를 사용하게 되면 대부분 192.168로 시작한다. 또는 loop back 주소.

- IPv4 adress : 32비트 주소로, host to internet, router to internet로의 연결을 uniquley, universally하게 정의하는 주소이다.

- $2^{32}$크기이고, 4,294,967,296 크기를 갖는다. 보통 binary로 많이 표현한다. byte단위로 끊어서 128.11.3.31로 표현하지만 IP주소는 숫자 하나라고 보면된다.

---

### Classsful Addressing, Classless Addressing

IP adddress가 처음 사용한 몇십년동안 class 개념을 사용했다. 이러한 아키텍처를 classful addressing이라 한다. 1990년 중반에는 classless addressing 이라는 새로운 아키텍쳐가 나왔고, 이전 classful adressing을 대체했다.

### Occupation of address space

![Untitled](/images/2021/network/ch05/u0.png)

A,B,C 위주로 설명할것이다. D는 multicasting용이고, E는 나중을 위해 reserved 해놓은 class이다.

### Finding the class of address

- class A: 31bit, 맨 앞자리 0 고정이므로, Netid range는 0-127이다.
- class B: 30bit, 맨 앞자리 10 고정이므로, Netid range는 128-191이다.
- calss C : 29bit, 맨 앞자리 110 고정이므로, Netid range는 192-223이다.
- 추가로 1000 000 = 128, 1100 0000 = 192, 1110 0000 = 224, 1111 0000 = 240 을 의미하는 것을 알면 주소 계산하기 편리하다.

### Netid and Hostid

![Untitled](/images/2021/network/ch05/u1.png)

모든 ip 주소는 2개의 level로 관리된다. 앞부분 network id, 뒷부분을 host id라 한다.

- Class A는 network id로 1byte,  나머지 3byte를 host id로 사용한다. 네트워크 id가 0~127로, 128개의 block이 생긴다. 0.0.0.0 ~ 127.255.255.255.255가 class A의 범위이다. 각 block은 $2^{24}$개, 1600만개의 주소를 갖는다. 그래서 수백만개 정도의 class A 주소가 낭비된다.

- Class B는 network id로 2byte, 나머지 2byte를 host id로 사용한다. 128.0.0.0 ~ 191.255.255.255.255 가 class B의 네트워크 id 범위이다. 전체 block의 개수는 16000개 정도 있고, 각 block은 65000개의 주소가 있다. 다 못쓰는 경우 낭비된다.

- class C는 network idr는 3byte, 나머지 1byte를 host id로 사용한다. 192.0.0.0 ~ 223.255.255.255.255가 class C에 해당한다. 전체 block의 개수는 2백만개 정도 되고, 하나의 block에는 256개 정도의 주소가 있다.

- 뒤에서 말하겠지만, 시작주소와 마지막주소는 일반 라우터에게 할당하지 않는다. 시작주소는 해당 network를 대표하는 network address이고, 마지막 주소는 broadcast용이다.

### Two-level addressing in classful addressing

![Untitled](/images/2021/network/ch05/u2.png)

classful 주소는 앞서 말한것과 같이 2단계로 끊어서 읽어야 한다.

### Information extraction in classful addressing

![Untitled](/images/2021/network/ch05/u3.png)

어떤주소 하나가 주어지면 일단 class를 찾아서 netid,hostid를 읽어야한다. $2^{32-n}$ 만큼이 해당 block안에 있는 주소의 개수이다.

### Samle Internet

![Untitled](/images/2021/network/ch05/u4.png)

각 라우터는 두개의 네트워크에 속하게 된다. 그에 따라서 각 라우터는 두개의 주소를 할당받는다.  

![Untitled](/images/2021/network/ch05/u5.png)

chapter2의 slide중 하나이다. 각 라우터는 두개의 ip주소와 mac주소를 갖는다.

### Network address

network address는 network의 identifier이고, 시작주소이다.

![Untitled](/images/2021/network/ch05/u6.png)

routing table에는 목적지주소, network주소, nexthop, interface 정보가 있다. (더 많은 내용이 있긴하다.) 특정 네트워크에 있는 모든 주소를 라우팅 테이블에 적기엔 너무 많기 때문에, 대표주소인 network주소만을 적는다.

Routing process에 관해 살펴보자. destination address가 주어졌다고 해보자. 그러면 주어진 주소에서 (대표) 네트워크 주소를 끄집어 낸다. 그 네트워크 가서 destination address로 간다.

### Network mask

![Untitled](/images/2021/network/ch05/u7.png)

주어진 주소에서 네트워크 주소를 끄집어 내기위해서 masking을 사용한다. Class에가 무엇인지에 따라서 마스크를 가져와서 AND 연산을 하면된다.

- Mask for class A: 255.0.0.0.0
- Mask for class B: 255.255.0.0
- Mask for class C: 255.255.255.0

### Subnetwork

이제 subnet이라는 개념이 나온다. 주소를 2단계가 아니라 3단계로 끊어서 읽어야한다. class B에 해당하는 네트워크가 있다고 하자. 65000개를 하나의 네트워크로 구성하지 않는다. class B처럼 큰 네트워크를 하나의 네트워크로 구성하면 보안에도 취약하고, 성능도 좋지 못하다. 그래서 subnetwork으로 나누게 된다.  

![Untitled](/images/2021/network/ch05/u8.png)

internte router는 subnetwork 주소를 몰라도 된다. 전체 네트워크 주소 141.14.0.0/16의 정보만 들어가 있다. Site router는 각 subnetwork 주소에 대한 정보가 들어가 있다. Site router는 목적지 주소가 어느 subnetwork에 들어있는지 판단할 수 있어야 한다. 18비트까지 봐야 어느 subnet에 포함되는지 알 수 있다. 이때 mask를 사용한다. 18비트까지 봐야하므로 255.255.192.0과 AND하여 subnet 주소를 구할 수 있다.

class에 따른 netid에 해당하는 비트개수 + log(만들고자 하는 서브넷 개수)가 총 봐야하는 비트수이다. 위의 예시에서는 class B이므로, 16비트에 4개의 서브넷을 만들고자 하므로 18비트를 봐야한다.

site router의 routing table에는 subnetwork로 이뤄진 destination 주소, nexthop, port번호가 들어있다. 주어진 주소가 포함되어 있는 subnet을 찾기 위해서는 subnet mask와 AND연산하여 구한다.

### Comparison of subnet, default, and  supernet mask

class A,B,C의 개수의 gap이 너무 크다. 그래서 supernet이라는 것이 제안되었다. 잘 안 쓰이는 방법이다. 같은 class끼리 묶어주는것이다. 그런데 주의할 것은 만약에 8개의 네트워크를 묶어준다고 하자. 000으로 끝나는 것부터 8개를 골라야 111까지 8개를 살수있는데, 001로 끝나는것부터 사면 안 맞는다.  

### Classless Addressing

classful addressing에서 subnetting과 supernetting은 address deletion 문제점을 해결하지 못했다. 인터넷의 성장과 함께, larger address space가 필요해졌다. IPv6라는 더 넓은 범위의 solution은 이미 고안되었지만, 같은 주소 공간을 사용하지만, 각 oragnization에 공평한 분포를 제공하는 address distribution을 바꾸는 방법이 고안되었다. 그 방법이 Classless addressing이다.

### Variable-length blocks  in classless addressing

- classless 또한 두 단계로 끊어 읽는다. classful에서 byte단위로 끊어 읽었고, classless에서는 bit단위로 끊어읽는다.

- classless addressing에서는 prefix가 network를 define하고 suffix가 host를 define한다. (netid, hostid와 개념과 동일하다.)

- classless addressing에서는 prefix 길이는 0부터 32까지이다. prefix 길이가 커지면, suffix가 작아지고, 이는 block의 크기가 작아지는 것을 의미한다.

- 기존에는 class가 있어서 끊어 있는 방법이 정해져 있었다. classless에서는 slash('/')를 사용해서 prefix length를 써줘야 한다.

- classless addressing에서는  block에서의 주소와 그 block를 define하는 prefix length를 알아야한다.

- classful에서는 주소 하나만 알면, block의 사이즈, 시작주소, 마지막 주소도 알수 있었다. classless에서는 prefix 길이를 알아야 위의 정보들을 끄집어 낼 수 있다.

- suffix에 해당하는 비트가 모두 0인 주소가 시작주소이고, 모두 1인 주소가 마지막 주소이다. 시작주소는 항상 suffix가 모두 0이어야 한다. supernet에서 언급했다시피, 0이 아니라면 prefix로 정한 비트가 맞지 않는다.

- classless의 subnet도 classful에서의 subnet과 유사하다. subnet개수에 해당하는 비트까지 prefix length로 정해주면 된다.

- classless에서 서로 개수가 다른 subnet을 구성할때, prefix가 모두 공통되야 하는것을 주의해야한다.

- classless에서 subnet을 구성하는 예시를 보자.  190.100.0.0/16에 대해  (1) First Group: 64X256 addresses (64개의 subnet에 각각 256개의 주소가 있다.) (2) Second Group: 128X128 addresses (128개의 subnet에 각각 128개의 주소가 있다.) (3) Thrid Group: 128X64 addresses.

    ```c
    190.100.0.0/16
    (1)First Group: 2^14이므로, group의 prefix는 14bit필요.
    190.100.0.0/24 - 190.100.0.255/24
    ~ 190.100.63.0/24 ~ 190.100.63.255/24
    (2)Second Group: 2^14.
    190.100.64.0/25 - 190.64.127/25,
    190.100.64.128/25 - 190.100.64.255/25,
    ~ 190.100.127.128/25 - 190.100.127.255/25
    (3)Third Group: 2^13
    190.100.128.0/26 - 190.100.128.63/26
    ~ 190.100.159.192/26 ~ 190.100.159.255/26
    ```

    32 - 전체 해당하는 비트 수가 블록의 prefix이다. 이제 블록이 차지하는 bit수만큼 할당한후에, 각 블록의 주소개수를 고려하면 된다. 예를들어 첫번째 그룹을 보자. 32-14 =18비트를 일단 prefix로 정한다. 그다음, 블록이 차지하는것은 6(=64)bit이고, 그리고 하나의 블록안에 차지하는 주소의 개수는 8bit(=256)이다. 첫번째 group의 첫번째 block의 범위는 다음과 같다.

    ```c
    190.100.00|000000.00000000 ~ 190.100.00|000000.11111111.
    ```


### Special  Addresses

Classful Addressing에서는 특별한 목적으로 사용하는 몇개의 address를 reserved했다. Classless Addressing에서는 classful addressing의 이것을 inherit한다.

### Loopback  address

![Untitled](/images/2021/network/ch05/u9.png)

127로 시작하는 주소가 loopback 주소이다. 하나의 컴퓨터안에서 서버와 클라이언트를 실행하고 싶을때 사용하는 주소이다. (이전 실습에서 계속사용했듯이) 서버에서 소켓 프로그램을 돌릴때,  클라이언트를 같은 컴퓨터에서 실행하여 진짜로 데이터를  서로 먼저  주고 받는지 가장 먼저 test해야한다.   

### All-zero address

![Untitled](/images/2021/network/ch05/u10.png)

all-zero address는 dhcp에서 사용한다. dchp서버에서는 보통 고정 ip는 사용하지 않고, 유동 ip를 사용한다. 유동 ip를 사용하기 위해서는 누군가가 할당해줘야 하는데, 할당하는 프로토콜이 DHCP이다.

자신의 주소를 모르는 컴퓨터가 DHCP 서버에게 DHCP request를 보내면 ip주소를 할당해준다. → 공유기가 이 역할을 한다. dhcp request를 보낼때, ip header에 자기 주소를 모르므로 source ip에 0.0.0.0으로 보낸다. DHCP서버의 실제 ip또한 모르므로, destination ip에 255.255.255.255를 보낸다.

### Limited broadcast address

![Untitled](/images/2021/network/ch05/u11.png)

dhcp  서버로 dhcp request를 통해 유동 ip를 할당받기 위해, 255.255.255.255를 destination ip 주소에 쓴다. 모든 비트가 1로되어 있는 주소를  limited broadcast address라고 한다. limited broadcast address로 패킷을 보내서 스위치에 도착하면, 연결된 모든 디바이스로 전송된다. 각 디바이스는 dhcp request임을 확인하고  무시한다. 즉, 불특정 all에게  모두 보낼때 모든 비트가 1인 주소를 사용한다.

왜 limited인지 설명하겠다. 저 라우터의 역할때문에 limited이다. 저 라우터가 0.0.0.0/255.255.255.255 패킷을 block하지 않으면, 전 세계에 있는 네트워크로 보낸다. 그래서 limited이다. 다른  프로토콜에서도  같은 네트워크에 있는 모든 device에게 패킷을  모두 보낼때 사용한다.

### Directed broadcast  address

![Untitled](/images/2021/network/ch05/u12.png)

suffix에 해당하는  비트가 모두 1일경우,  directed broad cast이다. 라우터에서 해당 네트워크의 모든 device로 보낼 데이터가 있을 경우, 저 주소로 보낸다.

앞서 classful,classless에서 subnet의 주소를 구할때, suffix가 모두  0인 주소를 해당 (sub)net을 대표하는 네트워크 주소이고, suffix가 모두 1인 주소를 directed  broadcast 주소이다.

### NAT

사설망이라는 것은 어떤것을 의미하는지 살펴보자. 큰회사 같은 경우 네트워크를 만들수 있다. 인터넷이랑 연결안시키고 내부망으로 사용할것이다. tcp,ip 프로토콜, 주소를 내맘대로 써도 된다. 그런데 나중에 인터넷과 연결해야하는 경우가 생김. 내 맘대로 사용한 주소이므로 밖으로 나가지 못하고, 특별한 장치가 필요하다. 그래서 사설망을 만들때 사용한 주소를 따로  저장해놓았다. 사설망 주소를 사용하는 주소가 192로 시작하는 주소이다.  보통 공유기에서 사용한다. 사설망을 쓸때,  필요한것이 있다. NAT (Network Adddress Tranlsation)이다.

![Untitled](/images/2021/network/ch05/u13.png)

- 10.0.0.x는 사설망에서 할당받은 주소들이다. 저 라우터가 밖에서 사용할  public ip는 138.76.29.7이다.

- 사설망의 컴퓨터가 외부의 특정 서버로 접속하고 싶은 경우이다.

- 10.0.0.1의 사설망 ip에서 라우터 바깥으로 나가기 위해서는, 10.0.0.1을 source ip로 사용할 수 없다. 라우터에서 바꿔줘야 한다. 그리고 이 사설망에서 특정 ip로 가는 트래픽이 여러개일 경우,  특수하게 관리해줘야 하므로,  NAT tranlsation table에서 포트번호를 관리해야한다.

- 10.0.0.1에서 보낸 패킷을 위해 5001번이라는 포트번호를 할당해준다. 응답패킷이 올때, 라우터의 NAT tranlsation table를 보고, 5001번에 해당하는 컴퓨터의 사설망 ip가 무엇인지 찾아본다. 여기 까지는 network layer까지만 고려한 내용이다.

- 이렇게 해주는 것이 공유기의 역할이다. 공유기는 dhcp서버로부터 주소를 할당해준다.

- 공유기에서 8001번 포트에 해당하는 사설망의 computer ip주소는 #ip:192.108.0.1/#port:3456으로 바꿔라 라고 설정해주는 것을 port  forwarding이라 한다. NAT장비가 이  역할을 해준다.

- NAT은 port fowarding을 자동으로 해준다고 이해하면 된다.

### Rendezvous sever (랑데뷰 서버)

제 3의 서버(랑데뷰 서버)를 놓고, 사설망 주소들을 여기에 저장해둔다.  그래서  어떤 컴퓨터가 사설망 서버를 이용하기 위해 랑데뷰 서버로 접속하여 해당 서버 주소를 찾아본다. 이러한 기술을 hole punching이라 한다. ip 전화 또한 전화 받을때 랑데뷰 서버를 이용하는것이다. 전화 걸때는 공유기를 통해 나가므로 랑데뷰 서버를 사용하지 않는다.

### P2P

서버 소켓을 만들때 listen 함수를 통해 서버소켓으로 만든다. 클라이언트에서 서버소켓에 연결한다. 누군가는 서버,클라이언트 역할을 한다. 그런데 내가 서버,클라이언트 둘다 역할을 하면 p2p라한다.
