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
        <a href="/images/2021/linux/a2.png"><img src="/images/2021/linux/a2.png" width="400" ></a>
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
          <a href="/images/2021/linux/a0.png"><img src="/images/2021/linux/a0.png" width="400" ></a>
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
    <a href="/images/2021/linux/a0.png"><img src="/images/2021/linux/a0.png" width="400" ></a>
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

### System Call : lseek

```c
#include <unisted.h>

off_t lseek(int filedes, off_t offset, int start_flag)
```

- file posistion은 커서와 같은 역할을 합니다. (포인터가 아니고, posisition이다.) 다음 read, write가 일어날 위치를 가르킵니다.
- `filedes` : open or creat로 반환되는 file descriptor값이다.
- `offset` : start_flag로부터 떨어진 number bytes를 의미한다.
- `start_flag`
    - SEEK_SET : Begining of the file
    - SEEK_CUR : current location
    - SEEK_END : end of file

```c
fd = open(fname, O_RDWR);
lseek(fd, (off_t)0, SEEK_END);
write(fd, outbuf, OBSIZE);
```

file의 끝부터 덧붙여써 쓰는 코드 입니다.

```c
off_t filesize;
int filedes;
filesize = lseek(fd,(off_t)0, SEEK_END);
```

file size를 반환 받는 코드입니다.

### File Share

- 각 프로세스는 파일 디스크립터 테이블을 갖고있습니다. file descriptor table에는 flag와 pointer가 있습니다. flag는 file descriptor flag이고, pointer는 file table entry를 가르키는 파일 포인터입니.
- 커널은 모든 open 파일에 대해 file table을 유지한다. 각 file table entry는 다음에 대해 저장한다.
    1. file status flag for file (read, write)
    2. current file offset( = 파일 포지션)
    3. 해당 파일에 대한 v node table entry로의 포인터
- open file들은 v node 구조체를 갖고있고, vnode는 파일의 타입과 파일에 실행되는 함수들에 대한 포인터를 포함하고 있습니다.

    v node는 실질적인 파일의 개념이라고 볼 수 있고, 시스템이 특정 파일에 접근할 때 vnode에 접근하여 파일에 접근하게 됩니다. vnode는 일종의 인터페이스라고 할 수 있습니다.

    <div class="center">
      <figure>
        <a href="/images/2021/linux/b3.png"><img src="/images/2021/linux/b3.png" width="400" ></a>
      </figure>
    </div>

    어떤 프로세스를 실행시켜서 파일에 접근할때의 과정이다. file descriptor table → file table entry pointer → file table → v node table.

    ```c
    int fd3, fd4, char buf[20];

    fd3 = open("file",O_RDWR);
    fd4 = open("file",O_RDONLY);;

    read(fd3, buf, 20);
    read(fd4, buf, 30);

    close(fd3); close(fd4);
    ```

    <div class="center">
      <figure>
        <a href="/images/2021/linux/b4.png"><img src="/images/2021/linux/b4.png" width="400" ></a>
      </figure>
    </div>

    두개의 프로그램을 실행시켜, 각각의 프로세스를 a,b라 하고, a와 b는 모두 file이라는 파일 open하는 시스템 콜을 호출합니다. 각 프로세스를 위한 file descriptor table이 생기고, v node pointer 를 따라가보면 실제로 한개의 파일을 가르킵니다. file table은 별도로 생성됩니다.


### System Call : dup and dup2

```c
#include <unistd.h>

int dup(int filedes);
int dup2(int filedes, int filedes2);
```

1. `int dup(int filedes)` : 존재하고 있는 file descriptor 값을 받아 복사하여 새로운 fd를 반환합니다.

    ```c
    newfd = dup(1)
    ```

    <div class="center">
      <figure>
        <a href="/images/2021/linux/b5.png"><img src="/images/2021/linux/b5.png" width="400" ></a>
      </figure>
    </div>

    file table, v node table은 같은 테이블로 관리된다.

2. `int dup2(int filedes, int filedes2)` : fildes에 해당하는 파일을 filedes2에 해당하는 파일로 저장합니다. 새로운 파일 디스크립터 filedes2를 반환합니다.

    <div class="center">
      <figure>
        <a href="/images/2021/linux/b6.png"><img src="/images/2021/linux/b6.png" width="400" ></a>
      </figure>
    </div>

    dup2는 redirection할때 많이 사용 합니다.

    ```c
    fd3 = open("test",O_RDWR);
    dup2(fd3,1);
    ```

    파일 디스크립터 1에 접근을 하면 test로 우회가 됩니다. 어떤 프로그램을 만들때 특정 파일로 받아서 보고 싶다면 맨앞에서 파일 디스크립터를 복사하여 우회하면 됩니다.


### System Call : fcntl

```c
#include<fcntl.h>

int fcntl(int filedes, int cmd, ...);
```

- 파일 디스크립터와 커맨드가 argument로 오고, 커맨드는 몇십개가 있다. open 파일에 대한 특성을 바꾸는 함수이다.
- cmd
    - F_DUPFD : dup함수와 동일하다.
    - F_GETFD/F_SETFD
    - F_GETFL/F_SETFL : status와 관련된 flag. 가장 많이 사용한다.
    - F_GETOWN/F_SETOWN
    - F_GETLK/F_SETLK/F_SETLKW : signal과 관련된것.

    ```c
    #include <fcntl.h>
    int filestatus(int filedes){
		int arg1;
		if (( arg1 = fcntl (filedes, F_GETFL)) == -1) {
				printf ("filestatus failed\n");
				return (-1);
		}
		  /* file access mode flag test */
		  switch ( arg1 & O_ACCMODE) {
			case O_WRONLY:
					printf ("write-only");
					break;
			case O_RDWR:
					printf ("read-write");
					break;
			case O_RDONLY: printf ("read-only");
					break;
			default: printf("No such mode");
		  }
		  if (arg1 & O_APPEND)
		    printf (" -append flag set");
		  printf ("\n");
		return (0);
    }
    ```

    <div class="center">
      <figure>
        <a href="/images/2021/linux/b7.png"><img src="/images/2021/linux/b7.png" width="400" ></a>
      </figure>
    </div>

    O_ACCMODE ⇒ bitewise 연산을 통해 access 모드를 알아낼수 있다.


### Redirection

- File descriptor 0,1,2는 처음에 I/O device들로 할당이 된다.
    - 0 to the keyboard, 1 and 2 to the display

```c
$ prog_name
```

- input of prog_name이 standard input으로부터 읽힌다.

```c
$ prog_name < infile
```

- input of prog_name이 infile로부터 읽힌다.
    - < :input redirection operator이다.

```c
newfd = open(“infile”, O_RDONLY);
dup2(newfd, 0);
```

- 0으로 접근하면 newfd로 redirection 된다.

```c
$ prog_name < infile > outfile
```

- infile로부터 prog_file의 입력이 읽히고, pro_name의 output이 outfile로 쓰여진다.

```c
$ prog_1 | prog_2
```

- input of prog2가 prog1의 출력으로부터 읽혀진다. `|`은 pipe관련된 것이다.
    - 프로세스간 연결을 해줄 수 있다.
    - `|` : 프로그램1의 스탠다드 output이 프로그램2의 input으로 연결된다. 이런 개념을 pipe라고 한다.
- standard input/output

    ```c
    #include <stdlib.h>
    #include <unistd.h>
    #define SIZE 512
    main() {
      ssize_t nread;
      char buf[SIZE];
      while ( (nread = read (0, buf, SIZE)) > 0)
         write (1, buf, nread);
    exit (0); }
    ```

    - 사이즈가 512인데, 사이즈만큼 읽어서 fd 0번 buf에 넣어달라. 넣어진만큼 nread로 반환되고, 0보다 크다면 읽어졌다는것을 의미하고 fd 1번에 nread만큼 써달라.
    - return key가 눌려질 때마다 각 라인이 출력된다.

### standard i/o library

- 버퍼 사이즈에 따라 read, write의 성능이 달라진다. 프로그래머들이 성능에 대해 고려해야 하고, 부담이 된다. 그래서 C에서는  standard i/o library를 제공한다. 시스템 콜과 비슷한데 추가적인 기능을 제공한다. (auto buffering, stdio.h, more programmer-friendly interface)
- standard i/o vs Unix I/O

    - Unix I/O에서는 파일 디스크립터  값을 통해 파일을 다뤘다. standar i/o에서는 file structure를 이용하여 파일을 다룬다. fopen과 같은 함수들은 int인 fd를 반환하는 것이 아니라 파일 구조체인 `FILE*` 을 반환한다.

    - 라이브러리 함수들도 call하면 내부에서 동일하게 시스템 콜이 호출된다.


### standard i/o : fopen

```c
#include<stdio.h>

FILE *fopen(const char *restrict pathname, const char * restrict type)
```

- `* restrict` 포인터 : pathname과 type에 대한 포인터가 다른것을 보장한다. 같은 포인터가 오면 안된다. pathname과 type이 서로 다른 포인터로 주어져 어셈블리어로 바뀌었을때 instruction과 관련하여 최적화 하는 방법이 적용된다.
- type
    - r : read
    - w : truncate to 0 length가 기본
    - b : binary
    - a : append
    - r+: open for reading and writing
    - w+ : create reading and writing (truncate는 동일)
    - a+ : end of file부터 read, write

### standard i/o : getc, putc

```c
#include <stdio.h>
int getc(FILE *istream);
int putc(int c, FILE *ostream);
```

- `getc` : file structre pointer를 받아서 character하나를 읽어온다. 다음 character를 반환한다.

- `putc` :file structre pointer를 받아서 character하나를 써준다. 성공하면 c를 반환한다.


### Buffering

<div class="center">
  <figure>
    <a href="/images/2021/linux/b8.png"><img src="/images/2021/linux/b8.png" width="400" ></a>
  </figure>
</div>

- standard I/O는 elegant buffering mechanism을 통해 비효율을 피한다.
- buffer는 stream에서 I/O가 처음 실행될때 malloc을 호출하여 사용된다. standard I/O에서 버퍼링을 자동으로 해주는 시스템이 있어서, 시스템 콜 호출을 최소화 시킨다.

### standard i/o : fprintf

```c
#include <stdio.h>

int fprintf(FILE *restrict fp, const char *restrict format, ...);
```

- print와 동일한데, 특정 파일로 출력한다. character 수를  반환한다.

### error handling

- 시스템 콜이 -1을 return하면 error 때문이다. UNIX는 error code constants를 errono에 저장한다.
- 각 constant들은 character E로 시작한다.
- errno는 시스템 콜동안 발생한 error중 마지막 type을 저장한다. errno는 전역변수이다. 새로운 시스템 콜이 에러를 만들지 않았다고 해도, reset되지 않는다. 그래서 system call이 실패한 직후에 errno을 사용해야 한다.
- perror를 사용하면 에러와 관련된 메시지를 출력해 준다. 2 → file이 존재하지 않을때, 3→ no permission to read.
