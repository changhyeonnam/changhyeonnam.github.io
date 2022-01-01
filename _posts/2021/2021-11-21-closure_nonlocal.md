---
title: 변수 영역과 클로저의 상호작용 방식을 이해하라
Created: November 21, 2021 6:17 PM
tags:
    - Python
use_math: true
comments: true
sitemap :
  changefreq : daily
  priority : 1.0
---

> 이번학기에 시스템 프로그래밍을 수강하고 있는데, 어느정도 겹치는 내용이 많았습니다. (복습하는 느낌이랄까) 클로저(clousre)의 개념, 클로저와 데코레이터(decorator)의 관계에 대해서는 후에 더 자세히 정리할 계획입니다.
>

### [Effective Python] Better way 21: 변수 영역과 클로저의 상호작용 방식을 이해하라.

- 클로저 함수는 자신이 정의된 영역 외부에서 정의된 변수도 참조할 수 있다.
- 기본적으로 클로저 내부에 상용한 대입문은 클로저를 감싸는 영역에 영향을 끼칠 수 없다.
- 클로저가 자신을 감싸는 영역의 변수를 변경한다는 사실을 표시할 때는 nonlocal 문을 사용하라.
- 간단한 함수가 아닌 경우에는 nonlocal 문을 사용하지 마라.

---

이 챕터에 대해 이해하기 위해선 다음 개념에 대해 알아야 합니다.

- 일급 시민 객체 (first-class citizen)
- 클로저(closure)
- `__call__`

### 일급 객체 (first-class citizen)

일급 객체는 다음과 같은 작업을 수행할 수 있습니다.

- runtime에 생성할 수 있다.
- 데이터 구조체의 변수나 요소에 할당할 수 있다.
- 함수 인수로 전달 할 수 있다.
- 함수 결과로 반환할 수 있다.

대부분의 자료 타입들은  위 작업을 수행할 수 있습니다. 대부분의 언어에서도 대부분의 타입들은 일급객체의 특성을 만족합니다. 여기서 중요하게 봐야할 것은 함수가 일급객체이냐 입니다. C,C++에서는 함수가 일급객체가 아니지만, 파이썬에서는 함수도 일급객체입니다. (C,C++에서는 함수(이름)를 인자로 전달할 수 없습니다. )

```python
def double(n):
    return 2*n
def call_function(x,func):
    print(func(x))

call_function(10,double)
# 20
```

위의 예시처럼 함수를 인자로 전달할수 있고,

```python
def odd(x):
    print(f'{x} is odd.')
def even(x):
    print(f'{x} is even.')
def return_function(x):
    if x%2==1:
        return odd(x)
    else:
        return even(x)
return_function(3)
# 3 is odd.
```

위의 예시처럼 함수를 return value로 전달할 수 있습니다.

[일급 객체로서 의 함수 (first-class function)](https://changhyeonnam.github.io/2021/08/12/first_class_function.html) 다음 링크에서 함수를 일급객체로서 사용하는 방법을 소개하고 있습니다.

### 클로저(Closure)

파이썬에서는 클로저는 자신을 둘러싼 scope의 상태값을 기억하는 함수입니다. 상태값을 기억한다는 의미는 함수가 새로 실행되도 자신을 둘러싼 scope에 대한 캐시가 유지된다는 의미입니다. 어떤 함수가 클로저이기 위해서는 다음 세가지 조건을 만족해야 합니다.

1. 해당 함수는 어떤 함수 내의 중첩된 함수이다.
2. 해당 함수는  자신을 둘러싼 함수 내의 상태값을 반드시 참조해야 합니다.
3. 해당 함수를 둘러싼 함수는 이 함수를 반환해야 합니다.

클로저 함수의 동작에 대해 살펴봅시다.

```python
def multiply_function(n):
    def multiply(x):
        return n*x
    return multiply

value = multiply_function(5)
value2 = multiply_function(3)

print(value(4))
print(value2(3))
# 20
# 9
```

위와 같이 클로저를 만들어서 value, value2에 대입했습니다. 클로저의 특징 중 하나는 자신을 둘러싼 함수의 상태값을 참조하는데, 둘러싸는 함수가 메모리에서 삭제되어도 값이 유지됩니다. 또한 둘러싸고 있는 함수의 존재 여부에 상관없이 자신의 scope에 해당하는 동작이 유지됩니다.

```python
del(multiply_function)
print(value(4))
print(value2(3))
# 20
# 9
```

또한 그 클로저는 둘러싸고 있는 함수의 변수를 참조하게 되는데, 그 변수를 다음과 같이 출력할 수 있습니다.

```python
print(value.__closure__[0].cell_contents)
# 5
print(value2.__closure__[0].cell_contents)
# 3
```

나중에 다루겠지만, decorator의 내부 원리는 클로저를 만드는 것과 같습니다.

추가로 클로저를 사용하는 이유는 변수 및 메모리에 대해서 책임을 명확히 할 수 있고, 메모리면에서도 효율적으로 사용할 수 있습니다.

### `__call__`

[다음 링크](https://www.geeksforgeeks.org/__call__-in-python/) 을 가보면 `__call__` 함수는 buil-in method로써, 클래스의 인스턴스가 함수처럼 behave할 수 있게 하는 메서드라고 합니다.

[link](https://stackoverflow.com/questions/9663562/what-is-the-difference-between-init-and-call) 다음 링크를 보면 `__init__` 과 `__call__` 의 동작차이에 대해 더 잘 이해할 수 있습니다. 전자는 생성자로써, 인스턴스를 만들때 사용하고, 후자는 객체의 lifecycle에 어떠한 영향을 주지 않고, 인스턴스를 함수와 같이 callable하게 만들어주고, 또한 이를 통해 internal state도 수정할 수있습니다. 다음 코드가 이에 대한 예제 코드입니다.

```python
class Stuff(object):

    def __init__(self, x, y):
        super(Stuff, self).__init__()
        self.x = x
        self.y = y
        print(f'__init__ with ({self.x},{self.y})')

    def __call__(self, x, y):
        self.x = x
        self.y = y
        print (f'__call__ with ({self.x},{self.y})')

    def __del__(self):
        del self.x
        del self.y

s = Stuff(1, 2)
# __init__ with (1,2)

s(7, 8)
# __call__ with (7,8)
```

---

- list를 정렬할때, 앞쪽에 위치한 몇몇 원소에 우선순위를 부여하여 정렬한다고 해봅시다. 지금까지 배운것으로는 sort에 들어가는 key인자에 함수를 전달하여 다음과 같이 구현할 수 있습니다.

    ```python
    def sort_priority(values, group):
        def helper(x):
            if x in group:
                return (0,x)
            return (1,x)
        values.sort(key=helper)

    numbers=[8,3,1,2,5,4,7,6]
    group = {2,3,5,7}
    sort_priority(numbers,group)
    print(numbers)
    # [2, 3, 5, 7, 1, 4, 6, 8]
    ```

    `sort_priority(values, group)` 함수가 정상적으로 작동하는데는 다음과 같은 이유가 있습니다.

    1. 파이썬에서는 클로저를 지원합니다. `helper(x)` 함수는 클로저로써, 자신의 영역밖에 정의된 변수 group에 접근할 수 있습니다.
    2. `values.sort(key=helper)` : 파이썬에서는 함수도 일급 시민(first-citizen) 객체입니다. 그래서 sort함수의 key의 인자로 helper 함수가 들어갈 수 있습니다.
    3. `sort()` 비교 하는 우선순위 : 두개의 튜플(시퀀스)을 비교한다고 했을때, 첫번째 원소가 같으면 두번째 원소를 기준으로 정렬합니다. c++에서도 같은 방식으로 정렬합니다.
- 그렇다면 위의 코드에서 우선순위를 부여 해야하는 group에 속해 있는 원소가 있는지 여부도 확인해보고 싶다고 하자.

    ```python
    def sort_priority2(numbers,group):
        found = False
        def helper(x):
            if x in group:
                found = True
                return(0,x)
            return (1,x)
        numbers.sort(key=helper)
        return found

    found = sort_priority2(numbers,group)
    print('found: ', found)
    print(numbers)
    # found:  False
    # [2, 3, 5, 7, 1, 4, 6, 8]
    ```

    하지만 위 코드의 출력처럼 정상작동 하지 않습니다. 이에 대한 이유는 다음과 같습니다.

    파이썬 인터프린터는 변수를 참조할때 다음순서로 영역을 탐색합다.

    1. 현재 함수의 영역
    2. 현재 함수를 둘러싼 영역
    3. 현재 코드가 들어있는 모듈의 영역 (global scope)
    4. 내장 영역(built-in scope) (len,str 내장 함수가 들어가 있는 영역)

    그리고 만약에 변수 대입을 할때, 현재 영역안에 변수가 정의되어 있지 않다면, 변수 대입을 변수 정의로 취급합니다. 즉 helper 함수안의 found는 새로운  변수입니다.

- 파이썬에선 클로저 밖으로 데이터를 끌어내는 `nonlocal`을 사용하여 이를 해결할 수 있습니다. `nonlocal` 의 한계점은 모듈 수준 영역까지 변수 이름을 찾아 올라가지 않는다는 것입니다. (클로저를 감싼 함수까지 탐색)

    ```python
    def sort_priority2(numbers,group):
        found = False
        def helper(x):
            nonlocal found
            if x in group:
                found = True
                return(0,x)
            return (1,x)
        numbers.sort(key=helper)
        return found

    found = sort_priority2(numbers,group)
    print('found: ', found)
    print(numbers)
    # found:  True
    # [2, 3, 5, 7, 1, 4, 6, 8]
    ```

- `nonlocal` 무은 대입할 데이터가 클로저 밖에 있어서 다른 영역에 속한다는 것을 알려줍니다. 함수가 길고 `nonlocal` 으로 지정한 변수와 대입이 이뤄지는 위치의 거리가 멀면 함수 동작을 이해하기 어렵습니다. 아래 코드를 사용하면 가독성이 더 좋고, `nonlocal`을 쓴 코드와 같은 결과를 출력합니다.

    ```python
    class Sorter:
        def __init__(self,group):
            self.group = group
            self.found = found

        def __call__(self,x):
            if x in self.group:
                self.found = True
                return (0,x)
            return (1,x)

    sorter = Sorter(group)
    numbers.sort(key=sorter)
    print(numbers)
    # [2, 3, 5, 7, 1, 4, 6, 8]
    print(sorter.found)
    # True
    ```
---
### reference

1. [closure 관련한 블로그 포스트](https://shoark7.github.io/programming/python/closure-in-python) : 파이썬 관련해서 예전부터 정말 많이 본 블로그 입니다.
