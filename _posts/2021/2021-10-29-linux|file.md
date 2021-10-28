---
title: Linux | File
layout: post
Created: October 29, 2021 2:28 AM
tags:
    - Linux
use_math: true
comments: true
---

### File and File system

- 파일 : 데이터를 담고 있는 하나의 컨테이너이며, 연속적인 byte sequence이다. os에 의해 부여된 확장자는 없습니다. 각 파일은 디스크안의 각자의 주소를 갖습니다.
- 파일 시스템 : 이런 파일들을 구성해 놓은 것이 파일 시스템이고, 파일 시스템은 hard disk와 같은 data storage device를 사용합니다.

### File acess primitives

- 유닉스나 리눅스에서는 posix standard를 지켜야 하고, 아래 함수들을 사용할 수 있어야 합니다. 아래 함수들은 시스템콜 함수들입니다. 이름에서 용도를 유추할 수 있습니다. cf) creat (e가 없다)
- `open, creat, close, read, write, lseek, unlink, remove, fcntl`
- 시스템콜을 invoke = call하게 되면 커널을 깨우게되고, 커널에서는 시스템콜에 해당하는 커널 코드를 수행하여 수행한후, return 합니다.

### File Descriptor

- 새로운 파일 디스크립터를 할당 할때 프로세스가 사용하지 않은 가장 낮은 수를 할당하게 됩니다.
- 각 프로세스가 쉘에 의해 생성될때 터미널과 관련된 세개의 open file이 생긴다.

    <div class="center">
      <figure>
        <a href="/images/2021/linux/a0.png"><img src="/images/2021/linux/a0.png" width="400" ></a>
      </figure>
    </div>

    - 0=terminal에서의 입력, 1= terminal에서의 출력, 2 = 에러
    - 3개의 디스크립터가 기본적으로 할당되어 있다. 파일을 새로 시작하면 3번으로 시작하게 된다.

### Primitive system data types

`<sys/types.h>`에 정의되어 있습니다.  `_t`계열의 데이터 타입은 primitvie data type으로 시스템이 변해도 변하지 않습니다. int,float은 시스템에 따라 나타내는 형태가  달라질 수 있습니다.

### System Call : open

```c
#include<fcntl.h>

int open(const char* pathname, int flags, [mode_t mode]);
```

- path name에는 경로에 해당하는 주소가 들어갑니다.
- flags
    - O_RDONLY
    - O_WRONLY
    - O_RDWR

    → 세개 중 하나가 specify되어야 합니다.

- optional flags
    - O_APPEND : 파일 끝부분 부터 더해져서 써집니다.
    - O_CREAT : 파일이 존재하지 않으면 새로 만듭니다.
    - O_EXCL: O_CREAT가 flag로 사용될 경우에만 사용할 수 있습니다. 파일이 있으면 return을 오류로 하고. 없으면 새로 만듭니다.
    - O_TRUNC : 파일이 있다면, 원래 파일을 모두 지우고, 새로 파일을 만듭니다.
    - O_NONBLOCK : 기본적으로 시스템 콜들이 호출 되면 바로 응답하지 못할 수 도 있습니다. 커널이 응답하지 않으면 기다리지 않고 자기 할일을 진행합니다.
- mode
    - O_CREAT flag에만 같이 사용하는 모드. file permission을 set합니다.
    - 0644라하면, 110100100을 의미한다.팔진수로 표현됩니다.
    - open에서 세번째 mode에 들어가는 file permission.

      <div class="center">
        <figure>
          <a href="/images/2021/linux/a2.png"><img src="/images/2021/linux/a2.png" width="400" ></a>
        </figure>
      </div>

        - user-group-others로 이어집니다.
        - 111101000 = 0750으로 표현된다.
- 유닉스,리눅스에서는 한개의 프로세스에서 열 수 있는 파일의 개수를 정해 놓았다. 현재 리눅스에서는 1024개 까지 열 수 있다. cf) 라이브러리 함수의 대부분은 root user의 `"/usr/include"`의 디렉토리에 있다.

### System Call : close

```c
#include <unistd.h>

int close(int filedes);
```

- open되 file은 `close` 에 의해 닫힙니다.
- 파일 디스크립터 값을 받아서 닫습니다. 만약에 닫지 않고, 프로세스를 종료했다고 하더라도, 커널이 프로세스에 열려있는 파일을 닫습니다.
- 프로세서는 종료되었는데 fd table이 비여지지 않는다면 문제가 생길 수 있고, 대혼란을 막기 위해 커널이 자동적으로 닫아줍니다.

### test_open.c

```c
#include <stdio.h>
#include <fcntl.h>
#include <unistd.h>
#define PERMS 0644
char *workfile= "junk";
int main() {
    int filedes;
    if ((filedes = open(workfile, O_WRONLY|O_CREAT|O_EXCL, PERMS)) == -1) {
        printf ("Couldn’t open %s\n", workfile);
        return -1;
    }
    else {
        printf("Open file %s succeed!\n", workfile);
    }
    close(filedes); return 0;
}
```

junk라는 파일이 존재할 경우 open이 되지 않고, 존재하지 않는다면 junk 파일을 만들어주는  프로그램 입니다.

### System Call : creat

```c
#include<fcntl.h>

int creat(const char* pathname, mode_t mode);
```

- 만약 파일이 존재하면 mode는 생략됩니다.
- creat는 항상 WRONLY로 파일을 open합니다. open과 다르게 creat은 항상 fd를 반환하기 전에 truncate한다. (truncate = 파일 존재하면 지우고, 새로운 파일 만든다.)
- 그래서 open이 활용도가 더 높다.

```c
fd = creat("/tmp/newfile",0644);
fd = open("/tmp/newfile", O_WRONLY| O_CREAT| O_TRUNC, 0644);
```

위의 두가지 시스템 콜은 동일한 동작을 합니다.

### Owner and Permission of a new file

- 현재 작업중인 current directory( or parent directory)에 대한 쓰기 권한이 있어합니다. 디렉토리 파일은 그 안의 정보들을 갖고 있고, 그 파일들에 대해 쓰기 권한을 갖고 있어야 합니다.
- process를 만든 사람을 effective user id라 하고, 포함되어 있는 그룹을 effective group id라고 합니다 process의 소유자는 real user id로 설정되고, 그에 대한 real group-id도 있습니다. (나중에 자세히 설명)

### System Call : read

```c
#include <unisted.h>

ssisze_t read(int filedes, void* buffer, size_t n);
```

- read는 파일 디스크립터에 해당하는 파일에 대해 특정한 사이즈만큼 읽어서 버퍼에 넣습니다. 파일을 읽는 것은 현재 파일 포지션으로부터 바이트를  메모리로 복사하고, 파일 포지션을 업데이트한다. 읽은 바이트 수를 반환합니다.
- 파일 포인터 : 각 파일 디스크립터에는 현재 파일에서의 파일 포지션을 나타내는 파일 포인터가 존재합니다. 읽은 만큼 파일 포인터를 이동시킵니다.

### System Call : write

```c
#include <unisted.h>

ssize_t write(int filedes, const void *buffer, size_t n)
```

- write한 바이트 수를 반환합니다. O_trunc으로 열면 파일이 빈 파일이 되어 처음부터 쓸수 있고, O_APPEND을 넣으면 파일의 끝부터 덧붙여 쓸 수 있습니다.

### test_copy.c

```c
#include <stdio.h>
#include <fcntl.h>
#include <unistd.h>
#define PERMS 0644
#define BUFSIZE 512

int copyfile (const char*, const char*);
int main(int argc, char *argv[]) {
    char *infile=argv[1];
    char *outfile=argv[2];
    int retcode = copyfile(infile, outfile);
    if (retcode == 0)
        printf("copy succeed!\n");
    else
        printf("copy failed with return code %d\n", retcode);
    return 0;
}

int copyfile (const char *name1, const char *name2) {
    int infile, outfile;
    ssize_t nread;
    char buffer[BUFSIZE];
    if ((infile = open(name1, O_RDONLY)) == -1)
        return -1;
    if ((outfile = open(name2, O_WRONLY | O_CREAT |O_EXCL, PERMS)) == -1) {
        close (infile);
        return -2;
    }
    while ((nread = read(infile, buffer, BUFSIZE)) > 0) {
        if (write(outfile, buffer, nread) < nread) {
						close (infile);
            close (outfile);
            return -3;
        } }
    close(infile); close(outfile);
    if (nread == -1) return -4;
    else return 0;
}
```

wriet, read 함수를 사용하여 infile을 outfile로 복사하는 프로그램 입니다.  infile의 파일의 끝을 만날때까지 루프를 돈다.

### read, write and Efficiency

<div class="center">
  <figure>
    <a href="/images/2021/linux/a1.png"><img src="/images/2021/linux/a1.png" width="400" ></a>
  </figure>
</div>

- 버퍼 사이즈에 따라 성능이 달라질 수 있습니다. 버퍼사이즈가 작아지면 시스템 콜 횟수가 많아져서, 시스템콜을 자주 호출하게 되서 성능이 안좋습니다.
- 버퍼 사이즈가 system의 disk blocking factor의 배수가 되면 중복되는 것이 없어서 성능이 좋아집니다.
- write system call이 매우 빠른 이유
    - write가 호출되면 write을 바로 실행하지 않고 반환합니다.
    - 데이터를 커널에 있는 버퍼 캐시로 transfer하고 return하기 때문에 매우 빠릅니다. (delay writing). disk error가 발생하면, write한 데이터가 정상적으로 디스크에 저장되지 않을 수 도 있습니다.

### test_cat.c

```c
#include <stdio.h>
#include <fcntl.h>
#include <unistd.h>
#define BUFSIZE 512
int main(int argc, char *argv[]) {
    char *infile=argv[1];
    int filedes = open(infile,O_RDONLY);
    char buf[BUFSIZ];
    ssize_t nread;
    if(argc!=2){
        printf("argc error\n");
        return 0;
    }
    if(filedes==-1){
        printf("argc error\n");
        return 0;
    }
    read(filedes,buf,sizeof(buf));
    printf("%s",buf);
    close(filedes);
    return 0;
}
```

cat 함수를 구현한 코드입니다. argv[1]로 받은 infile을 stdout으로 출력합니다.

```c
$ test_cat <filename>
```

cat과 동일하게 위와 같이 사용하면됩니다.
