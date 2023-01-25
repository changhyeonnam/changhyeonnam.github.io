---
title: from collections import Counter
layout: post
Created: January 25, 2023 10:06 PM
tags:
    - Python
use_math: true
comments: true
sitemap :
  changefreq : daily
  priority : 1.0
---

>`collections` module에는 specialized container datatype들이 구현되어있다. 그 중에 Counter class에 대해 알아보려고 한다.

---

Counter는 dict subclass로, hashable object에 대해 개수를 세준다. Element가 key로, 각 element의 개수가 value로써 dictionary 값이 저장된다. Counter는 value로 음수와 0을 포함한 integer값이 올 수 있다.

```python
>>> from collections import Counter
>>> c = Counter(['a','a','b','b','c','a'])
>>> c
Counter({'a': 3, 'b': 2, 'c': 1})
```

Counter object의 함수를 살펴보자.

1. elements() : value값 만큼 element들을 반환해주는 iterator를 반환한다.

    ```python
    >>> it = c.elements()
    >>> it
    <itertools.chain object at 0x7fb0aa5c6d90>
    >>> next(it)
    'a'
    >>> next(it)
    'a'
    >>> next(it)
    'a'
    >>> next(it)
    'b'
    >>> next(it)
    'b'
    >>> next(it)
    'c'
    >>> next(it)
    Traceback (most recent call last):
      File "<stdin>", line 1, in <module>
    StopIteration
    >>> it = c.elements()
    >>> sorted(it)
    ['a', 'a', 'a', 'b', 'b', 'c']
    ```

2. most_common(n=None) : n개의 가장 자주 등장하는 (elements, count) tuple형태의 list를 반환한다. n에 대해서 default = None이고, None일 떄는 모든 element로 구성되어 있는 tuple list를 반환한다.

    ```python
    >>> c.most_common(2)
    [('a', 3), ('b', 2)]
    >>> c.most_common()
    [('a', 3), ('b', 2), ('c', 1)]
    ```

3. substract(iterable or mapping or counter) : iterable or mapping으로부터 elements들을 빼준다.

    ```python
    >>> c2 = Counter(['a','c'])
    >>> c.subtract(c2)
    >>> c
    Counter({'a': 2, 'b': 2, 'c': 0})
    ```

4. total() : count의 합을 반환해 준다. → python 3.10에서부터 가능하다. (3.8 사용중)

---

Leetcode에서 [621. Task Scheduler](https://leetcode.com/problems/task-scheduler/description/?envType=study-plan&id=level-2) 문제를 파이썬으로 풀다가 정리한 내용이다. 여기에선 value간만 필요해서, values()로 반환해서 dict values 타입을 사용해서 풀었다. 혹시나 나중에 또 쓸일이 있을까봐 기록해 둔다.

```python
from collections import Counter
class Solution(object):
    def leastInterval(self, tasks, n):
        """
        :type tasks: List[str]
        :type n: int
        :rtype: int
        """
        c = Counter(tasks).values()
        max_cnt = max(c)
        part_cnt = max_cnt-1
        max_freq = c.count(max_cnt)
        empty_slots = part_cnt * (n-(max_freq-1))
        available_tasks = len(tasks)- max_cnt * max_freq
        idles = max(0, empty_slots - available_tasks)
        answer = len(tasks) + idles
        return answer
```

---
## Reference
1. [python document : collections.Counter](https://docs.python.org/3/library/collections.html#collections.Counter)
