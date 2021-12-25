---
title: github 사용법
layout: post
Created: December 24, 2021 3:05 PM
tags:
    - github
use_math: true
comments: true
---

>협업을 위한 사용법이 아닌, gpu server를 사용하기 위한 간단한 command 사용법 입니다.
>

1. git repository clone

    ```bash
    git clone [REPO_URL] [DIR]
    ```

    - DIR 안적으시면 기본적으로 root directory에 저장합니다.


1. print git status

    ```bash
    git status
    ```

    - 현재 git 상태를 출력합니다.  tracked file과 untracked file을  출력합니다.
    - tracked file들은 이미 repository에 있는 파일들로, 수정하는것에 대해 track한 file들을 의미합니다.
    - untracked file들은 repository에 없던 파일들을 의미합니다.

2. git add

    ```bash
    git add -u
    ```

    - 위 코드를 사용하면 -updated tracked file에 대해 모두 stage area에 올려줍니다. stage area에 commit할 수 있는 파일들이 있는 공간입니다.

    ```bash
    git add [filename]
    ```

    - -u 대신에 [filename]을 적으시면 각각의 파일에 대해 add 하실수 있습니다.


1. git commit

    ```bash
    git commit -m "commit message"
    ```

    - stage area에 올라와 있는 파일들에 대해 commit을 해줍니다. commit을 하면 local repository에 파일들이 저장됩니다.


1. git push

    ```bash
    git push origin [branch name]
    # 기본적으로 git push origin master를 사용하시면 됩니다.
    ```

    - local repository에 있는 파일들을 remote repository에 저장합니다. github user  name과 pwd를 적으셔야 합니다. 올해부터 pwd 대신 setting/ developer’s setting에서 받을 수 있는 token을 입력하셔야 합니다.

2. git pull

    ```bash
    git pull [remote] [branch]
    # git pull origin master
    ```

    - remote repository에 있는 파일들을 받아 옵니다. 이때 현재 local directory에서 tracked file들과 conflict가 날 수 있습니다. 이러한 경우 아래의 명령어를  사용합니다.

    ```bash
    git stash
    ```

    - git stash는 새로운 stash를 스택에 만들어 하던 작업을 임시로 저장하고, working directory를 clean하게 만들어 줍니다 (HEAD 상태).  쉽게 말하면  stash는 commit하지 않고 스택에 저장하는 방법입니다.

    - stash stack에 저장된 stash를 제거하는 명령어는 다음과 같습니다.

    ```bash
    git stash drop
    ```

    cf) git stash list 를 사용하시면 stash 목록을 보여줍니다.


### 정리

최초로 remote repository에서 파일들 받아오실때는 git clone [remote repo url] 사용하시면됩니다.

1. 만약 코드를 수정하시고 업로드 하고자 하실때는 git add → git commit → git push origin master 사용하시면 됩니다.
2. 만약 노트북에서 코드 수정하시고, 컴퓨터에서 다시 코드를 받아서 수정하고자 하실때는 git pull origin master → 1번 반복 수행.
