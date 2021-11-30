---
title: Linux | Signal and  Signal Processing
layout: post
Created: November 25, 2021 7:13 PM
tags:
    - Linux
use_math: true
comments: true
---

> 인하대학교 컴퓨터공학과 이어진 교수님 리눅스프로그래밍 수업을 바탕으로 정리한  내용입니다.
>

### Signal Concepts

- signal은  software interrupt이고, 비동기적 이벤트들을 다룰때 사용한다.
- signal을 받은 프로세스는 그 signal에 해당하는 행동을 해야하고, 신호에 따라 default action이 정해져있다. (바꿀 수 있긴하다.)
- signal은 error와 다르다. signal로 인한 종료는 error가 나서 종료나는 것이 아닌 default action이 종료한 것일 뿐이다.
- 가장 대표적인 signal은 `ctrl + c` 이다. `ctrl + c` 를 입력하면 커널은 `SIGINT`라는 signal을 foreground  group에 있는 모든 프로세스에게 보낸다. 그리고 `SIGINT` 의 default action은 termination이다.

---

### Signal Name & Generation

- 기본적으로`signal.h` 라는 헤더안에 signal은  64개정도 있다.  각 시그널은 번호와 모두 매칭되어 있고, positive integer로 정해져있다.
- signal을 발생시키는 여러가지 conidtion이 있다.
    - terminal-generated signal : ctrl + c → SIGINT
    - hardware exception signal : divided by 0 → SIGFPE
    - kill system call in the process or kill command  in shell
    - software conditions (SIGURG, SIGPIPE, SIGALAM)
- kill -l command를 통해 signal.h에 있는 signal 리스트를 출력할 수 있다.

    ```c
    $ kill -l
     1) SIGHUP	 2) SIGINT	 3) SIGQUIT	 4) SIGILL	 5) SIGTRAP
     6) SIGABRT	 7) SIGBUS	 8) SIGFPE	 9) SIGKILL	10) SIGUSR1
    11) SIGSEGV	12) SIGUSR2	13) SIGPIPE	14) SIGALRM	15) SIGTERM
    16) SIGSTKFLT	17) SIGCHLD	18) SIGCONT	19) SIGSTOP	20) SIGTSTP
    21) SIGTTIN	22) SIGTTOU	23) SIGURG	24) SIGXCPU	25) SIGXFSZ
    26) SIGVTALRM	27) SIGPROF	28) SIGWINCH	29) SIGIO	30) SIGPWR
    31) SIGSYS	34) SIGRTMIN	35) SIGRTMIN+1	36) SIGRTMIN+2	37) SIGRTMIN+3
    38) SIGRTMIN+4	39) SIGRTMIN+5	40) SIGRTMIN+6	41) SIGRTMIN+7	42) SIGRTMIN+8
    43) SIGRTMIN+9	44) SIGRTMIN+10	45) SIGRTMIN+11	46) SIGRTMIN+12	47) SIGRTMIN+13
    48) SIGRTMIN+14	49) SIGRTMIN+15	50) SIGRTMAX-14	51) SIGRTMAX-13	52) SIGRTMAX-12
    53) SIGRTMAX-11	54) SIGRTMAX-10	55) SIGRTMAX-9	56) SIGRTMAX-8	57) SIGRTMAX-7
    58) SIGRTMAX-6	59) SIGRTMAX-5	60) SIGRTMAX-4	61) SIGRTMAX-3	62) SIGRTMAX-2
    63) SIGRTMAX-1	64) SIGRTMAX
    ```

- 모든 signal들은 그 signal이 사용되는 목적을 나타내는 이름을 갖고 있다.
    - SIGABRT : abort()라는 함수를 사용하는 경우가 있는데, SIGABRT라는 시그널을 발생시키는 함수이다. default action이 종료이다.
    - SIGALARM : 특정 시간이 지나면 알람이 울린다.
    - SIGCHLD : process가 종료되거나 중지되면 sigchld라는 시그널이 부모에게 보내진다. 부모가 sigchld를 받으면, 자식 중에 하나가 종료되거나 stop되었다는 것을 알 수 있다.
    - SIGCONT : SIGCONTIUE의 약자. 멈춘 process에게 SIGCONT signal을 보내 계속되게 할 수 있다.
    - SIGFPE : 연산을 하다가 exception이 발생할 경우 하드웨어 상에서 발생 된다. 하드웨어가 처리할수없는 수적 연산에 대한 것이다.
    - SIGILL : 연산적이 부분 말고 illegal한것 요구하면 하드웨어가 할수없다고 이 시그널을 보낸다.
    - SIGINT : interrupt의 의미로, forground 프로세서에게 전부 간다. 기본동작은 termination.

    > kill을 설명하기 앞서 시그널 에 대한 대응을 먼저 설명하겠다.
    >
    >
    > 시그널은 기본적으로 세가지 대응을 할 수 있다.
    >
    > - (1) default : 리눅스에서 정해놓은 것이다.
    > - (2) user-define : 내가 정의한 함수를 등록할 수도 있고, 이것을 catch라고 한다. signal을 잡아서 내가 하고싶은 일을 하겠다.
    > - (3) ignore : 무시한다는 것이다.
    >
    > SIGKILL, SIGSTP을 제외한 signal들은 catch가 가능하다.
    >
  - SIGKILL : process를 termation 시키는 signal이고, catch, ignore 될수 없다. SIGKILL은 ignore, catch될  수 없고, 무조건 defailt동작을 한다.
  - SIGSTOP : catch, ignore될  수 업는 또 하나의 시그널이다. SIGKILL과 차이점은 terminate가 아니라 stop된다. SIGCONT를 보내면 stop되었던 애가 다시 시작함.
  - SIGPIPE : 프로세스 A와 B사이에 통신하는 방법을 파이프라고하는데, A가 B에게 데이터를 파이프를 통해 보내다가 B가 없어지면 끊어진 파이프가 되고, 이때 파이프를 쓰려고 하면 SIGPIPE가 발생한다.
  - SIGSEGV : invalid memory reference 정의되지 않은 메모리 공간을 접근한다고 하면 SIGSEGV가 발생한다. core dumped라는 것을 같이 수행한다.
  - SIGTERM : kill과 비슷하고, terminate signal을 보낸다. kill을 통해서 기본적으로 발생하는 시그널. ignore, catch될 수 있다..
  - SIGTSTP : terminal에 generate되는 stop signal 이다. 터미널에서 주는 stop. ctl + z를 누르면 forground process group으로 SIGTSTP이 간다.
  - SIGURS1 : user defined signald으로 kill이라는 커맨드를 통해서 이 커맨드를 보낼 수 있다.

    ---


### Signal

- signal은 software notification으로, 프로세스에게 가는 비동기적 알림과 같은 것이다.
- 대부분의 default가 termiation이다. signal을 발생시키는 event가 발생했을때 signal이 만들어진다.
- lifetime : signal이 generate되어 delivery되는 순간까지를 lifetime이라 한다.

  <div class="center">
    <figure>
      <a href="/images/2021/linux/sig0.png"><img src="/images/2021/linux/sig0.png" width="400"></a>
    </figure>
  </div>

    process a가 signal을 만들어서 b에게 전달을 한다. 어떠한 이유로 이 시그널을 바로 받지 못하고 좀 나중에 받는다. → 저 시간을 lifetime이라 하고, signal이 delivery가 되지 않고 기다리고 있는것을 pendnig 되있다고 말한다.

- 만약 signal이 전달되었을때, signal handler가 실행되면 Process가 signal을  catch한다.
- signal handler를 따로 등록하면 user-defined function이 된다. sigaction이라는 시스템 콜을 호출해서 signal handler를 등록할 수 있다.

    ---


### Exit Status Macro  다시정리!!

- WIFEXITIED : child가 정상적으로 exit되엇는지 봄.
- WIEXITSTATIS: 그때 status를 읽어줘. exit 시스템콜을 통해서 종료될 경우만 의미.
- WIFSIGNALED : exit이긴 한데 signal과 함께 종료.
- WITEGRMSIG: 그떄 signal을 읽는다. signal을 받아서 종료되는 경우는 wifsignaled로 확인이 가능하다.
- WIFSOTPPED : signl을 통해서 stop되엇을때 0이 아닌  값을 반환.
- wstopstig : 그때의 sig.
- wifcontinued : child가 continue될때 시그널 값.

---

### Normal  and  Abnormal Termination

- 부모  프로세스는 termination status를 통해 자식 프로세스에게 어떤 일이 일어났는지 알 수 있다.
    - `WIFEXITIED` 매크로를 통해 exit을 통해 정상적으로 종료되었는지 알 수 있다.
    - `WIFSIGNALED` 매크로를 통해 시그널을 통해서 종료되었는지 알 수 있다.
    - `WIFSOTPPED` 매크로를 통해 시그널을 통해서 stop되었는지 알 수 있다.
- core dump : 정상종료가 아니라 치명적인 signal을 받아서 종료되면 core dump를 수행한다. memory에 있던 데이터들을 current working directory에 모두 저장시킨다.
- [core.pid](http://core.pid) 형태로 저장된다. 예를들어 core.1000. 코어 파일이 필요하다면 리눅스 버전에 따라 어디에 저장되는지 달라진다.
- WCOREDUMP매크로는 core dump가 만들어진것을 확인한다. coredump가 만들어졌다면 1을 반환한다.
- 즉, 비정상적인 종료인 경우 coredump를 만들고, 특정한 파일 형태로 만들어진다.

---

### Signal Handling

프로세스가 시그널을 받으면 다음 세가지 action 중 한가지를 한다.

1. Default action
    - 모든 시그널이 default action을 갖는다.
    - 보통 default action은 프로세스를 종료시킨다.
    - SIGUSR1, SIGUSR2는 default action은 signal을 무시한다.
2. Ignore action
    - ignore는 하던거 계속하라는 시그널이다.
    - unexpected  problem을 발생시킬 수도 있다. ex) 0으로 나눠라 → 하드웨어가 어떻게 처리 되는지 모르는데 ignore하면 문제가 발생할수 있다.
    - 예상치 못한 문제를 막기 위해 sigkill, sigstop은 무시될 수 없다.
3. User - defined action
    - user는 시그널이 발생하면 user-defined  function을 호출하여 kernel에 접근할수있고, 이때 signal handler가 실행되면 signal을 catch한다고 한다.
    - sigkill(termination), sigstop(stop)은 캐치될수없다.

---

### Signal Handling: User - Defined Action

- signal이 catch되면 프로세스에서 실행하고 있던 normal sequence of instruction은 signal handler에 의해 인터럽트된다.
- signal handler가 return되면 (시그널이 catch 되었을때, 프로세스가 실행하고있던)  normal sequence of instruction가 계속 실행된다.
- 하지만 signal handler안에서는 process가 catch된 시점에 어떤것을 수행했는지는 모른다.
- 예를들어, 다음 예시를 보자. 특정한 프로세스 PROG가 수행하고 잇다가, SIG#12 를 PROG이 받았다고 하자.12번에 맞는 sig_handler를 수행한다. 수행하는 중에 12번이 다시 들어오면 block되고, pending되어 있다가 handler에서 돌아오는  순간에 다시 수행된다.

![Untitled](/images/2021/linux/sig1.png)

- 만약 시그널 핸들러 안에서 exit() 함수가 호출되면 다시 안돌아온다.

---

### Signal Set

- 시그널 핸들링 할때 여러개를 모아서 정의할 수 있다. signal 중에 user가 원하는 것을 모아서 정할 수 있고, 그 signal set을 sigset_t을 사용하여 정의한다. (signal.h에 포함되어있는 signal들)
- signal set 을 만드는 방법은 2가지가 있다.
    1. 비어있는 set에 SIG#을 추가
    2.  64번에서 특정 sig#을 빼는 방법이 있다.

### Functions  for Signal Set

```c
int sigemptyset(sigset_t *set); /* Initialization */
int sigfillset(sigset_t *set); /* Initialization */
int sigaddset(sigset_t *set, int signo); /* Add */
int sigdelset(sigset_t *set, int signo); /* Delete */
int sigismember(const sigset_t *set, int signo);/* Check */
```

- sigemptyset : 빈 set을 만든다.
- sigfillset: 기본적으로 텅 비어있는 set을 가득 채운다.
- sigaddset,  sigdelset: 내가 다루고자하는 set에다가 넣거나 빼고자 하는 sig#을 인자로 넘기면 된다.
- sigismember : 특정 sig번호가 있는지 체크한다.
- sigemptyset, sigfillset, sigaddset, sigdelete 성공했을때 0을 반환하고, 에러시 -1을 반환한다.
- sigismember는 참일때 1, false일때 0을 반환한다.
- 다음 그림 처럼 sigset을 구성할 수 있다. sigemptyset으로 빈 sigset을 만들고, sigfillset으로 모든 시그널을 채우고, sigdelset, sigaddset으로 sigset을 수정한다.

  ![Untitled](/images/2021/linux/sig2.png)


---

### System Call: sigaction

```c
#include <signal.h>
int sigaction(int signo, const struct sigaction *act,
															struct sigaction *oact);
```

- sigaction은 특정 signal에 대한 action을 수정할 수 있다. 성공하면 0, 에러시 -1을 반환한다.
- `int signo`: 내가 처리하고자하는 signum.
- const struct sigaction *act: sig action 구조체의 주소가 act에 들어간다. sigaction 구조체에서 signal의 action에 대한 function을 정해준다.
- `const struct sigaction *oact`: 기존의 action은 oact에 담을  것이다.

### struct sigaction

```c
struct sigaction {
	void (*sa_handler)(int); /* addr of signal hander */
	sigset_t sa_mask; /* signals to block under signal handling */
	int sa_flags; /* signal options */
	void (*sa_sigaction) (int, siginfo_t *, void *); /* alternate signal handler */
};
```

- `void (*sa_handler)(int)` : signal handler의 주소. 특정한 function은 integer type을 인자로 받고 , 이것은 signo이다.
- `sigset_t sa_mask` : signal set을 의미하고, signal handling하는 동안 block(mask) 시킬 애들을 적어준다. (ignore 되는 것이 아닌 block 되는 것이다.)
- `int sa_flag` :  파일 오픈할때 그것과 유사한 option.
- `void (*sa_sigaction) (int, siginfo_t *, void *` :  sa_sigaction = alternative signal handler이다. 구조체의 첫번째 멤버인 sa_hanlder와 argument가 다르다. sa_hanlder는 signo만 받고, sa_sigaction는 signno와 singinfo ,void를 받는다. sa_sigaction의 핸들러가 조금 더 많은 정보를 가지고 핸들링할 수있는 함수이다. 실제로는 sa_hanlder, sa_sigaction 중 하나만 쓴다. sa_flag에 SA_SIGINFO를 사용하면 마지막멤버인  sa_sigaction을 핸들러로 쓴다.
- sig_flags
    - flag들은 대표적으로 8개 정도 있다.(SA_INTERRUPT, SA_NOCLDSTOP, SA_NOCLDWAIT, SA_NODEFER, SA_ONSTACK, SA_RESETHAND, SA_RESTART, SA_SIGINFO)


    <div class="center">
      <figure>
        <a href="/images/2021/linux/sig3.png"><img src="/images/2021/linux/sig3.png" width="400"></a>
      </figure>
    </div>


- process A가 어떤 프로세스를 쭉 수행하고 있는데, 어떠한 시스템콜을 수행한다고 해보자. 중간에 signal이 오면 시스템콜이 두가지 행동(interrupt or continue)을 할 수 있다.
- SA_interrupt : 시그널이 와서 인터럽트 되면 시스템콜이 종료되고, 시스템콜을 재시작하지 않는다. 시스템콜이 종료하고, signal을 수행하는것이 defualt action이다.
- SA_NOCLDWAIT : signal이 와서 child가 종료될때 parent에서 wait을 호출해야 완전히 종료가 된다. SA_NOCLDWAIT를 flag로 시그널 핸들러를 사용하면 wait이 없어도 child가 완전히 종료가 된다. 즉, 좀비가 되지 않는다.
- SA_SIGINFO : SA_SIGINFO flag를 사용하면 sa_sigaction을 시그널 핸들러로 사용한다.
- 이런식으로 sa_flag에 따라서 특정 행동을 핸들러에서 수행할 수 있게 한다.

---

### Example: Catching SIGINT

```c
#include <signal.h>
#include <stdio.h>
#include <unistd.h>
#include <stdlib.h>

void catchint(int signo){
    printf("\nCATCHINT: signo-%d\n",signo);
    printf("CATCHINT: returing\n\b");
}

int main(){
    static struct sigaction act;
    void catchint(int);

    act.sa_handler = catchint; // handler 등록
    sigfillset(&(act.sa_mask)); // 시그널 핸들러 수행동안 모든 시그널 block.
    sigaction(SIGINT,&act,NULL);

    printf("sleep call #1\n");
    sleep(1);
    printf("sleep call #2\n");
    sleep(1);
    printf("sleep call #3\n");
    sleep(1);
    printf("sleep call #4\n");
    sleep(1);

    printf("Exiting\n");
    exit(0);

}
```

SIGINT signal에 대해 `catchint` 함수를 signal handler 함수로 사용할 것이다. 위의 구조체로 선언한 act에는 (1) sa_handler, (2) sa_mask, (3)sa_flags, (4)sa_sigaction의 정보가 담겨있다. ( sa_handler, sa_mask 멤버만 사용한 것이다.)

SIGINT의 default action은 수행중이던 system call에 대해 interrupt하여 종료하는데, 위 햄들러에서는 핸드러 action이 끝나면 다시 돌아와서 다음 명령어를 수행한다.

### Example: Restoring a Previous Action

```c
static struct sigaction act, oact;
void catchint(int);

sigaction(SIGINT,NULL,&oact); // store the previous action for  sigint in oact

act.sa_handler = catchint;
sigfillset(&(act.sa_mask));
sigaction(SIGINT,&act,NULL); // set the action for siginit
//....
sigaction(SIGINT,&oact,NULL); // restore the previous action
```

이전 시그널 핸드러의 action 저장하기 위해 oact라는  sigaction 구조체를 선언해준다. 새로운 signal handler를 setting하기 전에 이전 handler의 정보를 저장해두고 restore했다. (사실 새로운 handler를 setting할때, sigaction의 세번째 인자로 넣어주면된다.)

### Example: A Graceful Exit

```c
void g_exit(int s){
    unlink("tempfile");
    fprintf(stderr,"Interruptedd - exiting\n");
    exit(1);
}
act.sa_handler = g_exit;
sigaction(SIGINT,&act,NULL);
```

tempfile을 작성하는 중에 SIGINT 시그널을 받았을때, 어떤 action을 할지 정한 handler 함수이다. SIGINT와 동일하게 종료하지만, unlink를 통해 tempfile을 지워준다. (아름답게 퇴장!)

---

### Structure:  siginfo_t

`void (*sa_sigaction)(int, siginfo_t *, void *)`: sigaction 구조체에서 네번째 멤버로, `alternative signal handler` 사용되는 핸들러 함수이다. siginfo_t에는 다음과  같은  정보가 들어간다.

```c
struct siginfo_t {
    int si_signo; // signal number
    int si_errno; // if nonzero, errno value from <errno,h>
    int si_code; // addditional info
    pid_t si_pid; // sednig process ID
    uid_t si_uid; // sendig process real user id
    void *si_addr; // address that caused the fault
    int si_status; // exit vaulue or signal number
    long si_band; // band nubmer for SIGPOLL
    //...
};
```

siginfo_t 구조체는 왜 signal이 generate되었는지에 대한 정보를 포함하고 있다.

---

### Example: sa_sigaction

```c
#include <signal.h>
#include <stdio.h>
#include <unistd.h>
#include <stdlib.h>

void sig_handler(int sig, siginfo_t *sigifo, void* parma2){
    printf("[Parent:%d]: receive a signal from child %d\n",getpid(),sigifo->si_pid);
}

int main(){
    pid_t pid;
    static struct sigaction act;
    act.sa_sigaction = sig_handler;
    act.sa_flags = SA_SIGINFO;
    sigfillset(&act.sa_mask);
    sigaction(SIGUSR1, &act, 0);

    int i=0;
    while(pid=fork()){
        printf("[Parent:%d]: create child %d\n\n",getpid(),pid);
        if(i++==3) break;
    }
    if(pid>0)
        getchar();                  // for parent process
    else                            // for child process
        kill(getppid(), SIGUSR1);   // send SIGUSR1 to the parent process
    return 0;
}
```

sa_sigaction을 어떻게 사용해야하는지에 대한 코드이다. fork()를 통해 4개의 child process (c0,c1,c2,c3)를 만든다. process는 parent, c0~c3가 있다.   내가 이해한 대로라면, getchar()로  Parent process가 종료하지 않게 block시켜놓고, 4개의 child process에 대해 SIGUSR1 시그널을 주어 SIGUSR1의 signal handler를 수행하게 한다.

다음은 위 코드에 대한 결과이다.

```c
[Parent:3810]: create child 3811

[Parent:3810]: receive a signal from child 3811
[Parent:3810]: receive a signal from child 3812
[Parent:3810]: create child 3812

[Parent:3810]: create child 3813

[Parent:3810]: receive a signal from child 3813
[Parent:3810]: create child 3814

[Parent:3810]: receive a signal from child 3814
```

---

### Signals and System Call

- process가 system call을 수행하는중에  시그널을 받았다면 시그널 blocking 하고 system call이 다 끝나면 처리하는게 default 동작이다.
- 하지만 만약에 시스템콜이 너무 오래걸리고, 시그널이 급박한것이라면 시스템 콜을 interrupt시키고, -1을 반환하여 errno으로 EINTR를 setting한다. (시스템콜은 성공하면 0, 실패하면 -1을 반환한다. 느린  시스템콜이 -1을 반환하는 이유중 하나이다.)
- 느린 시스템콜의 종류은 다음과 같다.
    1. pipe , terminal 입출력
    2. pause(). wait()은 오래 걸릴 수있고, 언제 return될지 모른다. child를 끝날때까지 기다린다.
    3. ioctl 연산
    4. some of interprocess communication functions.
- 위 시스템콜을 제외한 것 중  조심해야 하는 것이 있다. 느린 시스템 콜은 아닌데, read/write은 조심해야한다. read/write은 느릴수도 있고, 아닐  수도 있는데 기본적으로는 아니다. file이 local disk에 있을때는 read,write은 느린 시스템콜은 아니다. 파일 시스템이 컴퓨터 내부에 있는 파일 시스템이라면 느리지 않다. 하지만 만약에 네트워크를 타고 멀리 있는 디스크에 파일 시스템이 있고, 그것에 대해 read/write을 하면 느린 시스템 콜이다.

    ```c
    while((write(tfd,buf,size))<0){
            if(errno==EINTR){
                warn("Write  interrupted")
            }
        }
    ```

    위 코드처럼 write하다가 interrupt되는 경우 다음 문자열을 출력하게 할 수있다.

- 시스템콜을 실행하다가 시그널이 와서 interrupt되면 기존의 시스템콜은 종료하고 시그널 핸드러 함수를 수행한뒤, 프로그램이 종료되는것이 default action이다. struct sigaction의 sa_flag를 SA_RESTART로 정하면, 인터럽트가 와서 시스템콜을 종료하고, 핸들러함수를 수행한뒤, 시스템콜을 다시 실행시켜준다.

---

### More about Signals

- signal handler 호출되었을때, 기본적으로 signal handler를 호출한 시그널 또한 signal mask에 등록된다. (struct sigaction sa_mask).  `sa_mask |= #signo`
- 그 signal handler가 종료되면, 원래의 signal mask로 set된다.
- 즉, 동일한 시그널이 해당 시그널 handler 함수를 수행할때 들어온다면,  Pending된다는 것을 보장할 수 있다.

---

### Function: sigsetjmp  & siglongjmp

```c
int sigsetjmp(sigjmp_buf env, int savemask)  
int siglongjmp(sigjmp_buf env, int val)
```

- `<setjmp.h>` 에 선언 되어있는 C library 함수이다.
- sigsetjmp, siglongjmp는 signal handler에서 branching할때 사용한다.
- sigsetjmp를 선언을 하면 프로그램이 수행하다가 signal이 들어오면 singal handler를 수행하고 원래는 끝나면 다시 돌아가는 것이 아니라 sigsetjump로 돌아간다. 돌아갈때 사용하는 함수가 siglongjmp이다.
- sigsetjmp는 sigjmp_buf라는 env 변수에 process location(stack에 존재하는)과 signal mask를 저장한다.
- siglongjmp는 sigjmp_buf env에 저장되어 있는 process location으로 jump한다.
- sigsetjmp는 두번 return한다. 시점상으로 두번 return. 처음 call 될때 (set 될때), siglongjmp가 호출되어 sigsetjmp가 리턴된다. 바로 호출되었을때는 0으로 return, siglnogjmp가 호출되어 sigsetjmp가 호출될 경우에는 nonzero value로 siglongjmp의 두번째 인자를 반환한다.

    ```c
    #include <sys/types.h>
    #include <signal.h>
    #include <setjmp.h>
    #include <stdio.h>
    sigjmp_buf position;

    void main() {
        static struct sigaction act;
        void goback (void);
        //...
        if (sigsetjmp(position, 1) == 0) { // store the current location in position
            act.sa_handler = goback;
            sigaction(SIGINT, &act, NULL);
        }
        domenu();
        //...
        }
    void goback(void) {
        fprintf(stderr, "\nInterrupted\n");
        siglongjmp(position, 1); // go back to  the position
    }
    ```


---

### Signal Blocking

위에서 sigaction을 통해 blocking과 관련된것을 배웠다. signal blocking 관련하여 실제로는 sigacation보다 다른 signal blocking( `sigprocmask`)함수를 사용한다고 한다. 이에대해 알아보자.

- 프로그램이 중요한 코드를 수행중일때, interrupt로부터 보호하는것이 좋다. 그때 signal bloacking을 사용한다.
- 아래 그림처럼, signal blocking이 끝나면 해당 signal에 대한 signal handler를 수행하는 것을 볼 수 있다.

  ![Untitled](/images/2021/linux/sig4.png)



---

### System Call: sigprocmask

```c
#include <signal.h>
int sigprocmask(int how, const sigset_t *set, sigset_t *oset);
```

- `how` : setting하고자 하는 마스크. `set`: 내가 세팅하고자 하는 마스크. `oset` : 기존 마스크.
- `how` 에 들어가는 flag들은 다음과 같다.
    - SIG_BLOCK: 기존의 blockset에 특정 set을 add.
    - SIG_UNBLOCK: 기존의 blockset에 특정 set을 delete
    - SIG_SETMASK: 기존의 blockset을 특정 set으로 덮어쓰기.
- `set`: 위의 how에서의 특정 set에 해당한다. null이라면 signal mask가 바뀌지 않는다.
- `oset`: 현재 signal mask를 저장하는 sigset_t 이다.
- 보통 sigprocmaks를 사용할때, add하고 나서 특정 code 수행하웨 delete하여 원래 mask로 돌아온다.

---

### Example: sigprocmask

```c
#include <signal.h>
void main () {
    sigset_t set1, set2;
    sigfillset(&set1);
    sigfillset(&set2);
    sigdelset(&set2, SIGINT);
    sigdelset(&set2, SIGQUIT);

    /* executing insignificant code */
    sigprocmask(SIG_SETMASK, &set1, NULL);

    /* executing most significant code */
    sigprocmask(SIG_UNBLOCK, &set2, NULL);

    /* executing less significant code */
    sigprocmask(SIG_UNBLOCK, &set1, NULL);
}
```

set1에 모든 signal에 대해 mask를하고, set2는 SIGINT, SIGQUIT를 제외한 모든 signal를 mask하는 sigset_t이다.

---

### Sending Signals

- 하나의 프로세스에서 다른 프로세스 또는 프로세스 그룹에게 signal을 보낼 수 있다. 또한 자기 자신에게도 보낼수 있다.
- 아래 그림을 보자.프로그램 1이 프로그램 1에게 시그널을 보내서 시그널 핸들러를 수행하고, 프로그램2가 실행하게된다.

  ![Untitled](/images/2021/linux/sig5.png)



---

### System Call : kill

```c
#include <signal.h>
int kill(pid_t pid, int signo);
```

- kill은 이름과 다르게 특정 프로세스를 죽이는 시스템 콜이 아니라 특정한 시그널을 보내는 시스템 콜이다. 시그널의 기본동작은 termination이다. 그래서 kill을 통해 시그널을 보내면 대부분 프로세스가 죽기(=terminate)때문에 kill이라는 이름이 붙어졌다.
- pid의 값에 따라 여러방식으로 작동 가능하다.
    - pid > 0 : pid값을 id로 갖는 프로세스에게 signal을 보낸다.
    - pid == 0 : sender의 group id와 같은 process group id를 갖는 모든 프로세스에게 시그널을 보낸다.
    - pid < 0 : abs(pid)값을 갖는 process group id를 갖는 모든 프로세스에게 시그널을 보낸다.
    - pid == -1 : 시그널을 보내기 위해 permission을 갖는 시스템의 모든 프로세스에게 시그널을 보낸다.
- sender process는 receiver process id를 알아야 한다.  parent와 child prcoesses 와 같이 매우 밀접하게 관계가 있는 process사이에서 kill이 사용된다.
- senser의 ruid or euid는 receiver의 ruid or euid와 같아야한다. super user는 모든 프로세스에게 시그널을 보낼 수 있다.

---

### Example : kill

```c
/* synchro */
#include <signal.h>
#include <stdio.h>
#include <unistd.h>
#include <stdlib.h>

int ntimes = 0;
int main() {
    pid_t pid, ppid;
    void p_action (int), c_action (int);
    static struct sigaction pact, cact;
    pact.sa_handler = p_action;
    sigaction(SIGUSR1, &pact, NULL);
    switch (pid = fork()) {
        case -1:
            perror ("synchro");
            exit(1);
        case 0:
            cact.sa_handler = c_action;
            sigaction (SIGUSR1, &cact, NULL);
            ppid = getppid();
            for (;;) {
                sleep(1);
                kill(ppid,SIGUSR1);
                pause();
            }
        default:
            for (;;) {
                pause();
                sleep(1);
                kill(pid,SIGUSR1);
            }
    }
}
void p_action (int sig) {
    printf("Parent caught signal #%d\n", ++ntimes);
}
void c_action (int sig) {
    printf("Child caught signal #%d\n", ++ntimes);
}
```

- child에서 parent에게 시그널을 보내고 signal이 올때까지 pause한다. 시그널이 오면 시그널 핸들러(c_ation)을 수행한다.
- parent에서는 시그널이 올때까지 pause하고 있다가 시그널이 오면 시그널 핸들러(p_action)를 수행하고, child에게 시그널을 보낸다.
- 결과

    ```c
    Parent caught signal #1
    Child caught signal #1
    Parent caught signal #2
    Child caught signal #2
    Parent caught signal #3
    Child caught signal #3
    ```


---

### System Call:  raise

```c
#include <signal.h>
int raise(int sig);
```

- 자기 자신에게 시그널을 보내는 시스템 콜이다. 활용도가 높진 않다.
- raise를 호출하는 시점에 signal handler를 호출하여 실행해도 된다.

---

### System Call: alarm

```c
#include <unistd.h>
unsigned int alarm(unsigned int secs);
```

- 특정 시간 후에 SIGALRM 시그널을 보내게 타이머를 set한다.
- alarm은 이전에 셋한 알람이 있다면, 남은 시간을 반환한다.
- alarm은 cumulative하지 않다. 0초에서 alarm(60)이 호출되고 나서 20초 alarm(60)이 호출되면 40을 반환한다. 그리고 80초때 SIGALRM 시그널을 받게 된다.

---

### System Call : pause

```c
#include <unistd.h>
int pause(void);
```

- pause를 호출한 process는 시그널을 받을때 까지 sleep하게 된다.
- process를 종료시키면 pause가 리턴되지 않는다. 시그널 핸들링 하는 과정에서 정상적으로 반환되어야 pasue가 리턴하는데, 중간에 끝난다면 리턴하지 않느다.
