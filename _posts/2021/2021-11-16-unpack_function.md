---
title: 함수가 여러값을 반환할때, 네개 이상 언패킹 하지 말라
Created: November 16, 2021 2:01 PM
tags:
    - Python
use_math: true
comments: true
---
### [Effective Python] Better way 19: 함수가 여러 값을 반환하는 경우 절대로 네 값 이상을 언패킹 하지 말라

- 함수가 여러값으르 반환하기 위해 값들을 튜플에 넣어서 반환하고, 호출하는 쪽에서 파이썬 언패킹 구문을 쓸수 있다.
- 함수가 반환한 여러 값을, 모든 값을 처리하는 별표식을 이용해 언패킹 할 수 있다.
- 언패킹 구문에 변수가 네개 이상 나오면 실수하기 쉬우므로 변수를 네개 이상 사용하면 안된다. 대신 작은 클래스를 반환하거나 nametuple 인스턴스를 반환하라.

---

- 언패킹을 사용하면 함수가 둘 이상의 값을 반환할 수 있습니다.

    ```python
    def get_stats(numbers):
        minimum = min(numbers)
        maximum = max(numbers)
        return minimum,maximum

    lengths = [63,73,72,60,67,66,71]
    minimum,maximum = get_stats(lengths)
    print(f'maximum:{maximum}, minimum:{minimum}')
    # maximum:73, minimum:60
    ```

    위 코드는 원소가 두개인 튜플에 값을 넣어 반환하는 방식으로 작동합니다.

- 여러 값을 한꺼번에 처리하는 별표 식을 사용해 여러값을 반환받을 수도 있습니다.

    ```python
    def get_avg_ratio(numbers):
        average = sum(numbers)/len(numbers)
        scaled = [x/average for x in numbers]
        scaled.sort(reverse=True)
        return scaled

    longest,*middle,shortest = get_avg_ratio(lengths)
    print(f'longest ratio:{longest:>4.0%}, shortest ratio:{shortest:>4.0%}')
    # longest ratio:108%, shortest ratio: 89%
    ```

    (>4.0 : align to right, minimum width is 4 character, don't show any precision 을 의미한다.)

    위 함수는 list를 반환하고, 별표식을 이용해 longest, shortest를 언패킹할 수 있습니다.

- 위 코드들의 기능을 확장하여 여러 통게를 반환함수를 보겠습니다.

    ```python
    def get_stats(numbers):
        minimum = min(numbers)
        maximum = max(numbers)
        count = len(numbers)
        average = sum(numbers)/count

        sorted_numbers = sorted(numbers)
        middle = count//2
        if count%2==0 :
            lower = sorted_numbers[middle-1]
            upper = sorted_numbers[middle]
            median = (lower+upper)/2
        else:
            median = sorted_numbers[middle]
        return minimum,maximum,average,median,count

    minimum,maximum,average,median,count = get_stats(lengths)
    print(f'min:{minimum}, max:{maximum}, avg:{average:.1f}')
    print(f'median:{median},count:{count}')
    # min:60, max:73, avg:67.4
    # median:67,count:7
    ```

     위 코드에는 두가지 문제가 있습니다. 첫번째로, 모든 반환 값이 수(number)이기 때문에 순서를 혼동하기 쉽습니다.

    ```python
    # 잘못쓴 경우
    minimum,average,maximum,median,count = get_stats(lengths)
    ```

    가령 위와 같이 언패킹 받는 순서를 잘못 작성하여 알아내기 어려운 버그를 만들 수 있습니다.

    두번째로 함수를 호출하는 부분과 반환값을 언패킹하는 부분이 길고, 여러가지 방법으로 줄을 바꿔 쓸수 있어서 가독성이 나빠집니다.

- 이런 문제를 피하려면 함수가 여러값을 반환할 경우 네개의 값 이상을 언패킹 하면 안됩니다. 많은 값을 언패킹해야 한다면 경량 클래스(light weight class)나 nametuple을 사용하면 됩니다. (이후 챕터에서 살펴볼 예정입니다.)
