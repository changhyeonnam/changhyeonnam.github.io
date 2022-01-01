---
title: Linux | basic command
layout: post
Created: October 27, 2021 5:18 PM
tags:
    - Linux
use_math: true
comments: true
sitemap :
  changefreq : daily
  priority : 1.0
---

> 인하대학교 컴퓨터공학과 이어진 교수님 리눅스프로그래밍 수업을 바탕으로 정리한 내용입니다.
>

### 로그인

- 사용자가 로그인 하여 맨 처음 연결된 장소
- 일반적으로 "home<id>/"
- ID : 해당 Linux 시스템에서 사용되는 사용자 이름
- Password : 사용자 비밀번호. `passwd`를 통해 변경 가능. (비밀 번호 입력시 보이지 않음, 대소문자 구분)

### 사용자 확인

- Linux 시스템은 시스템 관리자가 각 사용자에게 부여한 사용자 번호와 그룹 번호로 사용자를 식별 합니다.
- `id`,`groups`를 통해서 자신의 gid, uid를 확인 가능합니다.

```c
jimmy@jimmy-VirtualBox:~$ id
uid=1000(jimmy) gid=1000(jimmy) groups=1000(jimmy),4(adm),24(cdrom),27(sudo),30(dip),46(plugdev),120(lpadmin),131(lxd),132(sambashare),998(vboxsf)
jimmy@jimmy-VirtualBox:~$ groups
jimmy adm cdrom sudo dip plugdev lpadmin lxd sambashare vboxsf
```

### 종료, 작업 취소

- logout : 사용자 접속 종료 command 입니다.
- exit : 쉘 종료(=ctrl + D) command로 원격으로 접속한 쉘에서도 사용 가능합니다.
- ^C : 인터럽트로, 실행중인 명령을 강제 종료, 인터럽트 시그널 전송 합니다.

### Command 구조

- Linux 쉘에서의 command 구조 : `command[option][argument]`
- 일반적으로 option은 하이픈(-) 앞에 오며, 대부분 응용 프로그램에서는 하나 이상의 옵션과 사용 가능합니다. ex) `command [option1] [option2] [option3] [argument]`

### 도움말 (man command)

Linux에서는 man command를 통해 명령어 사용법을 확인할 수 있다. ex) `man [option] command` (파이썬에서 help의 기능이다.)

```c
jimmy@jimmy-VirtualBox:~$ man passwd
```

### 디렉토리 이동 및 관리 명령(pwd)

- pwd(print working directory)
    - 현재 작업 디렉토리의 path를 보여줌.
- cd(change directory)
    - 디렉토리를 변경하는 명령어로 절대 경로와 상대 경로 모두 사용 가능하다.

```c
jimmy@jimmy-VirtualBox:~$ pwd
/home/jimmy
jimmy@jimmy-VirtualBox:~$ cd ./linux_programming
jimmy@jimmy-VirtualBox:~/linux_programming$
```

- ls(list directory contents)
    - 디렉토리 내의 디렉토리 및 파일 목록을 보여줌.
    - 옵션을 사용하면 파일의 형식, 크기, 접근권한, 파일 생성 날짜, 수정 날짜 등에 대한 정보를 볼 수 있습니다.
    - `ls [option] [argument]`
    - option
        - -a : 모든 파일 (.으로 시작하는 히든파일 포함) 목록 출력
        - -d : 디렉토리만 출력
        - -l : 상세정보를 출력
        - -L : 파일이 심볼릭 링크이면 참조하는 파일에 대한 정보를 보여줌.

            ```c
            jimmy@jimmy-VirtualBox:~$ ls -l
            total 44
            drwxr-xr-x 2 jimmy jimmy 4096  6월  3 23:38 다운로드
            drwxr-xr-x 2 jimmy jimmy 4096  9월  3 15:46 Desktop
            ```

    - mode 필드 (drwxr-xr-x에 해당)
        - 10개의 문자로 구성 됩니다.
        - 첫번째 문자(파일 종류) : d(directory), -(normal file), b(block device file), c(character device file), l(symbolic link), s(socket)
        - 나머지 9개 문자는 접근 권한에 해당합니다. (user(owner), groups, others 각 비트 3개씩).
- mkdir (make a directory)
    - 새로운 디렉토리를 생성하는 명령어로 절대경로와 상대경로 모두 사용 가능하다.
    - `mkdir [option] directory`
    - `[option]` -m mode 접근 권한을 지정된 mode로 부여.
- rm(remove directory)
    - 빈 디렉토리를 삭제하는 명령어로, 해당 디렉토리 내에 다른 파일이 존재할 경우 삭제 불가능하다.
    - `rmdir directory`

### 파일 관리 명령

- touch
    - 원래는 파일의 날짜를 수정하는 명령어
    - 아무 옵션도 사용하지 않으면 0바이트 파일을 생성함
    - `touch file_name`
- cp(copy a file)
    - 한 파일의 내용을 다른 파일에 복사
    - `cp [option] source_file target_file`
    - [option]
        - -r : 서브 디렉토리의 내용도 함께 복사
        - -f : 강제로 복사 (중복된 파일명 있을 시 묻지 않고 강제 덮어쓰기)
- mv(move a file)
    - 파일을 이동시킨다.
    - `mv [option] source_file target_file`
    - soruce와 target의 모든 경로가 일치하고 파일명 부분만 다르다면 파일의 이름이 변경된다.

        ```c
        jimmy@jimmy-VirtualBox:~/linux_programming/dir$ ls
        b.out  dir_b
        jimmy@jimmy-VirtualBox:~/linux_programming/dir$ mv b.out dir_b
        jimmy@jimmy-VirtualBox:~/linux_programming/dir$ cd dir_b
        jimmy@jimmy-VirtualBox:~/linux_programming/dir/dir_b$ ls
        b.out
        ```

- rm (remove a file)
    - 파일을 삭제하는 명령어
    - rm [option] filename
    - [option]
        - -r : 순환적으로 디렉토리를 제거
        - -f : 강제 제거

        ```c
        jimmy@jimmy-VirtualBox:~/linux_programming/dir/dir_b$ ls
        b.out  c.out
        jimmy@jimmy-VirtualBox:~/linux_programming/dir/dir_b$ rm -rf b.out
        jimmy@jimmy-VirtualBox:~/linux_programming/dir/dir_b$ ls
        c.out
        ```

    - 디렉토리를 지울 때 -r 옵션이나 -f 옵션을 사용하는 것은 지울 것인지 묻지 않고 한꺼번에 다 지워준다. 편리하지만 명령어 입력후 바로 지워지기 때문에 자신의 작업물를 한번에 날릴 수 도 있다.

### 파일 접근 권한

- 각각의 파일과 디렉토리는 (owner, group, others)에 해당하는 (read, write, execute) 권한을 가지고 있다. `ls -l` 명령어를 통해 확인 가능.
- chmod(change file modes)
    - 파일 혹은 디렉토리에 대한 접근 권한을 변경하는 명령어
    - `chmod [option] xyz [arguments]`
    - `chmod [option] [who] [op] [permission]`
    - xyz : 각각 owner(x), group(y), others(z)에 해당하는 8진수. ex) 755(111 101 101) = [read, write, execute] for owner, [read, execute] for group and others
    - who : u = user, g = group, o = others
    - op : + 접근권한 추가, -접근 권한 제거, = 접근권한 설정
    - permission : r = read, w = write, x = execute
    - option : -R (하위 디렉토리 및 파일의 모드도 함께 변경)

    ```c
    jimmy@jimmy-VirtualBox:~/linux_programming/dir$ chmod ug=rwx,o=rx dir_b
    jimmy@jimmy-VirtualBox:~/linux_programming/dir$ chmod 666 test.c
    jimmy@jimmy-VirtualBox:~/linux_programming/dir$ ls -l
    total 4
    drwxrwxr-x 2 jimmy jimmy 4096 10월 27 18:26 dir_b
    -rw-rw-rw- 1 jimmy jimmy    0 10월 27 18:41 test.c
    ```


### 디스플레이 명령 (echo)

- vim과 같은 편집기를 통해서 파일을 열지 않더라도, 쉘 내에서 파일의 내용을 확인할 수 있는 명령어들이 있다.
- echo
    - 사용자가 입력 내용을 그대로 출력 장치에서 보여주는 명령어
    - `echo[text]`
- cat
    - 파일의 내용을 보여주는 명령어
    - 사용방법
        - cat [option] file_name
    - [option]
        - -n : 각 줄에 번호를 붙여준다.
        - -v : 탭, new line, form feed를 제외하고 프린트 할 수 없는 문자를 보여준다.
        - -e : 각 줄에 $ 기호를 붙여 준다. (-v 와 함께 사용할 때)

    ```c
    jimmy@jimmy-VirtualBox:~/linux_programming/dir$ cat test.c
    #include <stdio.h>
    int main() {
            printf("Hello World!\n");
    	return 0;
    }
    ```

    - head
        - 파일의 시작 부분을 보여준다
        - head [option] file_name
        - [option]
            - -n number : 파일의 처음부터 시작하여 nubmer 줄 수 만큼 출력한다.
    - tail
        - 파일의 끝 부분을 보여준다.
        - tail [option] file_name
        - [option]
            - -n number : 파일의 끝부터 number 줄 수만큼 보여준다.

        ```c
        jimmy@jimmy-VirtualBox:~/linux_programming/dir$ head -n 1 test.c
        #include <stdio.h>
        jimmy@jimmy-VirtualBox:~/linux_programming/dir$ tail -n 2 test.c
        	return 0;
        }
        ```


### Root 권한 명령

- command 앞에 sudo를 붙임 으로써 command를 root 권한으로 수행 가능
- sudo를 사용하기 위해서는 사용자에게 sudo 권한을 부여해야 함.

```c
jimmy@jimmy-VirtualBox:~/linux_programming/dir$ sudo whoami
root
```
