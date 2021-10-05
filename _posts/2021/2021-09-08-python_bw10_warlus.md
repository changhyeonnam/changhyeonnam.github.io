---
title: 대입식을 사용해 반복을 피하라
Created: September 8, 2021 4:03 AM
tags:
    - Python
use_math: true
comments: true
---
### [Effective Python] Better way 10: 대입식을 사용해 반복을 피하라

- 대입식에서는 왈러스 연산자(`:=`)를 사용해 하나의 식 안에서 변수 이름에 값을 대입하면서 이 값을 평가할 수 있고, 중복을 줄일 수 있다.
- 대입식이 더 큰 식의 일부분으로 쓰일 때는 괄호로 둘러싸야 한다.
- 파이썬에서는 switch/case 문이나 do/while 문을 쓸 수 없지만, 대입식을 사용하면 이런기능을 더 깔끔하게 흉내낼 수 있다.

---

[What’s New In Python 3.8](https://docs.python.org/3/whatsnew/3.8.html) 를 먼저 살펴봅시다. (더 자세한 내용은 [PEP 572](https://www.python.org/dev/peps/pep-0572/)에 있습니다.)

위 문서에서는 warlus 연산자를 사용할때의 장점에 대해 간략하게 설명하고 있습니다.

```python
if (n := len(a)) > 10:
    print(f"List is too long ({n} elements, expected <= 10)")
```

위 코드에서는 `len()`을 두번 호출해야 하는 것을 왈러스 연산자를 이용해 한번만 호출합니다.

```python
discount = 0.0
if (mo := re.search(r'(\d+)% discount', advertisement)):
    discount = float(mo.group(1)) / 100.0
```

첫번째 예제와 비슷하게, `regular expression matching`시에 사용되는 `re.search` 함수를 한번만 호출하게 해줍니다.

```python
# Loop over fixed length blocks
while (block := f.read(256)) != '':
    process(block)
```

왈러스 연산자는 `while-loops`에서 또한 유용합니다. `while`문에서 loop termination을 계산할때 사용되는 변수가 `while`문 안에서도 사용될 경우 왈러스를 사용하면 위와 같이 작성할 수 있습니다.

```python
[clean_name.title() for name in names
 if (clean_name := normalize('NFC', name)) in allowed_names]
```

filtering condition의 표현식에 사용되는 list comprehension에서도 위와 같이 간략하게 작성할 수 있습니다.

---

대입식은 영어로 assignment expression이며 왈러스 연산자(walrus operation)이라고 부릅니다. 이 대입식은 파이썬 언어에서 고질적인 코드 중복 문제를 해결하고자 파이썬 3.8에서 새롭게 도입된 구문입니다.

일반 대입문(assignment statement)은 `a = b` 라고 쓰며, 왈러스 연산자는 `a:=b`라고 씁니다.(a 왈려스 b라고 읽습니다. `:=` 가 바다코끼리(warlus)의 눈과 엄니처럼 보이기 때문에 이런 이름이 붙여 졌습니다.)

```python
def make_cider(count):
    ...
def out_of_stock():
    ...
count = fresh_fruit.get('사과',0)
if count >=4:
    make_cider(count)
else:
    out_of_stock()
```

위의 코드에서는 `count`가 `if`문에서만 사용함에도, 너무 강조하여 가독성을 해칩니다. 이와 같이 대입 후 평가를 하는 경우 왈러스 연산자를 사용하면 다음과 같이 간략하게 작성할 수 있습니다.

```python
if (count:= fresh_fruit.get('사과',0)>=4):
    make_cider(count)
else:
    out_of_stock()
```

---

파이썬에는 유연한 `switch/case`문이 없고, `if,elif,else` 문을 깊게 내포시켜 이를 대신할 수 있습니다.

```python
count = fresh_fruit('바나나',0)
if count>=2:
    pieces = slice_banna(count)
    to_enjoy = make_smoothies(pieces)
else:
    count = fresh_fruit('사과',0)
    if count >= 4:
        to_enjoy = make_cider(count)
    else:
        count = fresh_fruit('레몬',0)
        if count:
            to_enjoy = make_cider(count)
        else:
            to_enjoy = '아무것도 없음'

```

위와 같은 경우도 왈러스 연산자를 사용하면 가독성이 더 좋은 코드를 작성할 수 있습니다.

```python
if(count := fresh_fruit('바나나',0))>=2:
    pieces = slice_banna(count)
    to_enjoy = make_smoothies(pieces)
elif (count := fresh_fruit('사과',0))>=4:
    to_enjoy = make_cider(count)
elif count:=fresh_fruit('레몬',0):
    to_enjoy = make_cider(count)
else:
    to_enjoy = '아무것도 없음'
```

---

파이썬에는 do/while문 또한 없습니다.  `do/while` 루프문 대신 다음과 같이 작성할 수 있습니다.

```python
bottles = []
while True: # 무한 루프
    fresh_fruit = pick_fruit()
    if not fresh_fruit: # 중간에서 끝내기 loop-and-a half
        break
    ...
```

위와 같은 경우도 왈러스 연산자를 사용하면 가독성이 더 좋은 코드를 작성할 수 있습니다.

```python
bottles=[]
while fresh_fruit:=pick_fruit():
    ...
```
