---
title: 시퀀스를 슬라이스하는 방법
Created: November 2, 2021 10:33 PM
tags:
    - Python
use_math: true
comments: true
---
### [Effective Python] Better way 11: 시퀀스를 슬라이스하는 방법을 익혀라

---

### Relation to `slice()` object

slice() object과 slicling operation의 관계에 대한 링크입니다. [link](https://stackoverflow.com/questions/509211/understanding-slice-notation)

```python
a[start:stop:step]
```

slicing 연산자 `[]` 는 실제로는`slice()` object이 사용됩니다. ( `:` notation을 `[]`에 사용할 경우) 위의 코드는 다음 코드와 동일합니다.

```python
a[slice(start, stop, step)]
```

### list slicing의 시간 복잡도

[link](https://wiki.python.org/moin/TimeComplexity) : python 내장 자료구조 operation의 시간복잡도를 정리해 놓은 글입니다.

![Untitled](/images/2021/python/slice.png)

위 표는 list에서의 slice 시간복잡도를 나타낸 것입니다. get, delete, set에 상관없이 slice되는 원소개 k에 대해 시간복잡도 O(k)가 필요한것을 볼 수 있습니다.

---

파이썬에는 시퀀스를 여러 조각으로 나누는 슬라이싱 구문이 있다. 클래스에 `__getitem__` 과 `__setitem__` 특별 메서드를 구현하여 슬라이싱 기능을 추가할 수 있습니다.

- 슬라이싱 구문의 기본 형태는 `리스트[시작: 끝]` 이다. 시작 인덱스의 원소는 슬라이스에 포함되고 끝 인덱스의 원소는 포함되지 않습니다.
- 리스트의 맨 앞부터 슬라이싱 할때는 시각적 잠음을 없애기 위해 0을 생략합니다.

    ```python
    assert a[:5] == a[0:5)
    ```

- 리스트의 끝까지 슬라이싱할때는 끝 인덱스를 적지 않습는다.

    ```python
    assert a[5:] == a[5:len(a)]
    ```

- 리스트의 끝에 서부터 원소를 찾고 싶을 때는 음수 인덱스를 사용하면 됩니다.

    ```python
    a=['a','b','c','d']
    a[:] # ['a', 'b', 'c', 'd']
    a[:-1] # ['a', 'b', 'c']
    a[-1:] # ['d']
    a[1:-1] # ['b', 'c']
    ```

- 슬라이싱할때 리스트의 인덱스 범위를 넘어가는 시작과 끝 인덱스는 무시된다. 이 기능을 이용해 입력 시퀀스를 다룰때 원하는 최대길이를 지정할 수 있습니다.

    ```python
    first_twenty_items = a[:20]
    last_twenty_items = a[-20:]
    ```

- 리스트를 슬라이싱한 결과는 완전히 새로운 리스트이다. 슬라이싱한 결과로 얻은 리스트를 변경해도 원래 리스트는 바뀌지 않습는다.
- 대입에 슬라이스를 사용하면 원본 리스트에서 지정한 범위에 들어있는 원소를 변경한다. unpacking과 달리 ( a,b = c[:2]) 슬라이스와 대입되는 리스트의 길이가 같을 필요는 없습니다.
    - 리스트에 지정한 슬라이 길이보다 대입되는 리스트 배열의 길이가  짧아서 리스트가 줄어듭니다.

        ```python
        a[2:7] = [1,2,3]
        ```

    - 반대로 대입되는 배열이 더 길어서 리스트가 늘어납니다.

        ```python
        a[2:3] = [1,2,3]
        ```

- 슬라이싱에서 시작과 끝 인덱스를 모두 생략하면 원래 리스트를 복사한 새 리스트를 얻습니다.

    ```python
    b = a[:]
    assert b==a and b is not a
    ```

    시작과 끝 인덱스가 없는 슬라이스에 대입하면 슬라이스가 참조하는 리스트의 내용을 대입하는 리스트의 복사본으로 덮어씁니다. 아래 코드에서는 a와 b는 같은 리스트 객체입니이다.

    ```python
    a = [1,2,3]
    b = a
    print('이전 a:',a)
    print('이전 b:',b)
    a[:] = [4,5,6]
    assert a is b
    print('이후 a:',a)
    print('이후 b:',b)
    # 이전 a: [1, 2, 3]
    # 이전 b: [1, 2, 3]
    # 이후 a: [4, 5, 6]
    # 이후 b: [4, 5, 6]
    ```


---

- 위의 예제를 돌려보다가 신기한점을 찾았습니다.

    ```python
    b = a[:] # 1
    b = a # 2
    ```

    1번은 슬라이스하여 새로운 리스트를 생성하여 대입하지만, 2번은 단순히 리스트 객체를 대입한 것으로 b는 a에 대한 참조입니다. 그래서 2번과 같은 경우 a가 변경되면 b가 변합니다. 다음링크과 이와 관련되어 있습니다. [link](https://stackoverflow.com/questions/6793872/variable-assignment-and-modification-in-python)

    파이썬에서의 메모리 관리에서 모든 파이썬 객체와 자료구조는 private heap memory location에서 다룹니다. 즉, 파이썬의 스택은 항상 어떤 값에 대한 reference이고, 파이썬의 runtime에서는 object (which all live in the heap)에 대해 reference만을 다룹니다. 그래서 단순 대입하게  되면 b가 a의 참조가 됩니다.

    ```python
    b = a
    >>> a is b
    >>> True
    >>> id(a) == id(b)
    >>> True
    ```

    만약 explicitly하게 copy를 만든다면 다른 리스트 객체가 생성됩니다.

    ```python
    >>> b = list(a)
    >>> a is b
    >>> False
    ```
