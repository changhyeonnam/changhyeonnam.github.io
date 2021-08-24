---
title: C style string format과 f-string을 통한 interpolation
layout: post
Created: August 22, 2021 5:44 PM
tags:
    - Python
use_math: true
comments: true
---
### [Effective Python] Better way 04: C 스타일 형식 문자열을 str.format과 쓰기보다는 f - string을 통한 interpolation 사용하라.

---

파이썬 코드에서는 문자열을 많이 사용합니다.

- 사용자 인터페이스 또는 명령 유틸리티에 메세지 표시
- 파일과 소켓에 데이터 쓰기
- 어떤일이 잘못되었는지 Exception에 자세히 기록할때  문자열 사용. (Better way 27)
- 디버깅 할 때도 사용한다. (Better way 80)

---

#### 형식화(fomatting)

미리 정의된 문자열에 데이터 값을 끼워 넣어서 사람이 보기 좋은 문자열로 저장하는 과정입니다. 파이썬의 내장된 기능과 표준 라이브러리를 통해 4가지 방식으로 형식화가 가능합니다. (나머지 하나 빼고는 단점이  존재)

#### **형식 문자열**
가장 일반적인 방법으로, `%` 형식화 연산자를 사용하는 방법입니다. C와 동일하게 사용됩니다.
```cpp
a = 0b10111011
b = 0xc5f
print('이진수: %d, 십진수: %d'%(a,b))
# 이진수: 187, 십진수: 3167
```

`%` 왼쪽에 들어가는 미리 정의된 텍스트를 **형식  문자열** 이라고 합니다. C에서 제공하는 형식 문자열의 대부분 기능을 파이썬에서 제공합니다. (소수점 위치, 패딩, 좌우 정렬 등)

파이썬에서 C 스타일 형식 문자열을 사용하는 데는 4가지 문제점이 있습니다.

- 첫번째 문제점 : 형식화 식에서 오른쪽에 있는 tuple 내의 데이터  값의 순서를 바꾸거나 값의 타입을 바꾸면 변환이 불가능하여 오류가 발생합니다.

    ```python
    key = 'my_var'
    value = 1.234
    formatted = '%-10s = %.2f' % (key,value)
    print(formatted)
    # my_var     = 1.23
    formatted = '%-10s = %.2f' % (value,key)
    print(formatted)
    # Traceback TypeError: must be real number, not str
    ```

- 두번째 문제점 : 형식화를 하기 전에 값을 살짝 변경해야 한다면 가독성이 매우 떨어집니다.

    ```python
    pantry=[
        ('아보카도', 1.25),
        ('바나나', 2.5),
        ('체리', 15),
    ]
    for i, (item,count) in enumerate(pantry):
        print('#%d: %-10s = %.2f'%(i,item,count))
    #0: 아보카도       = 1.25
    #1: 바나나        = 2.50
    #2: 체리         = 15.00
    ```

    위의 코드가 변경 전이고, 이것을 약간 변경한 코드가 아래코드입니다. 가독성이 매우 떨어진 것을 볼 수 있습니다.

    ```python
    for i, (item,count) in enumerate(pantry):
        print('#%d: %-10s = %d'%(
            i+1,
            item.title(),
            round(count)))
    #1: 아보카도       = 1
    #2: 바나나        = 2
    #3: 체리         = 15
    ```

- 세번째 문제점 : 형식화 문자열에서 같은 값을 여러번 반복하고 싶다면 튜플에서 같은 값을 여러번 반복해야 합니다.

    ```python
    template = '%s는 음식을 좋아해. %s가 요리하는 모습을 봐요.'
    name = '철수'
    formatted = template % (name, name)
    print(formatted)
    # 철수는 음식을 좋아해. 철수가 요리하는 모습을 봐요.
    ```

    이런 문제를 해결하기 위해 파이썬의 `%`연산자에는 튜플 대신 딕셔너리를 사용하는 형식화 기능이 추가 되었습니다. 순서를 바꿔도 정상작동 하므로 첫번째 문제점 또한, 해결했습니다.

    ```python
    key = 'my_var'
    value = 1.234
    old_way = '%-10s = %.2f' % (key,value)
    new_way = '%(key)-10s = %(value).2f'% {'key':key, 'value':value}
    reordered = '%(key)-10s = %(value).2f'% {'value':value,'key':key}
    assert (old_way == new_way == reordered)
    ```

    또한 같은 값을 반복하지 않아도 되므로 세번째 문제 또한 해결 했습니다.

    ```python
    template = '%s는 음식을 좋아해. %s가 요리하는 모습을 봐요.'
    name = '철수'
    before = template % (name, name) # tuple
    template = '%(name)s는 음식을 좋아해. %(name)s가 요리하는 모습을 봐요.'
    after = template %{'name':name} # dictionary
    assert(before == after)
    ```

- 하지만 앞서 설명한 두번째 문제점이 가독성 문제가 더 심해지고, 이것이 형식화 문자열의 네번째 문제점입니다.

    ```python
    for i, (item,count) in enumerate(pantry):
        before= '#%d: %-10s = %d'%(
            i+1,
            item.title(),
            round(count))

        after = '#%(loop)d: %(item)-10s = %(count)d'%{
            'loop' : i+1,
            'item' : item.title(),
            'count' : round(count),
        }
        assert before == after
    ```
    형식화 식에 딕셔너리를 사용하면, 각 키를 최소 두번 (한번은 형식 지정자에, 다른 한번은 딕셔너리 키에) 반복해야 합니다.

    ```python
    soup ='lentil'
    formatted ='Today\'s soup is %(soup)s.' %{'soup':soup}
    print(formatted)
    # Today's soup is lentil.
    ```

---

#### **내장 함수 format과 str.format**
파이썬 3부터는 `%`를 사용하는 오래된 C 스타일 형화 문자열보다 더 표현력이 좋은 고급 문자열 형식화 기능이 도입됬습니다. format 내장 함수를 통해 모든 파이썬의 값에 적용할 수 있습니다.  다음 아래 코드는 새로운 옵션을 이용하여 값을 형식화 한 것입니다.

```python
a = 1234.5678
formatted = format(a,',.2f')
print(formatted)
# 1,234.57 (천단위 구분자를 표시할 때 사용하는 ,)

b = 'my 문자열'
formatted = format(b,'^20s')
print('*',formatted,'*')
# *        my 문자열        * (중앙에 값을 표현하는 ^)
```

아래 코드 처럼 C 스타일 형식 지정자 대신 위치 지정자`{}` 를사용할 수 있습니다.

```python
key = 'my_var'
value = 1.234

formatted = '{} = {}'.format(key,value)
print(formatted)
# my_var = 1.234
```

C 스타일 형식화 문자열에서 `%` 문자를 표시하고 싶거나, str.format을 사용할때, `{}` 을 표시하고 싶다면 아래와 같이 이스케이프 해야 합니다.

```python
print('%.2f%%' %12.5)
print('{} replace {{}}'.format(1.23))
# 12.50%
# 1.23 replace {}
```

format 메서드에 전달된 인자의 순서를 표현하는 위치 인덱스를 전달 할 수 도 있습니다. C스타일의 첫번째 문제점(순서 바꿀때 생기는 오류)과 세번째 문제점(같은 값 여러번 반복)을 해결할 수 있습니다.

```python
key = 'my_var'
value = 1.234
formatted = '{1} = {0}'.format(key,value)
print(formatted)
# 1.234 = my_var

name = '철수'
formatted = '{0}는 음식을 좋아해. {0}가 요리하는 모습을 봐요.'.format(name)
print(formatted)
# 철수는 음식을 좋아해. 철수가 요리하는 모습을 봐요.
```

하지만 두번째 문제점인 가독성은 해결하지 못합니다.

```python
for i, (item,count) in enumerate(pantry):
    old_style = '#%d: %-10s = %d'%(
        i+1,
        item.title(),
        round(count))

    new_style = '#{}: {:<10s} = {}'.format(
        i + 1,
        item.title(),
        round(count))

    assert old_style == new_style
```

정리하면, 형식 지정자 (콜론 다음에 나오는 모든 내용)에 사용하는 새로운 미니 언어 (예를들어 '.2f'와 같은 것들)와 format 내장 함수를 사용하는 법을 알아야 하지만, str.format의 나머지 부분은 파이썬이 새로 제공하는 f- string의 동작과 유용성을 이해하는데 도움을 주는 유물로 간주해야 합니다.

---

#### **interpolation을 통한 f-string**

이 문제점들을 한 번에 완전히 해결하기 위해 python 3.6부터 f-string이 생겼습니다. 형식 문자열 앞에 f 문자를 붙여야 합니다. 바이트 문자열 앞에는 b 문자를, raw 문자열(escape 하지 않아도 되는 문자열) 에는 r 문자를 붙이는 것과 비슷합니다.

f -string은 형식화 식 안에서 현재 파이썬 영역에서 사용할 수 있는 모든 이름을 자유롭게 참조할 수 있도록 허용함으로써 이런 간결함을 제공합니다.

```python
key ='my_var'
value=1.234
formatted = f'{key} = {value}'
print(formatted)
# my_var = 1.234
```

f-string을 사용화 형식화는 C 스타일 형식화 문자열에 `%`연산자를 사용하는 경우나, `str.format`을 사용하는 경우보다 항상 더 짧습니다.  또한 형식 지정자안에서 콜론 뒤에 사용할수 있는 내장 미니 언어를 f-string에서도 사용 가능합니다.

```python
f_string = f'{key:<10} = {value:.2f}'

c_tuple  = '%-10s = %.2f' % (key, value)

str_args = '{:<10} = {:.2f}'.format(key, value)

str_kw   = '{key:<10} = {value:.2f}'.format(key=key,
                                            value=value)

c_dict   = '%(key)-10s = %(value).2f' % {'key': key,
                                         'value': value}
```

f-string을 사용하면 위치 지정자 중괄호 안에 완전한 파이썬 식을 넣을 수 있고, 변경하고 싶을때도 간결한 구문으로 표기가 가능합니다.

```python
for i, (item, count) in enumerate(pantry):
    old_style = '#%d: %-10s = %d' % (
        i + 1,
        item.title(),
        round(count))

    new_style = '#{}: {:<10s} = {}'.format(
        i + 1,
        item.title(),
        round(count))

    f_string = f'#{i+1}: {item.title():<10s} = {round(count)}'

    assert old_style == new_style == f_string
```

또한 파이썬 식을 형식 지정자 옵션에 넣을 수 도 있습니다.

```python
places = 3
number = 1.23456
print(f'내가 고른 숫자는 {number:.{places}f}')
# 내가 고른 숫자는 1.235
```
