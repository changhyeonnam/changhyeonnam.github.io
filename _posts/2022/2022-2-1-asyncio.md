---
title: How does asyncio work?(1)
Created: February 1, 2022 3:58 PM
tags:
    - Python
use_math: true
comments: true
sitemap :
  changefreq : daily
  priority : 1.0
---
다음 물음에 답하기 위해서는 다음 개념을 먼저 알아야 한다.

1. Generator
    1. generator.send & generator.throw
    2. yield from
2. Futures
3. Tasks

---

### Generator

- suspend the execution of a python function
- implement using `yield`
- function containing `yield`, we turn function in to `generator`

```python
def test():
    yield 1
    yield 2

gen = test()
print(type(gen))
print(next(gen))
print(next(gen))
print(next(gen))
# <class 'generator'>
# 1
# 2
# StopIteration
```

위에서 볼 수 있듯이, generator에 `next()`함수를 적용하면, `yield`된 값을 받는다. generator가 완료되면, StopIteration 예외가 던져진다.

### Communicating with a generator

`send()`, `throw()` method를 이용하여 generator와 communicate를 할 수 있다. [generator.send](https://docs.python.org/3/reference/expressions.html#generator.send)

다음 공식문서를 보면 더 잘 이해 할 수 있다. generator.send(value)로 전달되는 argument의 값은 현재 yield expression의 결과가 되고, generator 로부터 yield되는 다음 값을 반환한다. `generator.throw(type,value)`는 generator안에서 전달된 type의 exception이 Raise되게 해준다.

```python
def test():
    val = yield 1
    print(val)
    yield 2
    yield 3

gen = test()
print(next(gen))
print(gen.send('abc'))
print(next(gen))
print(gen.throw(Exception('!')))
# 1
# abc
# 2
# 3
# Exception: !
```

### Returning values from generators

generator로부터 StopIteration이 발생하고 나서, exception으로 부터 함수의 return값을 recover할 수 있다.

```python
def test():
    yield 1
    return 'abc'
gen = test()
print(next(gen))
# 1

try:
    next(gen)
except StopIteration as exc:
    print(exc.value)
# abc
```

### yield from

python 3.4에서 추가된 새로운 keyword yield from을 이용하여, next(), send(), throw()로 전달된 것을 inner-most nested generator로 전달한다. inner generator가 어떤 값을 반환한다면, yield from의 반환값이 된다.

```python
def inner():
    inner_result = yield 2
    print('inner', inner_result)
    return 3
def outer():
    yield 1
    val = yield from inner()
    print('other',val)
    yield 4
gen = outer()
print(next(gen))
print(next(gen))
print(gen.send('abc'))
# 1
# 2
# inner abc
# other 3
# 4
```

yield from을 이용하면 generator 안에 generator를 만들 수 있고, 또한 yield from keyword가 있는 부분을 터널과 같이 사용하여 data를 앞뒤로 (inner-most to outer-most generators) 전달할 수 있다.

### Coroutine

실행중에 멈추거나 다시 실행될 수있는 function을 coroutine이라고 한다. Python에서는 `async def` 를 이용하여 이를 정의한다. generator와 많이 유사한데, yield from과 같은 동작을 하는 await 이라는 keyword가 있다. 아래 코드와 같이 `await`은 `yield from`과 동일하게 작성된다.

```python
async def inner():
    return 1
async def outer():
    await inner()
```

모든 iterator와 generator가 `__iter__()` 으로 구현되는 것과 유사하게, 모든 coroutine들은 `__await__()` 으로 구현되고, `await coro` 가 call될 때 마다, continue하게 해준다. coroutine 함수들과 별개로 asyncio에대한 두가지 object (1) futures (2) tasks를 알아야 한다.

### Futures

Futures object들은 `__await__()`가 내부에 구현되어 있고, 특정한 state와 result를 hold한다. state들은 다음과 같다.

1. Pending : future does not have any result or exception set.
2. Cancelled : future was cancelled using `fut.cancel()`
3. Finished : future was finished, either by a result set using `fut.set_result()` or by an exception set using `fut.set_exception()`

Futures object이 유지하고 있는 result는 어떠한 python object일 수도 있고, exception일 수도 있다.

future object의 중요한 feature 중 하나는, [add_done_callback()](https://docs.python.org/3/library/asyncio-task.html#asyncio.Future.add_done_callback) 이라는 method를 갖고 있다는 것이다. 이 method는 future object이 finish 혹은 exception이 raise될때, call된다.

### Tasks

task object들은 coroutine 함수들을 wrap하는 special future object으로, inner-most, outer-most coroutine들과 communicate한다. coroutine이 future를 await할 때마다, task로 future이 pass back 되고, task가 그것을 받는다. 그 다음 task는 `add_done_callback()`을 call하여 자신과 future를 bind한다.

### Asyncio

이제 본격적으로 Asyncio에 대해 알아보자. asyncio에 대해서 이해하려면 event loop을 이해해야 한다. event loop은 tasks가 준비되었을때 마다 call된다. IO part of event loop은  [select](https://docs.python.org/3/library/select.html#module-select) 라는  함수로 구현되어 있다. select은 blocking function으로, 소켓으로 데이터가 오거나 나갈때 기다리게 해준다. data를 받을때는, wake up되어 데이터를 받은 socket을 반환한다. 또는 write을 하기 위해 준비가 된 socket을 반환 받는다.

ayncio를 통해 socket으로 데이터를 보내거나 받을때, 실제로 일어나는 일은, socket이 먼저 즉시 read or sent될 data가 있는지 확인한다. `send.()` buffer가 full이거나 `.recv()` buffer가 비여있다면, 해당 socket이 select의해 등록된다. (recv를 위한 rlist 혹은 send를 위한 wlist에 추가하는 것에 의해 등록된다.)  await 함수가 future object을 새로 만들어 socket과 tie한다.

모든 available task들이 future object를 wait하고 있을때, event loop은 select함수를 call하고 wait한다. socket 중 하나에 들어오는 데이터가 있거나 send buffer가 비여있다면, asyncio가 해당 socket과 tie하기 위해 future object을 확인하고, tie한다.

future object이 tie되면, 해당 task가 `add_done_callback()`이 호출되기 전에 리스트에 추가되어, inner-most coroutine을 다시 시작하는 coroutine에 `.send()`를 call한다. 그리고 새로운 데이터를 읽게 된다.

Method chain again, in case of `recv()`

1. `select.select` waits.
2. A ready socket, with data is returned.
3. Data from the socket is moved into a buffer.
4. `future.set_result()` is called.
5. Task that added itself with `add_done_callback()` is now woken up.
6. Task calls `.send()` on the coroutine which goes all the way into the inner-most coroutine and wakes it up.
7. Data is being read from the buffer and returned to our humble user.

asyncio에 대해 정리하면 다음과 같다.

asyncio는 function을 pause, resume하기 위해 generator를 사용한다. inner-most generator에서 outer-most로 data를 보내고 받기 위해 `yield from` 을 사용한다. IO가 complete할때 까지 기다리는 동안 function execution을 멈추기 위해 이러한 것들을 사용한다. asyncio를 이용하여 function이 멈췄을때, 다른 함수를 interleave되게 하면된다.

## Why use asyncio instead of multithreading in Python?

- threading을 사용할때, thread-safe한 코드를 작성하는 것은 매우 어렵다. asynio를 이용하면, 어디서 task간에 shift가 이뤄지는지 알수 있고, race condition을 다루기도 훨씬 쉽다.
- 또한 thread는 각 thread가 각각의 stack을 갖기 때문에 많은 양의 메모리를 소비한다. asyncio 에서의 모든 code는 하나의 같은 stack을 공유한다.

---

### reference

1. [stackoverflow: How does asyncio actually work?](https://stackoverflow.com/questions/49005651/how-does-asyncio-actually-work/51116910#51116910)
2. [Python docs: Future.add_done_callback](https://docs.python.org/3/library/asyncio-task.html#asyncio.Future.add_done_callback)
3. [Python docs: generator.send](https://docs.python.org/3/reference/expressions.html#generator.send)

> stackoverflow 질문의 답변을 토대로 작성한 글이다. 각기 다른 답변에서 여러 관점으로 asyncio에 대해 설명하고 있다. 마지막에서 두번째로 답한 답변을 읽어 보았더니, async/await과 asyncio를 분리하여 설명하고 있다. 추후에 정리하여 업로드할 예정이다.
>
