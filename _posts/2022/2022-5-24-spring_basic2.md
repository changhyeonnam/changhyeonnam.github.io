---
title: 스프링  입문 | 스프링 빈과 의존관계 설정
layout: post
Created: May 24, 2022 8:59 PM
tags:
    - Java
    - Spring boot
use_math: true
comments: true
sitemap :
  changefreq : daily
  priority : 1.0
---
> 스프링 입문 - 코드로 배우는 스프링 부트, 웹 MVC, DB 접근 기술 김영한 님 강의를 기반으로 하였습니다.

>[TL;DR] 컨트롤러→서비스→리포지터리 방향으로 의존성 주입하는 방법을 배웁니다. 생성자 주입을 @autowired와 생성자를 통해 구현합니다. 또한 스프링 빈에 등록하는 방법 2가지를 배웁니다. 첫번째는 @Component를 이용한 Component scan, 두번째로 Configuration을 자바코드로 직접 작성하여 스프링 빈으로 등록하는 것을 배웁니다.


Recap) 저번시간까지 서비스와 리포지터리를 만들었다. 서비스를 통해서 멤버를 입력으로 넣어, 리포지터리에 저장이 된다. 그리고 리포지터리에서 다시 꺼내올 수 있다. 이러한 로직과 테스트를 만들었다.

## 스프링 빈과  의존관계

### 컴포넌트 스캔과 자동 의존관계 설정

이제 화면을 만들고 싶다. 뷰, 컨트롤러가 필요하다. (회원가입 후, 회원가입된 정보를 html로 뿌려주는 !)

이것을 구현하기 위해 멤버 컨트롤러를 만들어야한다. 멤버 Controller는 멤버 service를 통해서 회원 가입하고, 멤버 service를 통해서 데이터를 조회할 수 있어야 한다. 이러한 것을 의존관계가 있다고 표현한다. 멤버 Controller가 멤버 service에 의존한다.   

```java
@Controller
public class MemberController {

}
```

@Controller annotation을 작성하면, 비여있어도 spring container에 MemberController라는 객체를 넣어둔다. 이러한 것을 스프링 빈이 관리된다고 한다.

```java
@Controller
public class MemberController {
		private final MemberService memberService = new  MemberService();
}
```

new로 생성해서 `MemberService`를 쓰면 문제가 생긴다. 스프링 컨테이너에서  가져다가 바꿔야아 한다. new로 생성 하면 `MemberController` 말고도 다른 Controller들이 서비스를 가져다 쓸수 없다. `MemberService`를 하나만  생성 해놓고  공용으로 쓰면 된다. 즉, `MemberService`를 스프링 컨테이너에 하나만 등록해서 쓰면된다. (부가적인 장점은 뒤에서)

```java
public class MemberController {
private final  MemberService memberService;

@Autowired
public MemberController(MemberService memberService){
    this.memberService =  memberService;
}
```

생성자에 @Autowired 가 있으면 스프링이 연관된 객체를 스프링 컨테이너에서 찾아서 넣어준다. 이렇게 객체 의존관계를 외부에서 넣어주는 것을 **DI (Dependency Injection)**, **의존성 주입**이라 한다.

![Untitled](https://i.imgur.com/vjnswwS.png)
`MemberService`가 스프링 빈으로 등록되어 있지 않으면 연결 시킬 없다. 스프링 컨테이너에서 관리하는 `MemberService`가 있어야 `MemberController` 생성자에서 호출 될 수 있다.

```java
@Service
public class MemberService {
		..
}
@Repository
public class MemoryMemberRepository{
..
}
```

`@Service`로  적으면 스프링 컨테이너에 `MemberService`를  등록 해준다. 리포지터리도 `@Repository`도  적으면 스프링 컨테이너에  등록해준다.

(지금까지 했던)컨트롤러를 통해서 외부요청을 받고, 서비스에서 비즈니스 로직을 만ㄷ르고, 리포지터리에서 데이털를 저장을 하는 것이 정형화된 패턴이다.

![Untitled 1](https://i.imgur.com/RanTuBa.png)
컨트롤러와 서비스를 연결시켜줘야한다. 생성자에서 `@autowired`로 쓰면,  `MemberController`가 생성 될때,  스프링빈으로  등록되어있는 `MemberService` 객체를  가져다가 넣어준다. 이게 DI(의존성 주입)이다. `MemberService`에서도`@autowired`를  통해서 `MemoryMemberRepository`객체를  가져다 넣어준다.

**스프링 빈을 등록하는 2가지 방법**

1. **컴포넌트 스캔과 자동 의존관계 설정**
    - @이게 컴포넌트 스캔 방식.  @something의 정체는 사실 @Component이다. @Service안에 들어가면  @Component라는 annotation이 등록이 되어 있다. @Controller, @Repository도 마찬가지이다. 그래서  **컴포넌트 스캔**이라고  한다. 스프링이 올라올때, @Component  annotation이 있으면  다 등록을 해준다. @Autowired는  이러한 연관관계를 연결해준다.  멤버 컨트롤러가 멤버 서비스를 쓸수 있게 해주고, 멤버서비스가  멤버리포지터리를  쓸수 있게 해준다.
    - **컴포넌트 스캔 원리**

        @Component 애노테이션이 있으면 스프링 빈으로 자동 등록된다. @Controller 컨트롤러가 스프링 빈으로 자동 등록된 이유도 컴포넌트 스캔 때문이다.

        @Component를 포함하는 다음 애노테이션도 스프링 빈으로 자동 등록된다.

        - @Controller
        - @Service
        - @Repository

2.  **자바 코드로 직접 스프링 빈 등록하기** (이것도 알아야 한다.)

Q. 먼저 궁근한것! 아무거나 @로 컴포넌트 만들어도 되나여?

A. 기본적으로 Hello.hellospring 패키지나 하위 패키지에 대해선 스프링이 알아서 스캔해서 하지만,  하위 패키지가 아니거나 Hello.hellospring 패키지가 아니면 스프링빈으로 컴포넌트 스캔을 안해준다. (어떤 설정을 해주면 되긴하지만 기본적으로는 안된다.)

@SpringBootApplication을 까보면 @ComponentScan이라는 annotation이 있따. @ComponentScan이 있으면 스캔해준다.

스프링은 스프링 컨테이너에 스프링 빈을 등록할 때, 기본으로 **싱글톤**으로 등록한다.(유일하게 하나만 등록해서 공유한고, 두개 등록하지 않는다.)

- 따라서 같은 스프링 빈이면 모두 같은 인스턴스다.
- 설정으로 싱글톤이 아니게 설정할 수 있지만, 특별한 경우를 제외하면 대부분 싱글톤을 사용한다.
- 예를 들어 OrderService가 있다고 하면  MemberService가 사용하는 memberRepository와  같은 인스턴스를 연결해준다. 특수한 상황이 아니라면 싱글톤을 사용한다.

---

### 자바 코드로 직접 스프링 빈 등록하기

회원 서비스와 회원 리포지토리의 @Service, @Repository, @Autowired 애노테이션을 제거하고 진행한다.

하나하나 직접 자바코드를 작성해서 스프링 컨테이너 에 연결.  

1. SpringConfig파일 하나 만든다.
2. @Cofiguration을 적어서 작성 해주면 된다.  

```java
@Configuration
public class SpringConfig {

    @Bean
    public MemberService memberService(){
        return new MemberService(memberRepository()); // command p
    }

    @Bean
    public MemberRepository memberRepository(){
        return new MemoryMemberRepository();
    }
}
```

(이전에 서비스와 리포지토리에 있던 컴포넌트 annotaiton은 지워줘야한다.)

![Untitled 2](https://i.imgur.com/BD5IdJk.png)
딱 이 그림이 된다.

여기서는 향후 메모리 리포지토리를 다른 리포지토리로 변경할 예정이므로, 컴포넌트 스캔 방식 대신에  자바 코드로 스프링 빈을 설정하겠다.

컴포넌트 스캔과 자바 코드로 직접 스프링 빈 등록하기의  장단점이 있다. (과거에는 XML으로 설정했다. 실무에서는 거의 하지 않는다.)

- 참고: DI에는 필드 주입, setter 주입, 생성자 주입 이렇게 3가지 방법이 있다. 의존관계가 실행중에 동적으로 변하는 경우는 거의 없으므로 생성자 주입을 권장한다.

    생성자를 통해서 들어오는 것을 생성자 주입이라고 한다. 앞선 설명에서,  멤버 컨트롤러에 멤버서비스가 생성자를 통해 들어오는 것이  그  예시이다.

    또 다른 방법은  필드에다가 @Autowired를 작성하는 것이다.

    ```java
    @Controller
    public class MemberController{
    @AutoWired private MemberSercie memberService;
    }
    ```

    별로 좋지 않다. 중간에 바꿀수 있는 방벙이 없다.

    그 다음이 setter Injection 방식이다.  

    ```java
    @Controller
    public class MemberController{
    	private MemberSercie memberService;

    	@Autowired
    	public void setMemberService(MemberService memberService){
    	this.memberService = memberService;
    	}
    }
    ```

    이것의 단점은 누군가가 MemberController를 호출했을떄, setter가 public으로 열려 있어야한다. 중간에 잘못 바꾸면 문제가 생긴다. 개발은 호출되지 말아야하는 메서드는 호출되면 안된다. 변경을 막아버려야한다.

    그래서 요즘 권장하는 스타일은 생성자를 통해서 injection하는 것이다. Application이 조립될때, 스프링 컨테이너에 하나씩 올라가는 시점에 생성자 호출되고 끝난다.

- 참고: 실무에서는 주로 정형화된 컨트롤러, 서비스, 리포지토리 같은 코드는 컴포넌트 스캔을 사용한다.그리고 정형화 되지 않거나, 상황에 따라 구현 클래스를 변경해야 하면 설정을 통해 스프링 빈으로등록한다.

    이게  중요하다. :) 상황에  따라 구현 클래스를 변경해야할때 필요한다. 지금 멤버 리포지터리를 만들었다. 예전 수업때, `데이터 저장소가 선정되지  않았다는 가상의 시나리오`가 있다. 메모리를 만들고 나중에 교체하자라고 했다.

	![Untitled 3](https://i.imgur.com/pSj5maH.png)
    그래서 위와 같이 `MemberRepository` 인터페이스를 쓰고, 구현체로 `MemoryMemberRepository`로 사용하는 그림이 된 것이다. 나중에 `MemoryMemberRepository`를 다른 MemoryRepository로  바꿔치기 할것이다. 그런데 기존의 운영중인 코드를 하나도 손대지 않고 바꿔치기 할 수 있는 방법이 있다. 그것을 하려고, 자바코드로 스프링 빈 등록을 하는 것이다.

    ```java
    @Configuration
    public class SpringConfig {
    @Bean
    public MemberService memberService() {
        return new MemberService(memberRepository());
    }

    @Bean
    public MemberRepository memberRepository() {
    	  ~~return new MemoryMemberRepository();~~
    	return new DbMemberRepository();
    ~~~~}

    }
    ```

    위와 같이 DbMemberRepository로만 바꿔주면, 다른 코드를  손댈 필요 없이 데이터베이스를 바꿀 수 있다. 이것이 자바로 직접 Spring bean에 등록할때의 장점이다.

- 주의: @Autowired 를 통한 DI는 helloConroller , memberService 등과 같이 스프링이 관리하는 객체에서만 동작한다. 스프링 빈으로 등록하지 않고 내가 직접 생성한 객체에서는 동작하지 않는다.
- 스프링 컨테이너, DI 관련된 자세한 내용은 스프링 핵심 원리 강의에서 설명한다.
