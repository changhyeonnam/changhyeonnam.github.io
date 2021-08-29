---
title: 복잡한 식(Complex expression)을 쓰는 대신 도우미 함수(Helper function)를 작성하라
Created: August 29, 2021 7:43 PM
tags:
    - Python
use_math: true
comments: true
---
### [Effective Python] Better way 05: 복잡한 식을 쓰는 대신 도우미 함수를 작성하라

- 파이썬 문법을 사용하면 아주 복잡하고 읽기 어려운 한 줄짜리 식을 쉽게 작성할 수 있다.
- 복잡한 식을 도우미 함수로 옮겨라. 특히 같은 로직을 반복해 사용할 때는 도우미 함수를 꼭 사용하라.
- 불 연산자 or나 and를 식에 사용하는 것보다 if/else 식을 쓰는 편이 더 가독성이 좋다.

---

먼저  여기서 사용한 `urllib.parse` 모듈과 `parse_qs`에 대해 간단한 설명을 하겠습니다.

`urllib.parse`은 URL(Uniform Resource Locator) 문자열을 구성 요소(주소 지정 체계, 네트워크 위치, 경로 등)로 분리하고, 구성 요소를 다시 URL 문자열로 결합하고, 'relative URL'을 주어진 'base URL'에 따라 'absoulte URL'로 변환하는 표준 인터페이스를 정의합니다. URL 구문 분석과 URL 인용(quoting)에 대한 함수들을 정의한다고 합니다.

`urllib.parse.parse_qs(qs, keep_blank_values=False ...)` : 주어진 string argument에 대한 query string을 parse 합니다. 데이터는 딕셔너리로 반환됩니다. 딕셔너리 키는 고유한 쿼리 변수 이름이고 값은 각 이름의 값 리스트입니다. argument 중 책에서 사용한 것에 대한 설명만 하겠습니다.

argument 중 keep_blank_values은 쿼리의 빈 값을 빈 문자열로 처리해야하는 지에 대한 flag 입니다. True인 경우, 빈 문자열로 유지하고, False라면 빈값이 무시됩니다.(전자인 경우 '', 후자는 None)

---

파이썬은 문법이 간결하여 상당한 로직이 들어가는 식도 한줄로 매우 쉽게 작성할 수 있다. 예를들어 URL의 쿼리 문자열을 파싱하고 싶다고 하자. 여기서 각 쿼리 문자열 파라미터는 정수값을 반환합니다.

```python
from urllib.parse import parse_qs

my_values = parse_qs('빨강=5&퍄량=0&초록=',keep_blank_values=True)
print(repr(my_values))
# {'빨강': ['5'], '퍄량': ['0'], '초록': ['']}
```

딕셔너리에 `get` 메서드를 사용하면 상황에 딸라 다른 값이 반환됩니다.

```python
print('빨강:',my_values.get('빨강'))
print('초록:',my_values.get('초록'))
print('투명도:',my_values.get('투명도'))
# 빨강: ['5']
# 초록: ['']
# 투명도: None
```

파라미터가 없거나 비어있을 경우 0이 디폴트 값으로 대입되게 해봅시다. 다음 코드에서는 빈 문자열, 빈 list, 0이 모두 암묵적으로  False로 평가된다는 사실을 이용합니다. 각 식은 왼쪽의 하위식이 False인 경우 모두 or 연산자의 오른쪽의 하위식 값으로 계산됩니다.

```python
# 질의 문자열이 '빨강=5&퍄량=0&초록='인 경우
red = my_values.get('빨강',[''])[0] or 0
green = my_values.get('초록',[''])[0] or 0
opacity = my_values.get('투명도',[''])[0] or 0
print(f'빨강: {red!r}')
print(f'초록: {green!r}')
print(f'투명도: {opacity!r}')
# 빨강: '5'
# 초록: 0
# 투명도: 0
```

빨강,초록인 경우 my_values 딕셔너리 안에 키가 있기 때문에 작동하고, 투명도인 경우 my_values 딕셔너리 안에 해당 키가 없기 때문에 `or` 오른쪽 값인 0이 출력됩니다. 하지만  이런 방식은 가독성이 않좋습니다. 또 각 파라미터를 정수로 변환하기 위해 int로 감싸게 되면  더 가독성이 떨어집니다. 이를 위해서 `if/else` 조건식을 사용할 수 있습니다.

```python
green_str = my_values.get('초록',[''])
if green_str[0]:
    green = int(green_str[0])
else:
    green = 0
```

이 로직을 반복 적용한다면, 다음과 같은 도우미 함수(helper function)를 작성해야 합니다.

```python
def get_first_int(values, key, default = 0):
    found = values.get(key,[''])
    if found[0]:
        return int(found[0])
    return default

green = get_first_int(my_values,'초록')
```

---

식이 복잡해지기 시작하면 바로 식을 더 작은 조각으로 나눠서 로직을 도우미 함수로 옮길지 고려해야 합니다. 코드를 짧게 쓰는 것보다 가독성을 좋게 하는 것이 더 가치 있습니다. 반복하하지 말라('Don't Repeat Yourself')는 뜻의 DRY 원칙을 따라야 합니다.
