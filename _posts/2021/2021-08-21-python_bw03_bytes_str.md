---
title: Bytes와 str의 차이
layout: post
Created: August 21, 2021 2:33 PM
tags:
    - Python
use_math: true
comments: true
---
### Better way 03 : bytes와 str의 차이를 알아두라

> 파이썬에서는 데이터 시퀀스는 str과 bytes으로 표현이 가능합니다. str과 bytes 시퀀스는 서로 호환되지 않고, 파일 핸들과 관련하여 파라미터를 다르게 줘야 정상작동하기 때문에 오류가 발생할 수 있습니다.
---

파이썬에는 문자열 데이터의 시퀀스를 표현하는  두가지 타입이 있습니다. 바로 (1) bytes (2) str 입니다.

bytes 타입의 인스턴스에는 부호가 없는  8바이트 데이터가 그대로 들어 갑니다. ( ASCII 인코딩을 사용해 내부 문자를 표시한다.)

```python
a = b'h\x65llo'
print(list(a))
print(a)
# [104, 101, 108, 108, 111]
# b'hello
```

str 인스턴스에는 사람이 사용하는 언어의 문자를 표현하는 유니코드 code point가 들어가 있습니다.

```python
a='a\u0300 propos'
print(list(a))
print(a)
# ['a', '̀', ' ', 'p', 'r', 'o', 'p', 'o', 's']
# à propos
```

> unicode의 code point란 유니코드 표 내에서 문자에 할당한 숫자 값을 의미합니다. (추가적으로 코드포인트에 대해 바이트를 나누는 단위를 코드 유닛이라고 합니다.)

중요한 것은 str 인스턴스에 직접 대응되는 이진 인코딩이 없고, bytes에 직접 대응되는 텍스트 인코딩이 없습니다.  그래서  str을 이진 데이터로 바꾸기 위해서는 str의  encode 메서드 호출하고, 이진 데이터를 유니코드 데이터로 변환하기 위해서는 bytes의 decode 메서드를 호출해야 합니다. 인코딩 방식에 대해서는 명시적으로 지정할 수 있고, 시스템 디폴트 인코딩은 UTF-8입니다. (UTF-8에서는 코드 유닛을 1바이트(8비트)로 봅니다. 한글은 보통 초성,중성,종성 각각에 1바이트를 할당)

---

파이썬 프로그램을 작성할 때, 유니코드 데이터를 인코딩 하거나 디코딩하는 부분을 인터페이스의 가장 먼 경계지점에 위치시켜야 합니다.  이런 방식을 유니코드 샌드위치라고 부릅니다.

문자를 표현하는 타입이 둘로 나뉘어 있기 때문에 파이썬 코드에서는 다음과 같은  두가지 상황이 자주 발생합니다.

- UTF-8 (또는 다른 인코딩 방식)로 인코딩된 8비트 시퀀스를 그대로  사용하고 싶다.
- 특정 인코딩을 지정하지 않은 유니코드의 문자열을 사용하고 싶다.

두 경우를  변환해주고 입력 값이 코드가 원하는 값과 일치하는지 확신하기 위해 종종 두가지 도우미 함수가 필요합니다.

첫번째 함수로,  bytes나 str 인스턴스를 받아서 항상 str를 반환한다.

```python
def to_str(bytes_or_str):
    if isinstance(bytes_or_str,bytes):
        value = bytes_or_str.decode('utf-8')
    else:
        value = bytes_or_str
    return value # str 인스턴스
print(repr(to_str(b'foo')))
print(repr(to_str('bar')))
print(repr(to_str(b'\xed\x95\x9c')))
# 'foo'
# 'bar'
# '한'
```

두번째 함수로, bytes나 str 인스턴스를 받아서 항상 bytes를 반환한다.

```python
def to_bytes(bytes_or_str):
    if(isinstance(bytes_or_str,str)):
        value = bytes_or_str.encode('utf-8')
    else:
        value = bytes_or_str
    return value # bytes 인스턴스

print(repr(to_bytes(b'foo')))
print(repr(to_bytes('bar')))
print(repr(to_bytes('한글')))
# b'foo'
# b'bar'
# b'\xed\x95\x9c\xea\xb8\x80'
```

---

다음은 이진 8비트 값과 유니코드 문자열을 파이썬에서 다룰 때 꼭 기억애햐하는 두가지 문제점 입니다.

첫 번째 문제점은 bytes와 str이 똑같이 작동하는 것처럼 보이지만  각각의  인스턴스는 서로 호환되지 않기 때문에 전달 중인 문자 시퀀스가 어떤 타입인지 항상 잘 알고 있어야 합니다.

```python
print(b'one'+b'two')
# b'onetwo'
print('one'+'two')
# onetwo
print(b'one'+two)
# Trackback.. NameError: name 'two' is not defined

assert b'red' > b'blue'
assert 'red' > 'blue'
assert 'red' > b'blue'
# Trackback.. TypeError: '>' not supported between instances of 'str' and 'bytes'

print(b'foo'=='foo')
#False
print(b'red %s' % b'blue')
#b'red blue'
print('red %s' % 'blue')
#red blue
print(b'red %s' % 'blue')
# Trackback.. TypeError: %b requires a bytes-like object, or an object that implements __bytes__, not 'str'

print('red %s' % b'blue')
#red b'blue'
# b'blue' is not expected.
```

위의 예시가 str과 bytes이 서로 호환되지 않아 생기는 문제점입니다. str과 bytes에 대해 '+' 연산이 불가능하고, 비교 연산자 '>'를 사용할 수 없고, 같은지 비교 '='하면 항상 false가 나오고, '%'(format string) 연산자 에 대해서 정상적으로 작동하지 않습니다.

두번째 문제점은 파일 핸들과 관련한 연산들이 디폴트로 유니코드 문자열을 요구하고, 이진 바이트 문자열을 요구하지 않습니다.

```python
with open('data.bin','w') as f:
    f.write(b'\xf1\xf2\xf3\xf4\xf5')
# Trackback.. TypeError: write() argument must be str, not bytes
```

위와 같이 이진 쓰기 모드('wb')가 아닌 텍스트 쓰기 모드('w')로 열었다면 예외가 발생 합니다. 텍스트 모드인 경우, 유니코드 데이터가 들어있는 str 인스턴스를 요구합니다.

```python
with open('data.bin','r') as f:
    data = f.read()
# Trackback.. UnicodeDecodeError: 'utf-8' codec can't decode byte 0xf1 in position 0: invalid continuation byte
```

파일에서 데이터를 읽을 때도 비슷한 문제가 발생할 수 있습니다. 파일을 열때 이진 읽기 모드 ('rb')가 아닌 텍스트 읽기 모드 ('r')로 열었기 때문입니다.

핸들이 텍스트 모드에 있으면 시스템의 디폴트 텍스트 인코딩을 bytes.encode(쓰기의 경우), str.decode(읽기의 경우)에 적용해서 이진 데이터를 분석하고, 대부분의 시스템의 디폴트 인코디은 UTF-8이고, 이진 데이터를 받아 들일수 없습니다.

```python
with open('data.bin','r',encoding='cp1252') as f:
    data = f.read()
```

다른 방법으로, open 함수의 encoding 파라미터를 명시하면 예외가 발생하지 않습니다.

이와 같이 디폴트 인코딩이 의심스러운 경우에는 명시적으로 open에 encoding 파라미터를 전달해야 합니다.
