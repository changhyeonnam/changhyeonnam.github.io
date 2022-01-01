---
title: None을 반환하기보다는 예외를 발생시켜라
Created: November 17, 2021 4:52 PM
tags:
    - Python
use_math: true
comments: true
sitemap :
  changefreq : daily
  priority : 1.0
---
### [Effective Python] Better way 20: None을 반환하기보다는 예외를 발생시켜라.

- 특별한 의미를 표시하는 None을 반환하는 함수를 사용하면 None과 다른 값이 조건문에서 False로 평가될 수 있기 때문에 실수할 가능성이 있다.
- 특별한 상황을 표현하기 위해 None을 반환하는 대신 예외를 발생시키는 것이 좋습니다.

---

- 파이썬 프로그래머들은 유틸리티 함수 (계산 및 처리를 해주는 함수)를 작성할 때 반환값으로 None으로 하면서 이 값에 특별한 의미를 부여하려는 경향을 나타냅니다. 다음과 같이 ZeroDivisionError에 대해 None을 반환하는 코드입니다.

    ```python
    def careful_divdie(a,b):
        try:
            return a/b
        except ZeroDivisionError:
            return None

    x,y = 1,0
    result = careful_divdie(x,y)
    if result is None :
        print('input error')
    # input error
    ```

- 위의 if문에서 None인지 검사하는 대신 False인지 검사하는 코드가 있다고 해봅시다.

    ```python
    x,y = 0,5
    result = careful_divdie(x,y)
    if not result:
        print('input error')
    # input error
    ```

    False와 동등한 반환값을 잘못 해석하는 경우는 None이 특별한 의미를 가지는 파이썬 코드에서 흔히 저지르는 실수입니다.

- 이런 문제에 대해 가독성을 높이고, 실수를 줄이는 첫번째 방법은 에러 유무에 대한 값과 계산값을 tuple로 반환하는 방법입니다.

    ```python
    def careful_divide(a,b):
        try:
            return True,a/b
        except ZeroDivisionError:
            return False,None
    x,y = 0,5
    success,result = careful_divide(x,y)
    if not success:
        print('input error')
    ```

- 더 나은 두번째 방법은 None을 반환하지 않고, ZeroDivisionError가 발생한 경우 이를 ValueError로 바꿔 호출한 쪽에 입력값이 잘못됬음을 알리는 방법입니다.

    ```python
    def careful_divide(a,b):
        try:
            return a/b
        except ZeroDivisionError as e:
            raise ValueError('input error')

    x,y =5,2
    try:
        result = careful_divide(x,y)
    except ValueError:
        print('input error')
    # 결과 2.5
    ```

- 위 접근방법을 type annotation을 사용하는 코드에도 적용할 수 있습니다. 파이썬의 점진적 타입 지정(gradual typing)에서는 호출자가 어떤 Exception을 잡아내야 할지 결정할 때 문서를 참조할것을 예상하고, 발생시키는 예외를 문서에 명시하는 것이 해야합니다.

    ```python
    def careful_divide(a: float, b:float)->float:
        """
        :param a:numerator
        :param b:denominator
        :return: a/b

        Raise :
            ValueError : ZeroDivisionError
        """
        try:
            return a/b
        except ZeroDivisionError as e:
            raise ValueError('input error')
    ```


---

Gradual typing이라는 것을 처음들어봐서 찾아보았고, 다음에 한번 정리해서 포스트를 올려야겠다.

1. [https://wphomes.soic.indiana.edu/jsiek/what-is-gradual-typing/](https://wphomes.soic.indiana.edu/jsiek/what-is-gradual-typing/) : gradual typing을 만든 사람이 쓴 post
2. [https://www.python.org/dev/peps/pep-0483/#summary-of-gradual-typing](https://www.python.org/dev/peps/pep-0483/#summary-of-gradual-typing) : type hint와 관련된 공식문서
