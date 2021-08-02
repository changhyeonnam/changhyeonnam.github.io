---
title: 투 포인터(Two pointer)
layout: post
Created: August 2, 2021 12:32 PM
tags:
    - Algorithm
use_math: true
comments: true
---

```cpp
CTP 알고리즘 동아리에서 여름방학 코딩테스트반에 참여하여 공부한 내용입니다.
```

투 포인터는 두개의 포인터를 조작하면서 두 포인터가 가리키는 값이 특정한 조건을 만족하거나 두 포인터 사이의 구간이 조건을 만족할  경우에 대해 문제를 푸는 방식이다.

---

### A - 배열 합치기

두개의 포인터 ptr1,ptr2를 만들어 각 배열을 가리키면 합치는 문제였다. 각 포인터가 각 배열의 끝을 가킬때 while문을 빠져나오게 했다. 각 포인터가 가리키는 수 중 작은 수를 답에 추가하고, 해당 포인터를 한칸 앞으로 움직이게 했다. 만약 한개의 포인터만 배열의 끝을 가리킬때는 나머지 하나만 움직인다.

[11728번 배열합치기](https://www.acmicpc.net/problem/11728)

<details>
<summary>code</summary>
<div markdown="1">   

```cpp
#include <iostream>
#include <cstring>
#include <string>
#include <map>
#include <vector>
using namespace std;
typedef long long ll;
int n,m;
int arr[1000001];
int arr1[1000001];
vector<int>ans;
int main(){
    ios::sync_with_stdio(false);
    cin.tie(NULL);
    cin>>n>>m;
    for(int i=0;i<n;i++){
        cin>>arr[i];
    }
    for(int i=0;i<m;i++){
        cin>>arr1[i];
    }
    int ptr1=0,ptr2=0;
    while(1){
        if(ptr1==n && ptr2==m)
            break;
        if(ptr2==m) {
            ans.push_back(arr[ptr1]);
            ptr1++;
            continue;
        }
        if(ptr1==n){
            ans.push_back(arr1[ptr2]);
            ptr2++;
            continue;
        }
        if(arr[ptr1]<=arr1[ptr2]){
            ans.push_back(arr[ptr1]);
            ptr1++;
            continue;
        }
        if(arr[ptr1]>arr1[ptr2]){
            ans.push_back(arr1[ptr2]);
            ptr2++;
            continue;
        }
    }
    for(auto& i:ans){
        cout<<i<<' ';
    }
    return 0;
}
```
</div>
</details>
---

### B - 수들의 합 2

문제를 보자마자 누적합으로 풀릴것 같았지만 투포인터로  풀었다. 주어진 배열에 대해 두개의 포인터사이에 대한 합을 계산하여 경우의 수를 세주었다. 두개의 포인터 모두 배열의 끝을 가리킬때 while문에서 빠져 나왔다.

[2003번 수들의 합 2](https://www.acmicpc.net/problem/2003)

<details>
<summary>code</summary>
<div markdown="1">   

```cpp
#include <iostream>
#include <cstring>
#include <string>
#include <vector>
using namespace std;
typedef long long ll;
int n,m;
int ans;
int main(){
    ios::sync_with_stdio(false);
    cin.tie(NULL);
    cin>>n>>m;
    vector<int>arr(n);
    for(auto&i : arr)
        cin>>i;
    int sum = arr[0];
    int ptr1=0,ptr2=0;
    while(1){
        if(sum==m)
            ans+=1;
        if(ptr1==n-1 && ptr2==n-1)
            break;
        if(ptr2==n-1) {
            sum-=arr[ptr1];
            ptr1 += 1;
            continue;
        }
        if(ptr1==ptr2)
        {
            ptr2+=1;
            sum+=arr[ptr2];
            continue;
        }
        if(sum<=m){
            ptr2+=1;
            sum+=arr[ptr2];
            continue;
        }
        if(sum>m){
            sum-=arr[ptr1];
            ptr1+=1;
            continue;
        }

    }
    cout<<ans<<'\n';
    return 0;
}
```
</div>
</details>
---

### C - 귀여운 라이언

B번 문제와 동일한 방식으로 풀었다. 주어진 배열에 대해 두개의 포인터 사이의 라이언 인형 '1'의 값을 sum에 누적하였다. sum≥m일 경우에는 ptr1을 움직이고, sum<m일 경우에는 ptr2를 움직인다. ptr2가 항상 ptr1과  같거나  더  높은 인덱스를 가리킨다. ptr1이 움직이기전에, ptr1이 가리키고 있는 값이 1이라면 sum-=1을 하였다.

[15565번 귀여운 라이언](https://www.acmicpc.net/problem/15565)

<details>
<summary>code</summary>
<div markdown="1">   

```cpp
#include <iostream>
#include <cstring>
#include <string>
#include <vector>
using namespace std;
typedef long long ll;
int n,k;
int ans = 9876541;
int main(){
    ios::sync_with_stdio(false);
    cin.tie(NULL);
    cin>>n>>k;
    vector<int>arr(n);
    for(auto&i : arr)
        cin>>i;
    int sum = 0;
    int ptr1=0,ptr2=0;
    if(arr[ptr2]==1)
        sum+=1;

    while(1){
        if(sum==k) {
            ans = min(ptr2 - ptr1 + 1, ans);
        }
        if(ptr1==n-1 && ptr2==n-1)
            break;
        if(ptr2==n-1){
            if(arr[ptr1]==1)
                sum-=1;
            ptr1+=1;
            continue;
        }
        if(ptr1==ptr2){
            ptr2+=1;
            if(arr[ptr2]==1)
                sum+=1;
            continue;

        }
        if(sum>=k)
        {
            if(arr[ptr1]==1)
                sum-=1;
            ptr1+=1;
            continue;
        }
        if(sum<k){
            ptr2+=1;
            if(arr[ptr2]==1)
                sum+=1;
            continue;
        }
    }
    if(ans==9876541)
        cout<<-1;
    else
        cout<<ans<<'\n';
    return 0;
}
```
</div>
</details>
---

### D - 먹을 것인가 먹힐 것인가

<div class="center">
  <figure>
    <a href="/images/2021/two_pointer/twp.png"><img src="/images/2021/two_pointer/twp.png" width="400" ></a>
  </figure>
</div>

먼저 각 배열 A,B를 정렬을 한다. A1이 B1보다 크다면, A2,A3 또한 B1보다 크다. A2가 B2보다 크다면 A3 또한 B2보다 크다. 이러한 아이디어를 사용하면 된다. 만약 ptr1이 가리키고있는 배열 a의 원소가 ptr2가 가리키고있는 배열 b의 원소보다 크다면 값을 해당 ans[ptr1]++ 을 하고 ptr2를 한칸 움직 인다. 만약 b의 원소보다 작다면 ans[ptr1]의 값을 ans[ptr1+1]에 대입하고 ptr1을 한칸 움직인다.

만약 ptr2가 배열 b의 끝을 가르키고 있다면 ptr1의 다음 원소부터 배열 a의 끝까지 ans[ptr1]을 대입해준다.

[7795번 먹을 것인가 먹힐 것인가](https://www.acmicpc.net/problem/7795)

<details>
<summary>code</summary>
<div markdown="1">   

```cpp
#include <iostream>
#include <cstring>
#include <string>
#include <vector>
#include<algorithm>

using namespace std;
typedef long long ll;
int t,n,m;
int main(){
    ios::sync_with_stdio(false);
    cin.tie(NULL);
    cin>>t;
    while(t--) {
        cin>>n>>m;
        bool check[20001];
        memset(check,false,sizeof(check));
        vector<int> arr1(n);
        vector<int> arr2(m);
        vector<int> ans(n);
        for (auto &i : arr1)
            cin >> i;
        for(auto &i : arr2)
            cin >> i;
        int ptr1 = 0, ptr2 = 0;
        sort(arr2.begin(),arr2.end());
        sort(arr1.begin(),arr1.end());

        while (1) {
            if(ptr1==n || ptr2==m)
                break;
            if(!check[ptr2]&&arr1[ptr1]>arr2[ptr2]){
                check[ptr2]=true;
                ans[ptr1]+=1;
            }
            if(arr1[ptr1]<=arr2[ptr2]){
                ans[ptr1+1]=ans[ptr1];
                ptr1+=1;
                continue;
            }
            if(ptr2==m-1)
            {
                ans[ptr1+1]=ans[ptr1];
                ptr1+=1;
                continue;
            }
            else
                ptr2+=1;
        }
        int answer=0;

        for(int i=0;i<ans.size();i++) {
            answer += ans[i];
        }
        cout<<answer<<'\n';
    }
    return 0;
}
```
</div>
</details>
---

### E - 수고르기

일단 배열의 값이 10^9이하 이기 때문에 long long 타입을 사용한다. ptr2가 가리키는 값과 ptr1이 가리키는 값의 차이가 m보다 작다면 ptr2를 한칸 움직인다. 만약 차이가 m 이상이라면 답을 갱신하고, ptr1을 한칸 움직인다.

[2230번 수고르기](https://www.acmicpc.net/problem/2230)

<details>
<summary>code</summary>
<div markdown="1">   

```cpp
#include <iostream>
#include <cstring>
#include <string>
#include <vector>
#include<algorithm>

using namespace std;
typedef long long ll;
ll n,m;
ll ans = 98765432100;

int main(){
    ios::sync_with_stdio(false);
    cin.tie(NULL);
    cin>>n>>m;
    vector<ll> v(n);
    for(auto&i : v)
        cin>>i;
    ll ptr1=0,ptr2=0;
    sort(v.begin(),v.end());
    while(1){
        if(ptr1!=ptr2 && v[ptr2]-v[ptr1]>=m){
            ans = min(ans,v[ptr2]-v[ptr1]);
            if(ptr1!=n-1){
                ptr1+=1;
                continue;
            }
        }
        if(ptr2==n-1 && ptr1==n-1)
            break;
        if(ptr2==n-1){
            ptr1+=1;
            continue;
        }
        if(ptr1==ptr2)
        {
            ptr2+=1;
            continue;
        }
        if(v[ptr2]-v[ptr1]<m){
            ptr2+=1;
            continue;
        }
    }
    cout<<ans<<'\n';
    return 0;
}
```
</div>
</details>
---

### F - 두 용액

배열을 순회하며 두개의 용액에 대한 산성도를 합쳐서 계산하는 문제였다. 고려해야 할것은 0에 가까운 pair를 출력하는 것이기 때문에 두개의 합에 대해 절댓값을 취해서 정답을 계산하였다.

[2470번 두 용액](https://www.acmicpc.net/problem/2470)

<details>
<summary>code</summary>
<div markdown="1">   

```cpp
#include <iostream>
#include <cstring>
#include <string>
#include <vector>
#include<algorithm>

using namespace std;
typedef long long ll;
ll n;
ll ans = 9876543210;
int main(){
    ios::sync_with_stdio(false);
    cin.tie(NULL);
    cin>>n;
    vector<ll>v(n);
    for(auto&i:v)
        cin>>i;
    ll ptr1=0,ptr2=n-1;
    ll anw1=0,anw2=0;
    sort(v.begin(),v.end());
    while(1){
        if(ptr1!=ptr2 && abs(v[ptr1]+v[ptr2])<ans){
            ans = abs(v[ptr1]+v[ptr2]);
            anw1=ptr1;
            anw2=ptr2;
        }
        if(ptr1==ptr2){
            break;
        }

        if(v[ptr1]+v[ptr2] < 0) {
            ptr1 += 1;
            continue;
        }
        if(v[ptr1]+v[ptr2] >= 0) {
            ptr2 -= 1;
            continue;
        }
    }
    cout<<v[anw1]<<' '<<v[anw2]<<endl;
    return 0;
}
```
</div>
</details>
---

### reference

[(1) two pointer 설명](https://anz1217.tistory.com/126)

[(2) two pointer 설명](https://blog.naver.com/kks227?Redirect=Log&logNo=220795165570&from=postView)
