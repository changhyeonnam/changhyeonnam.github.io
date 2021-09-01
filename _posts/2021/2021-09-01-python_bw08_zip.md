---
title: 여러 iterator에 대해 나란히 루프를 수행하려면 zip을 사용해라
Created: September 1, 2021 1:06 PM
tags:
    - Python
use_math: true
comments: true
---
### [Effective Python] Better way 08: 여러 iterator에 대해 나란히 루프를 수행하려면 zip을 사용해라

- zip 내장 함수를 사용해 여러 iterator를 나란히 iteration할 수 있다.
- zip은 tuple을 lazy generator를 만든다. 따라서 무한히 긴 입력에도 zip을 쓸 수 있다.
- 입력 iterator의 길이가 서로 다르면 zip은 아무런 경고도 없이 가장 짧은 iterator길이 까지만 튜플을 내놓고, 더 긴 iterator의 나머지 원소는 무시한다.
- 가장 짧은 iterator에 맞춰 길이를 제한하지 않고 길이가 서로 다른 iterator에 대해 루프를 수행하려면 itertools 내장 모듈의 zip_longest 함수를 사용하라.

---

우선 python document에 나와 있는 zip의 구현을 보겠습니다. [link](https://docs.python.org/3.9/library/functions.html#zip)

```python
def zip(*iterables):
    # zip('ABCD', 'xy') --> Ax By
    sentinel = object()
    iterators = [iter(it) for it in iterables]
    while iterators:
        result = []
        for it in iterators:
            elem = next(it, sentinel)
            if elem is sentinel:
                return
            result.append(elem)
        yield tuple(result)
```

iterable(반복 가능한 객체)들을 인자로 받고, list comprehension을 이용해  iterators라는 리스트에 iterator들을 넣어 줍니다. sentinel은 아래 for문에서 next를 호출할때, iterator의 다음 원소가 없다면 (if iterator is exhausted) 반환하는 값을 위한 변수입니다.

iterators 리스트가 빈 리스트가 아니라면 while문에 들어가게 되고, result라는 리스트를 만듭니다. iterators 리스트의 원소에 대해 루프를 돌면서, next(it,sentinel)을 이용해 인자를 elem에 저장하고, 만약에 it의 다음 원소가 없다면 sentinel을 반환하여 함수를 종료(반환)합니다. 종료되지 않았다면, result 리스트에 원소를 추가해줍니다. zip 내장 함수는  tuple 형태로 원소로 yield하는 generator를 반환합니다.

예를들어 zip의 원소로 두개의 리스트가 들어간다고 해봅시다. iterators 리스트에는 각 리스트의 iterator가 들어가게 되고, while문 안의 for문은 len(iterators) =2번씩 루프가 돌아가게 됩니다. 2번씩 돌때 next를 통해 각 리스트의 원소를 result에 append 합니다. 매번 2개의 원소가 tuple의 형태로 yield됩니다. 그리고 두개의 리스트의 iterator중 next(it,sentinel)에서 하나라도 다음 원소를 반환하지 못하면 zip함수가 종료가 됩니다. 즉 짧은 길이의 리스트에 맞춰서 zip이 돌아가게 됩니다.

---

다음 예제는 zip을 설명하기 위한 예제 입니다.

```python
names = ['Cecilia','남궁민수','jimmy']
counts =[len(n) for n in names]
print(counts)
# [7, 4, 5]

longest_name = None
max_count = 0
for i,name in enumerate(names):
    count = counts[i]
    if count > max_count:
        longest_name=name
        max_count = count
# Cecilia
```

위와 같이 enumerate를 이용하여 unpacking을 통해 구현할 수 있습니다. 하지만 zip이라는 내장 함수를 이용하면 더 깔끔하게 만들 수 있습니다. zip은 둘 이상의 iterator를 lazy generator를 사용해 묶어 줍니다. zip generator는 각 iterator의 다음 값이 들어 있는 tuple을 반환합니다.

아래 코드와 같이이 tuple을 for문에서 바로 언패킹할 수 잇습니다.

```python
for name,count in zip(names,counts):
    if count > max_count :
        longest_name = name
        max_count = count
```

위에서 설명했다 시피, zip은 짧은 길이의 iterator에 맞춰 작동합니다. 리스트 컴프리헨션을 통해 리스트를 생성했다면, 각 리스트의 경우가 많긴 합니다.

만약 zip에 전달한 리스트의 길이가 같지 않을  것이라 예상한다면 itertools 내장 모듈에 있는  zip_longest를 사용하는 것이 좋습니다.

```python
import itertools
for name,count in itertools.zip_longest(names,counts):
    print(f'{name} : {count}')
# Cecilia : 7
# 남궁민수 : 4
# jimmy : 5
# Rosalind : None
```

---

itertools 모듈의 zip_longest의 구현은 다음과 같습니다. [link](https://docs.python.org/3.9/library/itertools.html#itertools.zip_longest)

```python
def zip_longest(*args, fillvalue=None):
    # zip_longest('ABCD', 'xy', fillvalue='-') --> Ax By C- D-
    iterators = [iter(it) for it in args]
    num_active = len(iterators)
    if not num_active:
        return
    while True:
        values = []
        for i, it in enumerate(iterators):
            try:
                value = next(it)
            except StopIteration:
                num_active -= 1
                if not num_active:
                    return
                iterators[i] = repeat(fillvalue)
                value = fillvalue
            values.append(value)
        yield tuple(values)
```

next에서 StopIteration이 발생했을때, fillvalue으로 준 인자 값을 넣어줍니다. num_active에 iterators  리스트 길이를 넣어 모든 iterator에서 StopIteration이 발생했을때, 함수를 종료합니다.
