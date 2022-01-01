---
title: for나 while 루프 뒤에 else 블록을 사용하지 말라
Created: September 4, 2021 10:25 PM
tags:
    - Python
use_math: true
comments: true
sitemap :
  changefreq : daily
  priority : 1.0
---
### [Effective Python] Better way 09: for나 while 루프 뒤에 else 블록을 사용하지 말라

- 파이썬은 for나 while 루프에 속한 블록 바로 뒤에 else 블록을 허용하는 특별한 문법을 제공한다.
- 루프 뒤에 오는 else 블록은 루프가 반복되는 도중에 break를 만나지 않는 경우에만 실행된다.
- 동작이 직관적이지 않고 혼동을 야기할 수 있으므로 루프 뒤에 else 블록을 사용하지 말라.

---

책 내용을 보기 전에 먼저 다음 링크를 먼저 봅시다. [link](https://stackoverflow.com/a/23748240/9194757) 에 대한 내용을 요약해보겠습니다.

`for ... else` 구조는 Donald Knuth에 의해 고안된것으로, `GOTO` 을 대체하기 위해 만들어졌다고 합니다. 그 당시에는 모든 `for`문에 `if`와 `GOTO`문이 들어갔고, 그것들은 `else`문을 필요로 했었다고 합니다. 뒤늦게 `for ... else` 의 `else`문은 `no break`이라고 불렸습니다.  그렇다면 `keyword`를 왜 바꾸지 않느냐고 물어보면, existing code를 바꾸는 것은 practical 면에서 destructive하기 때문입니다. 결론은, 그 당시에 `for .. else`문이 좋은 아이디어였고, 지금은 아니라는 것 입니다.

---

파이썬 에서는 루프가 반복 수행하는 내부 블록 다음에 else 블록을 추가할 수 있습니다.

```python
for i in range(3):
    print("Loop",i)
else:
    print('Else block!')
# Loop 0
# Loop 1
# Loop 2
# Else block!
```

else는 '이 블록 앞의 블록이 실행되지 않으면 이 블록을 실행하라'라는 뜻으로, try/except도 마찬가지로 '이 블록앞의 블록을 시도하다가 예외가 발생하면 이 블록을 실행하라'라는 뜻으로 사용 됩니다.

파이썬에서 else를 배운 프로그래머라면, for/else의 else 부분을 '루프가 정상적으로 완료되지 않으면 이 블록을 실행하라' 라는 뜻으로 가정기 쉽습니다. 하지만 실제 else 블록은 완전히 반대로 동작합니다. 루프 안에서 break문을 사용하면 else 블록이 실행되지 않습니다.

```python
for i in range(3):
    print("Loop",i)
    if i==1:
        break
else:
    print('Else block!')
# Loop 0
# Loop 1
```

루프의 조건이 처음부터 False인 경우(예를들어 빈 시퀀스에 대한 루프) else 블록이 바로 실행됩니다.

```python
for x in []:
    print('이 줄은 실행되지 않음')
else:     # no break
    print('For Else block!')
# For Else block!
```

이런 식으로 동작하는 이유는 루프를 사용해 검색을 수행할 경우, 루프 바로 뒤에 else 블록이 이와같이 동작해야 유용하기 때문입니다. 예를들어 다음과 같이 서로소인지 알아보고자 할때, else문이 필요합니다.

```python
a = 4
b = 9
for i in range(2,min(a,b)+1):
    print('검사 중',i)
    if a % i == 0 and b % i == 0:
        print('서로소 아님')
        break
else:   # no break
    print('서로소')
# 서로소
```

하지만 이런식으로 작성한는 것은 미래에 이 코드를 이해하려는 사람들(자신포함)이 느끼게 되는 부담이 큽니다. (가독성이 떨어진다는 소리) 따라서 루프 뒤에 else 블록을 사용하지 말아야 합니다.

그에 대한 해결책으로 helper fucntion을 (1) 조건을 만족하는 경우 바로 반환하는 함수 (2) 루프 안에서 원하는 대상을 찾았는지 나타내는 결과 변수 (두가지 방법 거의 비슷합니다.) 를 사용할 수 있습니다.
