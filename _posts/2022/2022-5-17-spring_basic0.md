---
title: 스프링 입문 | 스프링 웹 개발 기초
layout: post
Created: May 17, 2022 7:21 PM
tags:
    - java
    - spring boot
use_math: true
comments: true
sitemap :
  changefreq : daily
  priority : 1.0
---
> 스프링 입문 - 코드로 배우는 스프링 부트, 웹 MVC, DB 접근 기술 김영한 님 강의를 참고하였습니다.
[TL;DR] 스프링 부트에서 웹 개발하는 방식 3가지를 배웁니다.  1) 정적 컨텐츠, 2) MVC와 템플릿 엔진, 3)API.
>

크게 웹은 3가지 방식이 잇다.

1. 정적 컨텐츠 → 파일 그대로 전달.
2. MVC와 템플릿 엔진. → 모델 /뷰/컨트롤러. 서버에서 변형함.
3. API → json이라는 데이터 구조 포맷을 클라이언트에게 전달하는 것이 보통 api 방식. view, view js react. 서버끼리 흐를때 api방식이라고 한다.

---

## 1. Static content : 그냥 html 파일 만들면 된다.

![Untitled](https://i.imgur.com/G7IR852.png)
1. 웹브라우저에서 hello-static/html을 검색함.
2. 내장 톰켓 서버가 이 요청을 받음.
3. 스프링한테 hello-static.html을 넘김.
    1. 컨트롤러중에 hello-static이 있는지 찾아봄. (컨트롤러가 우선순위를 갖는다.)
4. 그다음 스프링 부트가 resources에 있는 static folder에 있는 것을 찾아봄.

## 2. MVC와 템플릿 엔진.

MVC : model, view, controller. 과거에는 v,c가 분리되어 있지 않았슴.

예전에는 v에서 다함. (view는 관심사/역할과 책임을 분리해야함.). 요즘은 view는 화면과 관련된 일만한다. 서버와 관련된 것은 controller/비즈니스 로직에서 처리를 하고, 모델에 화면에서 필요한 것들을 담아서, view에 넘겨줌.  

```java
package hello.hellospring.controller;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class HelloController {

    // web applicaition, /hello input -> hello method is called.
    @GetMapping("hello")
    public String hello(Model model){
        model.addAttribute("data","spring!!");
        return "hello";
    }

    @GetMapping("hello-mvc")
    public String helloMvc(@RequestParam(value="name") String name, Model model){
        model.addAttribute("name",name);
        return "hello-template";
    }
}
```

![Untitled 1](https://i.imgur.com/4cTB8yh.png)
1. 웹 브라우저에서 내장 톰켓 서버에 요청을 넘김.
2. 내장 톰켓서버는 hello-mvc가 왔다고 스프링에 던짐.
3. 스프링에는 helloController의 method에 맵핑이 되어있는 것을 확인. return해줄 때는 hello-template을 반환한다. model에 key는 name, value는 spring으로 넘김.
4. viewResolver(화면과 관련된 해결자)가 동작을 해준다. 템플릿 엔진에게 넘기면, 렌더링을 거쳐 변환한 html을 웹 브라우저에 반환한다.

---

## 3. API

정적 컨텐츠를 제외하면 두가지만 기억하면 된다. (1) HTML로 내리냐, (2) API방식으로 데이터를 바로 내리느냐!.

```java
@GetMapping("hello-string")
    @ResponseBody // html body tag가 아님. http의 body파트에 직접 넣어준다.
    public String helloString(@RequestParam("name") String name){
        return "hello " + name; //"hello spring" 그냥 이 문자가 그대로 내려감.
    }
```

source를 보면 그냥 “hello spring”만 넘어간다. (html이 아니다.) 이전의 템플릿 엔진은 view를 이용해서 조작했다면, 이번엔 데이터를 그냥 넘겨줌.

```java
// 문자가 아니라 데이터를 반환하는 경우가 진짜 중요함.
    @GetMapping("hello-api")
    @ResponseBody
    public Hello helloApi(@RequestParam("name") String name){
        Hello hello = new Hello();
        hello.setName(name);
        return hello; // 객체를 반환함.
    }

    static class Hello{
        private String name;

        public String getName(){
            return name;
        }
        public void setName(String name){
            this.name = name;
        }
    }
```

결과는 key-value로 이루어진 json 형식이다.

```java
{"name":"=spring!!!!!"}
```

과거는 xml방식으로 많이 했다. xml 방식은 무겁고, 형식이 귀찮다. 스프링에서 객체를 반환하면 기본적으로 json으로 반환한다.

맥북 기준으로 ctrl+enter해서 getter-setter바로 만들 수 있다. getter-setter가 javabean 표준 방식이고, property 접근 방식이라고도 한다.

![Untitled 2](https://i.imgur.com/hpNg6Zj.png)
1. [localhost:8080/hello-api를](http://localhost:8080/hello-api를) 웹브라우저 검색하면 내장 톰켓서버는 이것을 스프링에 던짐.
2. 스프링에 hello-api가 있는 것을 확인. ResponseBody가 없으면 템플릿은 viewResolver에게 던졌슴.
    1. HTTP의 BODY에 문자 내용을 직접 반환
    2. viewResolver 대신에 HttpMessageConverter 가 동작
        1. 기본 문자처리: StringHttpMessageConverter
        2. 기본 객체처리: MappingJackson2HttpMessageConverter. 객체를 json으로 변환해주는 대표적인 라이브러리가 Jackson, Gson(구글꺼)이 있다. 스프링은 기본적으로 Jackson을 탑재함.
    3. byte 처리 등등 기타 여러 HttpMessageConverter가 기본으로 등록되어 있음

(1) 클라이언트의 HTTP Accept 해더와 (2) 서버의 컨트롤러 반환 타입 정보 둘을 조합해서 HttpMessageConverter 가 선택된다. (xml로 변환시켜줄 수도 있다.)
