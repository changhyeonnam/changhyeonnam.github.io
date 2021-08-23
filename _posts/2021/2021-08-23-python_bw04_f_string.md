# C style string format과 f-string interpolation

Created: August 22, 2021 5:44 PM

### [Effective Python] Better way 04: C 스타일 형식 문자열을 str.format과 쓰기보다는 f - string을 통한 interpolation 사용하라.

---

파이썬 코드에서는 문자열을 많이 사용합니다.

- 사용자 인터페이스 또는 명령 유틸리티에 메세지 표시
- 파일과 소켓에 데이터 쓰기
- 어떤일이 잘못되었는지 Exception에 자세히 기록할때  문자열 사용. (Better way 27)
- 디버깅 할 때도 사용한다. (Better way 80)

---

####형식화(fomatting)

미리 정의된 문자열에 데이터 값을 끼워 넣어서 사람이 보기 좋은 문자열로 저장하는 과정입니다. 파이썬의 내장된 기능과 표준 라이브러리를 통해 4가지 방식으로 형식화가 가능합니다. (나머지 하나 빼고는 단점이  존재)

1. **형식 문자열** : 가장 일반적인 방법으로, % 형식화 연산자를 사용하는 것이다. C와 동일하게 사용된다.

    ```cpp
    a = 0b10111011
    b = 0xc5f
    print('이진수: %d, 십진수: %d'%(a,b))
    # 이진수: 187, 십진수: 3167
    ```

    % 왼쪽에 들어가는 미리 정의된 텍스트를 **형식  문자열**이라고 합니다. C에서 제공하는 형식 문자열의 대부분 기능을 파이썬에서 제공합니다. (소수점 위치, 패딩, 좌우 정렬 등)

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

        이런 문제를 해결하기 위해 파이썬의 %연산자에는 튜플 대신 딕셔너리를 사용하는 형식화 기능이 추가 되었습니다. 순서를 바꿔도 정상작동 하므로 첫번째 문제점 또한, 해결했습니다.

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

2. **내장 함수 format과 str.format**

내일 이어서 !
