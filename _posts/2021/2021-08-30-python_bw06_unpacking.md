---
title: index를 사용하는 대신 대입을 사용해 데이터를 unpacking 하라
Created: August 30, 2021 1:50 PM
tags:
    - Python
use_math: true
comments: true
---
### [Effective Python] Better way 06: 인덱스를 사용하는 대신 대입을 사용해 데이터를 언패킹(unpacking) 하라

- 파이썬은 한 문장 안에서 여러 값을 대입할 수 있는 언패킹이라는 특별한 문법을 제공 한다.
- 파이썬 언패킹은 일반화되어, 모든 interable(반복가능한 객체)에 적용할 수 있다.  그리고 iterable이 여러 계층으로 내포된 경우에도 언패킹을 적용할 수 있다.
- 인덱스를 사용해 시퀀스 내부에 접근하는 대신 언패킹을 사용해 시각적 잡음을 줄이고 코드를 더 명확하게 만들라.

---

불변(immutable) 순서 쌍을 만드는 내장 타입으로 튜플(tuple)이 있습니다. 튜플에 있는 값은 인덱스를 사용해 접근 할 수 있지만, 인덱스를 통해 새 값을 대입해서 튜플 값을 변경할 수 없습니다.

```python
item =('호박엿','식혜')
first = item[0]
second = item[1]
print(first,'&',second)
# 호박엿 & 식혜

pair = ('호박엿','식혜')
pair[0] = '타래과'
# TypeError: 'tuple' object does not support item assignment
```

---

파이썬에는 언패킹(unpacking)이라는 구문이 있습니다. 언패킹 구문을 사용하면 한 문장 안에서 여러 값을 대입할 수 있습니다. 언패킹 문에서는 튜플을 변경할 수 있고, 위의 인덱스로 튜플에 대입하는 것(허용 하지 않는 동작)과 다르게 동작합니다. 쉽게 말하면 보이지 않는 임시변수를 새로 만들어 대입합니다.( C++의 임시객체와 비슷한 느낌을 받았습니다.)

```python
item =('호박엿','식혜')
first,second = item #unpacking
```

iterable 안에 iterable이 들어 가는 다양한 패턴에 대해서도 언패킹 구문을 사용할 수 있습니다.

```python
today_health = {
    '어깨':('숄더 프레스',3),
    '다리':('레그 프레스',3),
    '가슴':('벤치 프레스',3)
}
((type1,(name1,num1)),
 (type2,(name2,num2)),
 (type3,(name3,num3))) = today_health.items()
print(f'오늘 운동한 부위는 {type1},{type2},{type3}이고 '
      f'각각 {name1}/{num1},{name2}/{num2},{name3}/{num3}세트씩 했습니다.')
# 오늘 운동한 부위는 어깨,다리,가슴이고 각각 숄더 프레스/3,레그 프레스/3,벤치 프레스/3세트씩 했습니다.
```

---

언패킹을 사용하면 임시변수를 정의하지 않고도 값을 맞바꿀 수 있습니다. 다음은 임시변수와 인덱스를 사용한 bubble sort, 오름차순 알고리즘입니다.

```python
def bubble_sort(a):
    for _ in range(len(a)):
        for i in range(1,len(a)):
            if a[i]<a[i-1]:
                temp = a[i]
                a[i] = a[i-1]
                a[i-1] = temp
names =['c','a','d','b']
bubble_sort(names)
print(names)
# ['a', 'b', 'c', 'd']
```

언패킹 구문을 사용하면 한 줄로 두 인덱스가 가리키는 원소를 서로 맞바꿀 수 있습니다.

```python
def bubble_sort(a):
    for _ in range(len(a)): # throwaway index
        for i in range(1,len(a)):
            if a[i]<a[i-1]:
                a[i-1],a[i]=a[i],a[i-1]
names =['c','a','d','b']
bubble_sort(names)
print(names)
# ['a', 'b', 'c', 'd']
```

위의 코드의 작동 순서에 대해 설명하겠습니다. 우선 대입문의 우항인`a[i],a[i-1]`에 각각 해당하는 값이 계산되고, 그 결과값이 이름이 없는  새로운 tuple에 저장됩니다. 그 다음  그후 좌항에 있는 언패킹 패턴을 통해 임시 tuple에 있는 값이 `a[i-1],a[i]` 라는 변수에 각각 저장됩니다. 마지막으로 이름 없는 임시 tuple이 사라집니다.

---

언패킹의 용례 중 또 한가지 쓸모 있는 것은 for 루프 또는 그와 비슷한 요소(comprehension or generator)의 대상인 리스트의 원소를 언패킹하는 것이 있습니다. 언패킹을 사용하지 않는다면 일일이 대입해야 합니다.

```python
snacks =[('베이컨',350),('도넛',240),('머핀',190)]
for rank,(name,calories) in enumerate(snacks,1):
    print(f'#{rank}: {name}은 {calories} 칼로리 입니다.')
# 1: 베이컨은 350 칼로리 입니다.
# 2: 도넛은 240 칼로리 입니다.
# 3: 머핀은 190 칼로리 입니다.
```

언패킹을 잘 사용하면 가능한 한 인덱스 사용을 피할 수 있고, 더 명확하고 파이썬다운 코드를 작성할 수 있습니다.
