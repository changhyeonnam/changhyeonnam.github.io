---
title: slicing 보다는 나머지를  모두 잡아내는 unpacking을 사용하라
Created: November 6, 2021 10:26 AM
tags:
    - Python
use_math: true
comments: true
---
### [Effective Python] Better way 13: slicing 보다는 나머지를  모두 잡아내는 unpacking을 사용하라

- 언패킹 대입에 별표식을 사용하면 대입되지 않는 모든 부분을 리스트에 잡아낼 수 있다.
- 슬라이싱과 인덱스보다 실수할 여지가 더 적다.

---

- 기본  언패킹의 한계는 언패킹할 시퀀스의 길이를 미리 알고 있어야 한다는 것이다.

    ```python
    car_ages =[0,9,4,5,2,3]
    car_ages_descending = sorted(car_ages,reverse=True)
    oldest,  second_oldest = car_ages_descending
    # Traceback (most recent call last):
    # ValueError: too many values to unpack (expected 2)
    ```

    위의 코드와 같이 언패킹만을 이용해서 앞의 두개 원소를 가져오려고 하면 에러가 발생한다.

- 처음 파이썬을 배운 사람들은 인덱스와 슬라이싱을 위와 같은 상황에 사용한다.

    ```python
    oldest = car_ages_descending[0]
    second_oldest = car_ages_descending[1]
    others = car_ages_descending[2:]
    print(oldest,second_oldest,others)
    # 9 5 [4, 3, 2, 0]
    ```

    하지만 가독성이 떨어진다. 그리고 이런식으로 원소를 여러 집합으로 나눌 시에 1 차이 나는 인덱스로 인한 오류(off-by-one error)가 발생할 수 있다.

- 그래서 파이썬에서는 별표식(starred expression)을 사용해 모든 값을 담는 언패킹을 할 수 있게 지원한다.

    ```python
    oldest, second_oldest, *others = car_ages_descending
    print(oldest,second_oldest,others)
    # 9 5 [4, 3, 2, 0]
    ```

- 별표식은 중간에 혹은 처음에 올 수있다.

    ```python
    oldest, *others,  youngest = car_ages_descending
    print(oldest,others,youngest)
    # 9 [5, 4, 3, 2] 0

    *others, second_youngest, youngest = car_ages_descending
    print(others,second_youngest,youngest)
    # [9, 5, 4, 3] 2 0
    ```

- 별표식이 포함된 언패킹 대입을 처리하려면 필수인 부분이 적어도 하나 필요하다.

    ```python
    *others = car_ages_descending
    # SyntaxError: starred assignment target must be in a list or tuple
    ```

- 또한 한 수준의 언패킹 패턴에서 별표식을 두 개 이상 사용할 수 없다.

    ```python
    first, *middle, *second_middle, last = car_ages_descending
    # SyntaxError: two starred expressions in assignment
    ```

- 하지만 여러 계층으로 이뤄진 구조를 언패킹할 때는 서로 다른 부분에 포함되는 한, 별표식을 여러번  사용해도 된다.

    ```python
    car_inventory = {'시내':('그랜저','아반떼','티코'), '공항':('제네시스 쿠페','소나타','K5','엑센트')}
    ((loc1,(best1,*rest1)),(loc2,(best2,*rest2))) = car_inventory.items()
    print(f'{loc1}에서 최고의 차는 {best1}, 나머지는 {rest1}')
    # 시내에서 최고의 차는 그랜저, 나머지는 ['아반떼', '티코']
    ```

- 별표식은 항상 list 인스턴스가 되므로, 시퀀스에 남는 원소가 없으면 별표 식 부분은 빈 리스트가 된다.

    ```python
    sort_list = [1,2]
    first,second, *rest = sort_list
    print(first,second,rest)
    # 1 2 []
    ```

    이런 특징은 원소가 최소 N개 들어 있다는 사실을 미리 아는 시퀀스를 처리할 때 편리하다.


- csv 파일을 생성하는 다음 코드가 있다고 하자. csv파일은 header와 row로 구성되어 있다.

    ```python
    def generate_csv():
        yield ('날짜', '제조사' , '모델', '연식', '가격')
        for i in range(100):
            yield ('2019-03-25', '현대', '소나타', '2010', '2400만원')
            yield ('2019-03-26', '기아', '프라이드', '2008', '1400만원')

    ```

    다음 제네레이이터의 결과를 별표식으로 언패킹하면 iterator의 내용 중에 첫번째(헤더)와 나머지를 쉽게 나눠서 처리할 수 있다.

    ```python
    it = generate_csv()
    header, *rows = it
    print('CSV 헤더:', header)
    print('행 수: ', len(rows))
    # CSV 헤더: ('날짜', '제조사', '모델', '연식', '가격')
    # 행 수:  200
    # CSV 헤더: ('날짜', '제조사', '모델', '연식', '가격')
    # 행 수:  200
    ```

    하지만 별표식은 항상 리스트를 만들어 내기 때문에 이터레이터를 별표식으로 언패킹하면 컴퓨터 메모리를 모두 다 사용해서 프로그램이 멈출 수 도 있다.
