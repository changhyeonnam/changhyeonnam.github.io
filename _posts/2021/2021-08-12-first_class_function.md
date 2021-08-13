---
title: 일급 객체로서 의 함수 (first-class function)
layout: post
Created: August 12, 2021 4:15 PM
tags:
    - Python
use_math: true
comments: true
---
> "Fluent Python part3 객체로서 함수 chapter 05 일급 함수" 를 참고하여 작성한 포스트이다. 일급 객체로서 함수의 특성과 파이썬에서의 함수형 프로그래밍에 대한 내용과 고위 함수인 `reduce()`, `map()`, `__call__`,`callable()` 내장  함수와 inspect, annotation에 대한 내용을 포함한다.

---

파이선을 만든  귀도 반 로섬은 파이썬을 함수형 프로그래밍 언어로 생각하지 않았다고는 했지만, 함수를 일급객체로 만들었다.

파이썬의 함수는 일급 객체이다. 일급 객체는 다음과 같은 작업을 수행할 수 있다.

- runtime에 생성할 수 있다.
- 데이터 구조체의 변수나 요소에 할당할 수 있다.
- 함수 인수로 전달 할 수 있다.
- 함수 결과로 반환할 수 있다.

정수, 문자열, 딕셔너리 또한 파이썬의  일급객체이다.

### 함수를 객체처럼 다루기

```python
def factorial(n)->int:
    "returns n!"
    return 1 if n<2 else n*factorial(n-1)
```

위와 같은 factorial 함수를 생성했다고 하자. 다음 코드들은 함수가 일급 객체임을 보여준다.

```python
print(factorial.__doc__) # returns n!
fact = factorial
print(fact) # <function factorial at 0x7fa05d0ba1f0>
print(fact(5)) # 120
print(list(map(fact,range(11))))
# [1, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880, 3628800]
```

`.__doc__` : 함수 객체의 속성 중 하나로, docstring을 반환한다.

함수를 fact라는 변수에 할당하고, 변수명을 통해 함수를 호출한다.

`map(function, iterable, ...)` : 첫번째 인수로 함수, 두번째 인수로 반복 가능한 객체를 받고, 첫번째 인수(함수)에 두번째 인수(itearable 객체)를 적용한 결과를  갖는 반복 가능한 객체를 반환한다.

일급 함수가 있으면 함수형 스타일로 프로그래밍 할 수 있고, 함수형 프로그래밍의 특징 중 하나는 고위 함수이다.

---

### 고위 함수 (higher-order function)

함수를 인수로 받거나, 함수를 결과로 받는 함수를 고위 함수 (higher-order function)이라고 한다. 대표적으로 위에 사용한 map()함수, 아래 코드에서 사용할 sorted() 내장 함수가 있다.

```python
fruits = ['fig','apple','strawberry','banana','cherry']
print(sorted(fruits,key=len))
# ['fig', 'apple', 'banana', 'cherry', 'strawberry']

def reverse(word):
    return word[::-1]
print(sorted(fruits,key=reverse))
# ['banana', 'apple', 'fig', 'strawberry', 'cherry']
```

`sorted(iterable,*, key=None, reverse=False)`: 선택적인 key 인수로 함수를 전달받아 정렬할 각 항목에 적용한다. 인수를 하나 받는 함수는 모두 key 사용 가능하다.

길이에 따라 단어 리스트를 정렬하기 위해 len 함수를 key 인수로 전달 하였고, reverse 함수를 key로 받아 거꾸로 된 철자가 정렬 기준이 되었다.

함수형 프로그래밍 세계에서는 `map(), filter(),  reduce(), apply()` 등의 고위 함수가 널리 알려져 있다.

---

### map(), filter(), reduce()의 대안

리스트 컴프리헨션, 제네레이터의 표현식이 가독성이 더 좋고 위 함수들을 모두 처리할 수 있어서, `map(), filter(), reduce()` 함수의 중요성이 떨어졌다.

```python
print(list(map(fact,range(6))))
print(list(fact(n) for n in range(6)))
#[1, 1, 2, 6, 24, 120]

print(list(map(factorial,filter(lambda n:n%2, range(6)))))
print([factorial(n) for n in range(6) if n%2])
#[1, 6, 120]
```

`map(), filter()`에 대한 똑같은 결과를 리스트 컴프리헨션으로 생성하였다.

map()과 filter()는 generator (일종의 반복 가능 객체)를 반환하므로, 제네레이터 표현식이 이 함수들을 대체한다.


```python
from functools  import reduce
from operator import add
print(reduce(add,range(100)))
print(sum(range(100)))
#4950
```

python  3.0부터는 reduce()는  더이상 내장 함수로  제공하지 않고, 동일 작업이지만, 성능과 가독성이 좋은 sum()을 사용하면 된다.

`sum()`과 `reduce()`는 연속된 항목에 어떤 연산을 적용해서, 이전 결과를 누적 시키면서 일련의 값을 하나의 값으로 reduction한다는 공통점이 있다.

---

### 람다(lambda) 함수 ( 혹은 익명 함수)

lambda 키워드는 익명 함수를 생성하지만, 파이썬은 람다 함수 본체가 순수한 표현식으로 구성되도록 제한한다. 즉, 람다 본체에 할당문, while, try 등을 사용할 수 없다. 람다 함수는 함수의 인수로 사용될 때 유용하게 사용되고, 고위 함수의 인수로 사용하는 방법 이외에 파이썬에서 사용되지 않는다. (구문 제한으로 인해 가독성이 떨어진다.)

```python
fruits = ['fig','apple','strawberry','banana','cherry']
print(sorted(fruits,key=lambda word: word[::-1]))
```

def 문과 마찬가지로 람다 표현식 또한 하나의 함수 객체를 만든다. 즉, 파이썬에서  제공하는 여러 callable(호출 가능한) 객체 중 하나 일 뿐이다.


---

### 일곱 가지  맛의 콜러블(callable) 객체

호출 연산자인  `( )` 는 사용자 정의 함수 이외의 다른 객체에도 적용할 수 있다. 호출할 수 있는 객체인지 알아  보려면 `callable( )`   내장 함수를 사용한다.

```python
print([callable(obj) for obj in (abs,str,13)])
# [True, True, False]
```

1. 사용자 정의 함수 : `def` 문이나 람다 표현식으로 생성합니다.
2. 내장 함수 : `len` 과 같은 C언어로 구현된 함수.
3. 내장 메서드 : `dict.get()`처럼 C언어로 구현된 메서드
4. 메서드 : 클래스 본체에 정의 된 함수
5. 클래스 : 호출될 때, 자신의 ` __new__()` 메서드를 실행해서 객체를 생성하고, `__init__()`으로 초기화한 후, 최종적으로 호출자(caller)에 객체를 반환한다.
6. 클래스 객체 : 클래스가` __call__()` 메서드를 구현하면 이 클래스의 객체는 함수로 호출 될 수 있다.
7. 제네레이터 함수 : yield 키워드를  사용하는  함수나, 메서드. 이 함수가 호출되면 제네레이터 객체를 반환한다.

---

### 사용자 정의 callable 형

파이썬 함수가 실제 객체일 뿐만 아니라, 모든 파이썬 객체가 함수처럼 동작하게 만들 수 있다. 단지 `__call__()` 인스턴스 메서드를 구현하면 된다.

```python
import random

class BingoCage:
    def __init__(self,items):
        self._items = list(items)
        random.shuffle(self._items)

    def pick(self):
        try:
            return self._items.pop()
        except IndexError:
            raise LookupError('pick from empty BingoCage')
    def __call__(self):
        return self.pick()
```

`__init__(self,items)` : iterable 객체를 받는다.

`pick(self)` : pop한 원소를 반환한다.

`__call__(self)` : bingo.pick( )에 대한 단축 형태로 bingo( )을 정의한다. 이 메서드를 구현하면, BingoCage의 객체를 함수처럼 호출할 때마다 항목을 하나 꺼낸 후 변경된 상태를 유지할 수 있게 한다.

```python
bingo = BingoCage(range(3))
print(bingo.pick())
print(bingo())
print(callable(bingo))
# 0
# 1
# True
```

`__call__`과 유사한 것이 데코레이터(decorator)가 있다. 데코레이터는 함수이지만, 때때로 호출된 후의 상태를 '기억'할 수 있는 기능이 유용하게 사용된다.


---

다음은 `__init__`과 `__call__` 의 기본적인 차이점을 보여주는 코드이다.

The first is used to initialise newly created object, and receives arguments used to do that:

```python
class Foo:
    def __init__(self, a, b, c):
        # ...

x = Foo(1, 2, 3) # __init__
```

The second implements function call operator.

```python
class Foo:
    def __call__(self, a, b, c):
        # ...

x = Foo()
x(1, 2, 3) # __call__
```

reference : [link](https://stackoverflow.com/questions/9663562/what-is-the-difference-between-init-and-call)

---

### 함수 인트로스펙션 (introspection)

일반적으로 객체 지향 언어의 맥락에서 introspection 은 런타임시 객체가 유형, 사용 가능한 속성 및 메서드, 객체에 대한 추가 작업을 수행하는 데 필요한 기타 정보를 알아내는 기능이다. python에서 introspection과 관련된 함수로 `dir()` , `type()` , `isinstance()` , `hasattr()` 등이 있다.

```python
class C: pass
obj = C()
def func(): pass
print(sorted(set(dir(func))-set((dir(obj)))))
# ['__annotations__', '__call__', '__closure__', '__code__', '__defaults__',
#  '__get__', '__globals__', '__kwdefaults__', '__name__', '__qualname__']
```

다음은 일반 객체에는 존재하지 않는 함수 속성을 나열한 것이다.

---

### 위치 매겨변수에서 키워드 전용 매개변수 까지

키워드 전용 인수(keyword-only argument)를 이용해서 향상된, 파이썬3의 융통성 있는 매개변수 처리 메커니즘은 파이썬 함수에서 볼 수 있는 가장 훌륭한 기능 중 하나이다. 함수를 호출할 때 반복 가능한 객체나 매핑 형을 별도의 인수로 '폭발'시키는 `*`와 `**` 기호도 이 메커니즘과 밀접하게  연관이 되어 있다.

```python
def tag(name, *content, cls=None, **attrs):
    """하나 이상의 HTML 태그를 생성한다."""
    if cls is not None:
        attrs['class'] = cls
    if attrs:
        attr_str = ''.join(' %s="%s"'%(attr,value)
                           for attr,value
                           in sorted(attrs.items()))
    else:
        attr_str = ''
    if content:
        return '\n'.join('<%s%s>%s</%s>'%
                         (name, attr_str,c,name) for c in content)
    else:
        return '<%s%s />' % (name, attr_str)
```

위의 코드는 HTML 태그를 생성하는 코드 입니다.

`tag(name, *content, cls=None, **attrs)` : 첫번째 이후의 인수들은 모두 `*content` 매개변수에 tuple로 전달됩니다. tag에 명시적으로 이름이 지정되지 않은 키워드 인수들은 딕셔너리로 `**attrs`로 전달됩니다. name, cls에 대해서 명명된 매개변수가 전달됩니다.

```python
print(tag('br'))
# <br />

print(tag('p','hello'))
# <p>hello</p>

print(tag('p','hello','world'))
# <p>hello</p>
# <p>world</p>

print(tag('p','hello', id=33))
# <p id="33">hello</p>

print(tag('p','hello','world',cls='sidebar'))
# <p class="sidebar">hello</p>
# <p class="sidebar">world</p>

my_tag={'name':'img', 'title':'Sunset Boulevard','src':'sunset.jpg','cls':'framed'}
print(tag(**my_tag))
# <img class="framed" src="sunset.jpg" title="Sunset Boulevard" />
```

---

### 매개변수에 대한 정보  읽기

bobo HTTP 프레임워크에서 함수 인트로스펙션을 적용한 재밌는 예시가 있다.

```python
import bobo

@bobo.query('/')
def hello(person):
    return 'Hello %s!'% person
```

`@bobo.query('/')` : hello()와 같은 평범한 함수와 프레임워크에서 제공하는 요청 메커니즘을 결합시킨다. 여기서 중요한 점은 Bobo가 hello() 함수의 내부를 조사해서 이 함수가 작동하려면 person이라는 매개변수가 필요하다는 것을 알아낸다는 것이다. 요청에서 해당 이름의 매개변수를 가져와서 hello()에 전달한다.

```python
bobo -f ch05-13.py
$ curl -i http://localhost:8080/
```

terminal에 위와 같이 스크립트와 저 요청을 하면 403 forbidden response와 함께 'Missing form variable person'이라는 메시지가 나온다. (curl-i 를 사용하여 HTTP 헤더를 출력하였다.)

<div class="center">
  <figure>
    <a href="/images/2021/python/missing.png"><img src="/images/2021/python/missing.png"  width="500"></a>
  </figure>
</div>

```python
$ curl -i http://localhost:8080/?person=JIM
```

위와 같은 요청을 하면 'Hello JIM!' 문자열 메세지로 응답한다.

<div class="center">
  <figure>
    <a href="/images/2021/python/jim.png"><img src="/images/2021/python/jim.png"  width="500"></a>
  </figure>
</div>

함수에 어떤 매개변수가 필요한지, 매개변수 기본값이 있는지 없는지 Bobo는 어떻게 알까? 함수 객체 안의 `__defaults__` 속성에는 위치(posistional) 인수와 키워드(keyword) 인수의 기본값을 가진 튜블이 있다. 키워드 전용 인수의 기본값은 `__kwdefaults__` 속성에 들어가 있다. 인수 명은 `__code__` 속성에 들어가 있는데, 이 속성은 여러 속성을 담고있는 code 객체를 가리킨다.

```python
def clip(text, max_len=80):
    """max_len 앞이나 뒤의 마지막 공백에서 잘라낸 텍스트를 반환한다."""
    end = None
    if len(text) > max_len:
        space_before = text.rfind(' ',0,max_len)
        if space_before>=0:
            end = space_before
        else:
            space_after = text.rfind(' ',max_len)
            if space_after>=0:
                end = space_after
    if end is None:
        end = len(text)
    return text[:end].rstrip()

print(clip.__defaults__)
# (80,)

print(clip.__code__)
# <code object clip at ...>

print(clip.__code__.co_varnames)
# ('text', 'max_len', 'end', 'space_before', 'space_after')

print(clip.__code__.co_argcount)
# 2
```

정보가 그다지 사용하기 편하게 배치되어 있지는 않다. `__code__`,`.co_varnames` 에는  함수 본체에서 사용한 지역 변수 명도 들어가 있다. 그래서 `inspect` 모듈을 사용하면 더 깔끔하게 처리할 수 있다.

```python
from inspect  import signature
sig = signature(clip)

print(sig)
# name,'=',param.default)

for name, param in sig.parameters.items():
    print(param.kind,':',(text, max_len=80)
# POSITIONAL_OR_KEYWORD : text = <class 'inspect._empty'>
# POSITIONAL_OR_KEYWORD : max_len = 80
```

`inspect.signature()` 는 `inspect.Signature` 객체를  반환하며, 이 객체에 들어 있는 parameters 속성을 이용하면 정렬된 `inspect.Parameter`  객체를 읽을 수 `있다`. 각 `Parameter` 객체 안에는 `name, default, kind` 등의 속성이 들어 있다.

```python
import inspect
sig = inspect.signature(tag)
my_tag={'name':'img', 'title':'Sunset Boulevard','src':'sunset.jpg','cls':'framed'}
bound_args=sig.bind(**my_tag)
for name,value in bound_args.arguments.items():
    print(name,'=',value)
# name = img
# cls = framed
# attrs = {'title': 'Sunset Boulevard', 'src': 'sunset.jpg'}
```

`inspect.Signature` 객체에는 bind() 메서드가 정의되어 있다. bind() 메서드는 임의 개수를 받고, 인수를 매개변수에  대응시키는 일반적인 규칙을 적용해서 그것을  시그니처에 들어있는 매개변수에 바인딩한다.

inspect을  사용하는 이 예제를 통해 함수 호출 시 인수를 매개변수에 바인딩하기 위해 인터프리터가 사용하는 데이터 모델 메커니즘이 작동하는 방식을 알 수 있다.

---

### 함수 annotataion

```python
def clip(text:str, max_len:'int>0'=80)->str :
		...
```

함수 선언에서 각 매개변수에는 콜론(:) 뒤에 annotation 표현식을 추가할 수 있다. 기본값이 있을 때, annotation은 인수 명과 등호(=) 사이에 들어간다. 반환 값에 annotation을 추가하려면 매개변수를 닫는 괄호와 함수 선언의 제일 뒤에 오는 콜론 사이에 →기호와 표현식을 추가한다.

파이썬은 annotation을 함수의 `__annotations__` 속성에 추가할 뿐, 아무 행동도 취하지 않는다. 도구(IDE 등), 프레임워크, decorator가 사용할 수 있는 메타 데이터일 뿐이다.

```python
from inspect  import signature
sig = signature(clip)
for param in sig.parameters.values():
    note  = repr(param.annotation).ljust(13)
    print(note,":",param.name,'=',param.default)
# <class 'str'> : text = <class 'inspect._empty'>
# 'int>0'       : max_len = 80
```

---

### 함수형 프로그래밍을 위한 패키지

귀도 반 로섬은 파이썬이 함수형 프로그래밍 언어를 지향하지 않았다고 했지만, operator와 functools같은 패키지들로 파이썬 에서도 함수형 코딩 스타일을 사용할 수 있다.  아래가 그 예이다.

```python
from functools import reduce,partial
from operator import mul

def fact(n):
    return reduce(mul,range(1,n+1))
print(fact(5))
#120

triple = partial(mul,3)
print(triple(7))
#21

print(list(map(triple,range(1,10))))
# [3, 6, 9, 12, 15, 18, 21, 24, 27]
```
