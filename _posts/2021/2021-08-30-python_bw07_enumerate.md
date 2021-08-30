---
title: range 보다는 enumerate를 사용하라
Created: August 30, 2021 1:51 PM
tags:
    - Python
use_math: true
comments: true
---


### [Effective Python] Better way 07: range 보다는 enumerate를 사용하라

> python document도 참고하였습니다.

- enumerate를 사용하면 iterator에 대해 루프를 돌면서 iterator에서 가져오는 원소의 인덱스까지 얻는 코드를 간결하게 작성할 수 있다.
- range에 대해 루프를 돌면서 시퀀스의 원소를 인덱스로 가져오기보다는 enumerate를 사용하라.
- enumerate의 두번째 파라미터로 어디부터 원소를 가져오기 시작할지 지정할 수 있다.

> python의 enumerate는 c++ 에서 for (int i=0; i<container.size(); i++) 대신 for (auto i : container)을 사용하는 것과 같은 느낌이다.

---

range 내장함수는 iteration할 sequence( string, tuple, list) 및 데이터구조가 있을때, 이 시퀀스에 대해 바로 루프를 돌 수 있다.

```python
flavor_list = ['바닐라','초콜릿','피칸','딸기']
for flavor in flavor_list:
    print(f'{flavor}')
# 바닐라
# 초콜릿
# 피칸
# 딸기
```

리스트를 iteration하면서 리스트의 몇 번째 원소를 처리 중인지 알아야 할때는, range를 사용하면 다음과 같이 작성해야 한다.

```python
for i in range(len(flavor_list)):
    flavor = flavor_list[i]
    print(f'{i+1}: {flavor}')
# 1: 바닐라
# 2: 초콜릿
# 3: 피칸
# 4: 딸기
```

위의 코드는 list 길이를 알아야하고, index를 사용해 원소에 접근해야 해서 가독성이 떨어진다.

파이썬은 이런 문제를 해결할 수 있는 enumerate 내장함수를 제공한다. enumerate는 iterator를 lazy generator로 감싸 구현합니다. (이후 chapter에서 설명)

```python
**def** enumerate(sequence, start=0):
    n = start
    **for** elem **in** sequence:
        **yield** n, elem
        n += 1
```

enumerate의 실제 구현이고, python 공식문서에 가보면 iterable을 arguement로 받는데, iterable은 sequence 자료 구조여야 합니다.

enumerate는 loop idex와 iterator의 다음 값으로 이뤄진 쌍을 넘겨준다.(yield) 다음 코드는 next 내장 함수를 사용해 다음 원소를 가져온다.  next 함수는 `__next()__`를 호출 하고, `__next()__`은 container의 다음 item을 반환합니다.

```python
it =enumerate(flavor_list)
print(next(it))
print(next(it))
# (0, '바닐라')
# (1, '초콜릿')
```

enumerate가 넘겨주는 각 쌍을 for문에서 간결하게 언패킹 할 수 있습니다.

```python
for i, flavor in enumerate(flavor_list):
    print(f'{i+1}: {flavor}')
# 1: 바닐라
# 2: 초콜릿
# 3: 피칸
# 4: 딸기
```

enumerate의 start 인자의 parameter로 1을 주면, 더 깔끔하게 만들 수 있습니다.

```python
for i, flavor in enumerate(flavor_list,1):
    print(f'{i}: {flavor}')
# 1: 바닐라
# 2: 초콜릿
# 3: 피칸
# 4: 딸기
```
