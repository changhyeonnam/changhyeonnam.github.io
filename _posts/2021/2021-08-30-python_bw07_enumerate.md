---
title: range 보다는 enumerate를 사용하라
Created: August 30, 2021 1:51 PM
tags:
    - Python
use_math: true
comments: true
---


### [Effective Python] Better way 07: range 보다는 enumerate를 사용하라

- enumerate를 사용하면 iterator에 대해 루프를 돌면서 iterator에서 가져오는 원소의 인덱스까지 얻는 코드를 간결하게 작성할 수 있다.
- range에 대해 루프를 돌면서 시퀀스의 원소를 인덱스로 가져오기보다는 enumerate를 사용하라.
- enumerate의 두번째 파라미터로 어디부터 원소를 가져오기 시작할지 지정할 수 있다.

> python의 enumerate는 c++ 에서 for (int i=0; i<container.size(); i++) 대신 for (auto i : container)을 사용하는 것과 같은 느낌 입니다.

---
먼저 python document에 나와 있는 enumerate의 구현을 보겠습니다.[link](https://docs.python.org/3.9/library/functions.html?highlight=enumerate#enumerate)

```python
def enumerate(sequence, start=0):
    n = start
    for elem in sequence:
        yield n, elem
        n += 1
```
iterable을 arguement로 받는데, iterable(반복 가능한 객체) sequence 자료 구조여야 합니다. enumerate 함수 내에서 loop를 돌며, next 내장 함수를 사용해 원소를 가져옵니다. (next 함수는 `__next()__`를 호출하고, `__next()__`은 container의 다음 item을 반환합니다.)
index와 iterator가 가리키는 값인 elem 으로 이뤄진 쌍을 yield하는 generator를 반환합니다. index는 enumerate의 두번째 인자인 start부터 시작합니다.

**enumerate는 enumerate object을 반환합니다**
enumerate 내부에 yield가 있어서 generator를 반환하는지 알았는데, [link](https://stackoverflow.com/questions/23663231/does-enumerate-produce-a-generator-object)
를 참고하여 보니 아니었습니다. 결론부터 말하자면, generator는 기본적을로 특정한 타입의 iterator이고, yield를 이용해 함수로부터 데이터를 반환해야 합니다. 하지만 enumerate는 사실 C로 구현 되어 있고, pure Python이 아니므로 yield 함수가 포함되어 있지 않습니다.
```Python
>>> import collections
>>> e = enumerate('abc')
>>> isinstance(e, enumerate)
True
>>> isinstance(e, collections.Iterable)
True
>>> isinstance(e, collections.Iterator)
True
>>> import types
>>> isinstance(e, types.GeneratorType)
False
```
위 예제를 통해서도 enumerate가 generator 객체가 아니라는 것을 확인할 수 있습니다.

---
range 내장함수는 iteration할 sequence( string, tuple, list) 및 데이터구조가 있을때, 이 시퀀스에 대해 바로 루프를 돌 수 있습니다.

```python
flavor_list = ['바닐라','초콜릿','피칸','딸기']
for flavor in flavor_list:
    print(f'{flavor}')
# 바닐라
# 초콜릿
# 피칸
# 딸기
```

리스트를 iteration하면서 리스트의 몇 번째 원소를 처리 중인지 알아야 할때는, range를 사용하면 다음과 같이 작성해야 합니다.

```python
for i in range(len(flavor_list)):
    flavor = flavor_list[i]
    print(f'{i+1}: {flavor}')
# 1: 바닐라
# 2: 초콜릿
# 3: 피칸
# 4: 딸기
```

위의 코드는 list 길이를 알아야하고, index를 사용해 원소에 접근해야 해서 가독성이 떨어집니다.

파이썬은 이런 문제를 해결할 수 있는 enumerate 내장함수를 제공합니다. enumerate는 iterator를 lazy generator로 구현합니다.

```python
it = enumerate(flavor_list)
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
