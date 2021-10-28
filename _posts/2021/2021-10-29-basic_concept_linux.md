---
title: 1.Linux | Basic Concept & Terminology
layout: post
Created: October 29, 2021 12:59 AM
tags:
    - Linux
use_math: true
comments: true
---


Created: October 29, 2021 1:31 AM

### Unix Architecture

<div class="center">
  <figure>
    <a href="/images/2021/linux/l0.png"><img src="/images/2021/linux/l0.png" width="400" ></a>
  </figure>
</div>

- Unix(linux)의 구조는 위와 같습니다. Unix는 운영체제이기 때문에 특정 하드웨어를 위에서 돌아갑니다.
- 시스템 콜은 다른 라이브러리 루틴 혹은 application에서 커널에 특정한 것을 요구할 때 사용됩니다.
- 커널 자체를 linux라고도 하고, 전체를 linux라고도 합니다.

### Shell

- Command line interpreter로, 쉘에 특정 명령어를 입력하고, 그 명령어를 전달합니다. 유닉스 운영체제를 감싸고 있는 껍데기라고 봐도 됩니다.
- Shell의 종류에는 크게 Bourne Shell과 C-type shell이 있고, 우리가 주로 사용하는 bash(Bourne Again shell)은 Bourne shell에 속합니다.

### File and File system(1)

1. 파일 시스템 : 디렉토리와 파일들을 hierarchical하게 쌓아 놓은 것입니다. 디렉토리안의 모든 것은 root = "/"에서 시작힙니다.
2. 파일 이름 : 파일이름에는 "/"을 사용할 수 없습니다. 새로운 디렉토리가 만들어지면 현재 디렉토리를 의미하는 "."와 parent 디렉토리를 의미하는 ".."라는 두가지 파일 이름이 자동적으로 생성된다.
3. working directory : 모든 프로세스는 working 디렉토리를 갖으며, current working directory에 대해 상대적인 directory로 접근할 수 있습니다.
4. home directory : 로그인을 하면, working directory가 home directory로 설정이 됩니다.
5. pathname : 상대경로와 절대 경로가 있습니다.
    - 상대경로 : file1
    - 절대 경로 : /home/file1
6. File types
    - regular : 바이너리 파일, 텍스트파일을 의미합니다. 다른 os와 다른 점은 유닉스,리눅스에서는 일반파일의 종류를 구분하지 않습니다. 즉, 정해진 확장자가 없다는 뜻이고, 하나의 파일은 어떠한 형태로도 존재할 수 있다.
    - directory file : 해당하는 디렉토리에 있는 파일의 이름과 위치를 갖고 있습니다.
    - character, block special file : device 파일로, 각각은 특정 디바이스를 나타냅니다. 이 둘의 차이점은 character인 경우 버퍼링 없이 하드웨어 접근을 가능하게 하는 반면, block은 블록단위로 하드웨어 접근가능합니다. character는 즉시 하드웨어 작업, 표준 입력 표준 출력이 쓰이고, block 블록단위는 예를들어 하드디스크에 데이터를 쓸때 블록단위로 접근한다. 즉, 위 두개의 파일은 장치 파일 입니다.
    - pipe, socket : process communication을 위한 파일입니다. 서로 소통을 할 수 있게 하는 파일이 파이프나 소켓이다. 파이프는 프로세스간, 소켓은 네트워크를 통한 프로세스 통신을 지원합니다.
7. Ownership, Permissions
    - Ownership : 각 파일은 특정 user에 의해 own됩니다. owner는 permission을 정할 수 있습니다.
    - permission : read, write, execute와 관련된 permission이다.
        - d : directory, b : block special file, c: character file, p: pipe(FIFO), - : regular file, l : symbolic link

### Program & Process

<div class="center">
  <figure>
    <a href="/images/2021/linux/l1.png"><img src="/images/2021/linux/l1.png" width="400" ></a>
  </figure>
</div>

- Program : 프로그램에는 명령어의 sequence, data, program실행과 로딩에 필요한 메타 데이터가 들어가 있습니다. 이런 정보를 담고 있는elf(executable and linkable format)이라는 것이 디스크에 저장되어 있다.
- Process : Program을 실행 시켜서 자신만의 힙과 스택과 같은 메모리 공간을 갖는 것이 Process입니다. Process는 실행되고 있는 Program의 Instance라고 볼수도 있다. IPC를 통해 프로세스간 통신을 할 수 있다.

### System Calls

<div class="center">
  <figure>
    <a href="/images/2021/linux/l2.png"><img src="/images/2021/linux/l2.png" width="400" ></a>
  </figure>
</div>

- 시스템콜은 유닉스 커널로 들어가는 여권이라고 볼 수 있고, 실제 일은 kernel에서 수행됩니다.
- C library function과 system call이 있고, C library function도 마지막에는  시스템 콜을 수행합니다.
- 시스템콜은 두번의 context switch를 포함합니다. user→kernel, kernel→user. 모든 시스템 콜은 헤더 파일에 정의되어 있고, 마스터 헤더에 자주 사용하는 헤더들을 넣어 두고 사용하는 것 이 좋습니다. 시스템콜은 일반 함수보다 시간이 더 많이 걸리므로 호출하는 횟수를 최소화 하는 것이 좋습니다.
- Header : `fcntl.h`
    - File Control Header
    - Linux에서 제공하는 file system call을 담당하는 헤더 파일입니다. 파일 생성, 접근, 속성 변경에 대한 내용이 있습니다.
