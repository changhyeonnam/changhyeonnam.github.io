---
title: stride와 slice를 한 식에 함께 사용하지 마라
Created: November 4, 2021 2:30 PM
tags:
    - Python
use_math: true
comments: true
sitemap :
  changefreq : daily
  priority : 1.0
---
### [Effective Python] Better way 12: stride와 slice를 한 식에 함께 사용하지 마라

- 한 슬라이스안에서 시작, 끝, 증가값을 함께 사용하지 말라, 세 파라미터를 모두 써야 하는 경우, 두번 대입을 사용하거나 itertools 내장모듈의 islice를 사용하라.

---

- 파이썬은 리스트[시작:끝:증가값]으로 일정한 간격을 두고 슬라이싱을 할 수 있는 특별한 구문을 제공한다. 이를 스트라이드(stride)라고 한다. 스트라이드를 사용하면 시퀀스를 슬라이싱하면서 매 n번째 원소만 가져올 수 있다.

    ```python
    x=['빨강','주황','노랑','초록','파랑','자주']
    odds = x[::2]
    evens =x[1::2]
    print(odds)
    print(evens)
    # ['빨강', '노랑', '파랑']
    # ['주황', '초록', '자주']
    ```

- 파이썬에서 바이트 문자열을 역으로 뒤집는 가장 일반적인 기법은 -1을 증가값으로 사용해 문자열을 슬라이싱 하는 방법이다. 유니코드 문자열 혹은 아스코 코드 문자열에는 정상적으로 stride가 잘 작동하지만 utf-8 인코딩을 한 문자열에 stride를 적용하면 오류가 생길수 있다.

    ```python
    w='가나다'
    x=w.encode('utf-8')
    y=x[::-1]
    z=y.decode('utf-8')
    # UnicodeDecodeError: 'utf-8' codec can't decode byte 0x98 in position 0:
    # invalid start byte
    ```

- 아래 코드와 같이 시작,끝점을 고려하여 stride를 적용한 리스트를 생각할 수 있지만 가독성이 좋지 못하다. 증가값에 따라 시작값과 끝값이 어떤 역할을 하는지도 불분명하다. 이런 문제를 방지하기 위해 시작값이나 끝값을 증가값과 함께 사용하지 말것을 권한다.

    ```python
    x=['a','b','c','d','e','f','g','h']
    x[2::2] # ['c', 'e', 'g']
    x[-2:2:-2] # ['g', 'e']
    x[2:2:-2] # []
    ```

- 하지만 스트라이딩과 슬라이딩을 분리하여 사용하면 두번의 얕은 복사가 일어나기 때문에 메모리를 더 많이 차지 한다. 이런 경우 메모리를 고려하기 위해 itertools 내장 모듈의 islice 메서드를 사용하는 것이 바람직하다. islice는 가독성이 더 좋고, 시작,끝, 증가값에 음수를 사용할 수 없습니다.

    `islice(iterable, stop)` 또는 `islice(iterable,start,stop[,step])`에 대한 공식 문서는 다음과 같습니다. [link](https://docs.python.org/ko/3.8/library/itertools.html#itertools.islice)

    ```python
    islice('ABCDEFG', 2) --> A B
    islice('ABCDEFG', 2, 4) --> C D
    islice('ABCDEFG', 2, None) --> C D E F G
    islice('ABCDEFG', 0, None, 2) --> A C E G
    ```

    islice는 iterator를 return하기 때문에 추가적인 메모리 사용이 없습니다. (slice는 새로운 리스트를 생성합니다.)
