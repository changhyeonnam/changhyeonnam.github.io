---
title: 스프링 입문 | 회원 관리 예제 - 백엔드 개발
layout: post
Created: May 18, 2022 11:16 PM
tags:
    - java
    - spring boot
use_math: true
comments: true
sitemap :
  changefreq : daily
  priority : 1.0
---
> 스프링 입문 - 코드로 배우는 스프링 부트, 웹 MVC, DB 접근 기술 김영한 님 강의를 기반으로 하였습니다.
[TL;DR] 회원가입에 필요한 기본적인 서비스 비즈니스 로직, Controller, 리포지터리에 대해 배웁니다. 그리고 @AfterEach, @BeforeEach 통해 테스트 시 메모리 초기화를 하는 등 기초적인 TDD에 대해 배웁니다.
>

1. 비즈니스 요구사항 정리
2. 회원 도메인과 리포지터리 (객체) 만들기 : 회원 도메인을 저장하고 불러올 수 있는 리포지터리 객체.
3. 회원 리포지터리 testcase 작성 : 리포지터리 정상 동작하는지 testcase.
4. 회원 서비스 개발 : 비즈니스 로직
5. 회원 서비스 테스트 : Junit이라는 test framework 사용.

### 비즈니스 요구사항 정리

- 데이터 : 회원 ID, 이름
- 기능 : 회원등록, 조회
- 아직 데이터 저장소가 선정되 않음 (가상의 시나리오) : 스프링의 특성을 더 잘 보여주기 위하여.

### 일반적인 웹 어플리케이션 계층 구조

![Untitled](https://i.imgur.com/jPuGBg7.png)
일반적인 웹 어플리케이션은 (1) 컨틀로러, (2) 서비스, (3) 리포지토리, (4) 도메인 객체 (5) DB로 이뤄진다.

- 컨트롤러: 웹 MVC의 컨트롤러 역할
- 서비스: 핵심 비즈니스 로직 구현 예) 아이디 중복 안되게. 비즈니스 도메인 객체를 이용하여 핵심 비즈니스 로직이 동작하도록 구현한 계층.
- 리포지토리: 데이터베이스에 접근, 도메인 객체를 DB에 저장하고 관리
- 도메인: 비즈니스 도메인 객체, 예) 회원, 주문, 쿠폰 등등 주로 데이터베이스에 저장하고 관리되는 비즈니스 도메인 객체.

### 클래스 의존관계

![Untitled 1](https://i.imgur.com/ZYYCQoD.png)
- MemberService : 회원 비즈니스 객체에는 회원 서비스.
- MemberRepository : 회원을 저장하는 것은 interface로 설계. → 아직 데이터베이스가 선정되지 않음.
- 아직 데이터 저장소가 선정되지 않아서, 우선 인터페이스로 구현 클래스를 변경할 수 있도록 설계.
- 데이터 저장소는 RDB, NoSQL 등등 다양한 저장소를 고민중인 상황으로 가정 → 바꿔 끼우기 위해서는 interface가 필요함.
- 개발을 진행하기 위해서 초기 개발 단계에서는 구현체로 가벼운 메모리 기반의 데이터 저장소 사용

---

### 회원 도메인과 리포지터리 만들기

**회원 객체**

```java
package hello.hellospring.domain;

public class Member {

    private Long id;
    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
```

**회원 리포지토리 인터페이스**

```java
package hello.hellospring.repository;

import hello.hellospring.domain.Member;

import java.util.List;
import java.util.Optional;

public interface MemberRepository {
    Member save(Member member);
    Optional<Member> findById(Long id);
    Optional<Member> findByNames(String name);
    // Optional -> Null을 반환하는 것 대신, Optional로 감싸서 반환함.
    List<Member> findAll();
}
```

**회원 리포지토리 메모리 구현체**

```java
package hello.hellospring.repository;

import hello.hellospring.domain.Member;

import java.util.*;

public class MemoryMemberRepository implements MemberRepository{

    // 실무에서 공유되는 변수일 경우 동시성 문제때문에,
    // AtomicLong or ConcurrentHashmap를 써야함.
    private static Map<Long, Member> store = new HashMap<>();
    private static long sequence = 0L;

    @Override
    public Member save(Member member) {
        member.setId(++sequence);
        store.put(member.getId(),member);
        // id는 시스템이 정해주는 (++sequence값)
        return member;
    }

    @Override
    public Optional<Member> findById(Long id) {
        // Null이 반환될 가능성이 있으므로, Optional로 감쌈.
        return Optional.ofNullable(store.get(id));
    }

    @Override
    public Optional<Member> findByNames(String name) {
        // lambda function
        return store.values().stream()
                .filter(member -> member.getName().equals(name))
                .findAny();
    }

    @Override
    public List<Member> findAll() {
        // member들이 반환된다.
        return new ArrayList<>(store.values());
    }
}
```

### 회원 리포지토리 테스트케이스 작성

작성한 repository 구현체에 대해 검증하는 방법이 testcase를 작성하는 것이다. 코드로 코드를 검증하는 것이다. 테스트케이스 이전에는 자바 main 메서드를 통해서 실행하거나, 웹 어플리케이션의 컨트롤러를 통해서 해당 기능을 실행한다. 이런 방법은 실행하는데 오래 걸리고, 반복 실행하기 어렵고, 여러 테스트를 한번에 실행하기 어렵다. 그래서 자바에서는 JUnit이라는 프레임워크를 사용하여 testcode를 작성하여 실행한다.

**회원 리포지토리 메모리 구현체 테스트**

```java
package hello.hellospring.repository;

import hello.hellospring.domain.Member;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;

// static import
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;

class MemoryMemberRepositoryTest {

    MemberRepository respository = new MemoryMemberRepository();

    @Test
    public void save(){
        Member member = new Member();
        member.setName("spring");

        respository.save(member);

        Member result = respository.findById(member.getId()).get();
//        System.out.println("result = "+(result==member));
//        Assertions.assertEquals(member,result);
//        Assertions.assertEquals(member,null); // 오류
        assertThat(member).isEqualTo(result); // 가독성이 더 좋다.
    }

    @Test
    public void findByName(){
        Member member1 = new Member();
        member1.setName("spring1");
        respository.save(member1);

        Member member2 = new Member();
        member2.setName("spring2");
        respository.save(member2);

        Member result = respository.findByNames("spring1").get();

        assertThat(result).isEqualTo(member1);
    }

    @Test
    public void findAll(){
        Member member1 = new Member();
        member1.setName("spring1");
        respository.save(member1);

        Member member2 = new Member();
        member2.setName("spring2");
        respository.save(member2);

        List<Member> result = respository.findAll();
        assertThat(result.size()).isEqualTo(2);
    }

}
```

이거 testcase 3개다 같이 돌리면 에러가 생김. testcase 동작 순서가 보장이 되지 않는다.(순서에 의존적으로 설계하면 안된다.)  finaAll()이 먼저 실행됨. findByName에서 finaAll에서 만든 객체가 나와버림. 그래서 Test가 하나 끝나고 나오면 데이터를 clear해줘야 한다.

```java
@AfterEach
public void afterEach(){
    repository.clearStore();
}
```

- @AfterEach : 한번에 여러 테스트를 실행하면 메모리 DB에 직전 테스트의 결과가 남을 수 있다. 이렇게
되면 다음 이전 테스트 때문에 다음 테스트가 실패할 가능성이 있다. @AfterEach 를 사용하면 각 테스트가
종료될 때 마다 이 기능을 실행한다. 여기서는 메모리 DB에 저장된 데이터를 삭제한다.
- 테스트는 각각 독립적으로 실행되어야 한다. 테스트 순서에 의존관계가 있는 것은 좋은 테스트가 아니다.
- 먼저 MemoryMemberRepository를 다 만든 다음 Test를 작성했다. Testcase를 먼저 작성한 다음에 MemoryMemberRepository를 작성할 수도 있다. 순서를 뒤집는 것이 TDD(Test-Driven-Development)이다.

---

### 회원 서비스 개발

서비스 클래스는 비즈니스에 가까운 용어를 사용해야 함. (ex. join) 리포지터리는 서비스 보다는 개발스럽게 네이밍을 함.

**회원 가입 (중복 아이디 검증)**

```java
/**
 * 회원 가입
 */
public Long join(Member member) {
    // 같은 이름이 있는 중복 회원 X

    validateDuplicateMember(member); // 중복 회원 검증.
    memberRepository.save(member);
    return member.getId();
}

private void validateDuplicateMember(Member member) {
    // Optional<Member> result = memberRepository.findByNames(member.getName());
    // Optional -> null 반환할 가능성 있으면 감싸서 사용.
    // Optional 사용하므로 ifPresent같은 것 사용할 수 있다.
    // default가 optional. 단축키 : ctrl+t(refactoring과 관련된 코드)
    memberRepository.findByNames(member.getName())
            .ifPresent(m -> {
                throw new IllegalStateException("이미 존재하는 회원입니다.");
            });
}
```

**전체 회원 조회**

```java
/**
 * 전체 회원 조회
 */
public List<Member> findMembers() {
    return memberRepository.findAll();
}

public Optional<Member> findOne(Long memberId){
    return memberRepository.findById(memberId);
}
```

---

### 회원 서비스 테스트

`MemberService` class에 대해 command+shift+t → JUnit 바로 생성 가능. 테스트코드는 한국어로 적어도 된다. 테스트 코드를 적을 때, given-when-then 문법을 권장한다. (무엇이 주어졌고(데이터), 이럴때(검증 해야하는것), 이게 나와야해!.(기대되는 결과))

```java
@Test
void 회원가입() { // 회원 가입
    // given
    Member member = new Member();
    member.setName("hello");

    // when
    Long saveId = memberService.join(member);

    //then
    Member findMember = memberService.findOne(saveId).get();
    Assertions.assertThat(member.getName()).isEqualTo(findMember.getName());
}
```

정상 flow도 중요하지만, 예외 flow가 훨씬 더 중요하다. join의 핵심은 저장이 되는 것도 중요하지만, 중복 회원 검증 로직의 정상 작동하여 예외가 나오지도 봐야한다.

```java
@Test
public void 중복_회원_예외(){
    // given
    Member member1 = new Member();
    member1.setName("spring");

    Member member2 = new Member();
    member2.setName("spring");

    // when
    memberService.join(member1);
    IllegalStateException e = assertThrows(IllegalStateException.class, () -> memberService.join(member2));
    // 메시지 검증
    assertThat(e.getMessage()).isEqualTo("이미 존재하는 회원 입니다.");
   /* try {
        memberService.join(member2); // validate 예외 터지길 빔.
        fail("예외가 발생해야 합니다.");
    } catch(IllegalStateException e){
        assertThat(e.getMessage()).isEqualTo("이미 존재하는 회원입니다.");
        //expected: "이미 존재하는 회원입니다. 1231231"
        // but was: "이미 존재하는 회원입니다."
    }*/

    // then
}
```

또한 위 에서 리포지터리 테스트 케이스처럼 메모리를 clear해줘야 한다.

```java
MemoryMemberRepository memberRepository = new MemoryMemberRepository();

@AfterEach
public void afterEach(){
    memberRepository.clearStore();
}
```

그런데, 굳이 두개의 객체를 사용할 필요가 없다. Hashmap에 붙은 static은 class 레벨에 붙는 거라 직음은 상관이 없지만, new 로 만들어진 새로운 Instance이므로 내용물이 달라질 위협이 있다. 그래서 우선 MemberService class에서 다음과 같이 만들어 준다.

```java
private final MemberRepository memberRepository;
// 직접 생성하는 것이 아니라 외부에 넣어주도록.
public MemberService(MemberRepository memberRepository) {
    this.memberRepository = memberRepository;
}
```

MemberService입장에서 memberRepository를 외부에서 넣어준다. 이런 것을 DI(Dependency Injection)이라고 한다.

그리고 MemberServiceTest에서 다음과 같이 @BeforeEach를 작성해준다.



```java
MemberService memberService;
MemoryMemberRepository memberRepository;

// test 실행할 때마다, 생성을 해줌. (독립적으로 테스트 실행)
@BeforeEach
public void beforeEach(){
    memberRepository = new MemoryMemberRepository();
    memberService = new MemberService(memberRepository);
}
```

- `@BeforeEach` : 각 테스트 실행 전에 호출된다. 테스트가 서로 영향이 없도록 항상 새로운 객체를 생성하고, 의존관계도 새로 맺어준다.

---
