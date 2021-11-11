---
title: 원소가 없는  경우를 처리할 때 defaultdict을 사용하라
Created: November 10, 2021 12:46 PM
tags:
    - Python
use_math: true
comments: true
---

### [Effective Python] Better way 17:  내부 상태에서 원소가 없는 경우를 처리할 때는 setdefault보다 defaultdict을 사용하라.

- 키로 어떤 값이 들어올지 모르는 딕셔너리를 관리해야 할때 collections 내장 모듈에 있는 defaultdict 인스턴스를 사용하는게 좋다.

---

- Better way 16에서 키가 없는 경우를 처리하는 방법을 여러가지 배웠고, get메서드가 가장 좋은 방법이라고 했습니다. 그런데 이 챕터에선 setdefault가 다음 코드처럼 더 짧게 , 간결하게 쓸수 있으니 고려해보라고합니다.(띠용..?)

    ```python
    visits = {
        '미국':{'뉴욕','로스엔젤레스'},
        '일본':{'하코네'}
    }

    visits.setdefault('프랑스',set()).add('칸')

    if(japan := visits.get('일본')) is None:
        visits['일본']=japan=set()
    japan.add('교토')
    print(visits)
    # {'미국': {'뉴욕', '로스엔젤레스'}, '일본': {'하코네', '교토'}, '프랑스': {'칸'}}
    ```

- setdefault의 이름의 모호함을 감추기 위해 다음과 같이 class를 작성할 수 있습니다.

    ```python
    class Visits:
        def __init__(self):
            self.data = {}
        def add(self,country,city):
            city_set = self.data.setdefault(country,set())
            city_set.add(city)

    visits = Visits()
    visits.add('러시아','모스크바')
    visits.add('탄자니아','잔지바르')
    visits.add('러시아','스바시바')
    print(visits.data)
    # {'러시아': {'모스크바', '스바시바'}, '탄자니아': {'잔지바르'}}
    ```

    하지만 data에 딕셔너리가 있든 없든 관게없이 호출될때 마다 새로 set 인스턴스를 만들기 때문에 효율적이지 않습니다.

- collections 내장 모듈에 있는 defaultdict 클래스는 키가 없을때 자동으로 디폴트 값을 저장해서 이런 용법을 간단히 처리할 수 있습니다.

    ```python
    from collections import defaultdict

    class Visits:
        def __init__(self):
            self.data  = defaultdict(set)
        def add(self,country,city):
            self.data[country].add(city)
    visits = Visits()
    visits.add('러시아','모스크바')
    visits.add('탄자니아','잔지바르')
    print(visits.data)
    # defaultdict(<class 'set'>, {'러시아': {'모스크바'}})
    ```

    add코드는 data 딕셔너리에 있는 키에 접근하면 항상 기존 set 인스턴스가 반환됩니다. add 메서드가 아주많이 호출되면 집합생성에 따른 비용도 커지는데, 이 구현에서 불필요한 set이 만들어지는 경우가 없습니다.

    setdefault는 class의 add 메서드에 포함되어 있어서, add할때 마다 호출되게 됩니다.

    ---

    다음 [링크](https://stackoverflow.com/questions/38625608/setdefault-vs-defaultdict-performance)를 참고하여 setdefault와 defaultdict의 permformance차이와 언제 쓰는지 알수 있었습니다.

    > It would make sense that `defaultdict` is faster that `dict.setdefault()` since the former sets its default for the entire dict at creation time, whereas setdefault() does it per element when it is read. One reason to use setdefault is when the default you assign is based on the key (or something) rather than a generic default for the entire dict.
    >

    defaultdict은 dict을 만들때 한번 set되고, setdefault()는 원소를 읽을 때마다 default를 set한다고 합니다.
