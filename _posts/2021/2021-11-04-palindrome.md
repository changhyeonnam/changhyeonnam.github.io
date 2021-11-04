---
title: 팰린드롬(palindrome) 시리즈
Created: November 4, 2021 10:52 AM
tags:
    - PS
use_math: true
comments: true
---
### A. 팰린드롬?

[10942번 펠린드롬](https://www.acmicpc.net/problem/10942)

n개의 숫자가 주어지고, m개의 질문이 주어집니다. 질문당 s,e가 주어지고, s부터 e까지 펠린드롬인지 아닌지 출력하는 문제입니다. (1≤n≤2000, 1≤m≤1000,000).

```cpp
bool solve(int s, int e){
    if(d[s][e]!=-1)
        return d[s][e];
    if(s==e)
        return d[s][e]=1;
    if(arr[s]==arr[e])
    {
        if(s+1<e)
            d[s][e]=solve(s+1,e-1);
        else
            d[s][e]=1;
    }
    else
        d[s][e]=0;
    return d[s][e];
}
```

위 함수를 재귀적으로 호출하여 풀었습니다. s,e에 올수 있는 경우의 수는 중복으로 뽑을 수 있으므로 $H(n,2)$ 이고, $O(n^2$)입니다. dp를 이용해 저장해놓고, m번의 질문에 올때 해당하는 d[s][e]를 반환해주면 됩니다.

<details>
<summary>code</summary>
<div markdown="1">

```cpp
#include <iostream>
#include <cstring>
#include <string>
#include <algorithm>
#include <vector>
#include <queue>
#include <map>
#include <set>
#include <cmath>
#define endl '\n'
#define INF 1e9
#define LINF 9223372036854775807
using namespace std;

typedef long long ll;
typedef pair<int, int> pi;
typedef tuple<int, int, int> tup;
ll gcd(ll a, ll b) { for (; b; a %= b, swap(a, b)); return a; }
priority_queue<tup,vector<tup>,greater<tup>> edge;
vector<vector<pi>> v;

int t;
int arr[2001];
int d[2001][2001];
bool solve(int s, int e){
    if(d[s][e]!=-1)
        return d[s][e];
    if(s==e)
        return d[s][e]=1;
    if(arr[s]==arr[e])
    {
        if(s+1<e)
            d[s][e]=solve(s+1,e-1);
        else
            d[s][e]=1;
    }
    else
        d[s][e]=0;
    return d[s][e];
}
int main(){
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);cout.tie(NULL);
    int n,m;
    cin>>n;
    for(int i=1;i<=n;i++){
        cin>>arr[i];
    }
    cin>>m;
    memset(d,-1,sizeof(d));
    for(int i=1;i<=n;i++){
        for(int j=1;j<=n;j++){
            d[i][j]=solve(i,j);
        }
    }
    for(int i=0;i<m;i++){
        int s,e;
        cin>>s>>e;
        cout<<d[s][e]<<endl;
    }
    return 0;
}
```
</div>
</details>
---

### B. 팰린드롬

[2079번 팰린드롬](https://www.acmicpc.net/problem/2079)

팰린드롬 길이 n의 문자열이 주어집니다.(1≤n≤2000) 주어진 문자열을 여러 개의 팰린드롬으로 나누되, 나누어진 팰린드롬의 개수의 최소값을 구하는 문제입니다. A번 동일하게 [s,e]에 대해 d[s][e]가 팰린드롬인지 아닌지 1과 0을 넣어줍니다.

```cpp
for(int i=0;i<str.size();i++){
        for(int j=0;j<=i;j++){
            if(d[j][i] && (dp[i]>dp[j-1]+1||dp[i]==0)){
                dp[i]=dp[j-1]+1;
            }
        }
    }
```

 dp[i] : i번째 까지 분할된 팰린드롬의 최소개수를 의미합니다. (dp[-1] = 0이 대입되어 있습니다.) 인덱스 [i,j]가 팰린드롬일때, d[i] = d[j-1]+1 을 대입해 줍니다.

 <details>
 <summary>code</summary>
 <div markdown="1">
 
```cpp
#include <iostream>
#include <cstring>
#include <string>
#include <algorithm>
#include <vector>
#include <queue>
#include <map>
#include <set>
#include <cmath>
#define endl '\n'
#define INF 1e9
#define LINF 9223372036854775807
using namespace std;

typedef long long ll;
typedef pair<int, int> pi;
typedef tuple<int, int, int> tup;
ll gcd(ll a, ll b) { for (; b; a %= b, swap(a, b)); return a; }
priority_queue<tup,vector<tup>,greater<tup>> edge;
vector<vector<pi>> v;

int t;
string str;
int d[2001][2001];
int dp[2001]; // dp[i] = i까지의 팰린드롬 개수 중 최소 개수.
bool solve(int s,int e){
    if(d[s][e]!=-1)
        return d[s][e];
    if(s==e){
        return d[s][e]=1;
    }
    if(str[s]==str[e]){
        if(s+1<e){
            d[s][e]=solve(s+1,e-1);
        }
        else
            d[s][e]=1;
    }
    else d[s][e]=0;
    return d[s][e];
}
int main(){
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);cout.tie(NULL);
    cin>>str;
    memset(d,-1,sizeof(d));
    for(int i=0;i<str.size();i++){
        for(int j=i;j<str.size();j++){
            d[i][j]= solve(i,j);
        }
    }
    memset(dp,0, sizeof(dp));
    for(int i=0;i<str.size();i++){
        for(int j=0;j<=i;j++){
            if(d[j][i] && (dp[i]>dp[j-1]+1||dp[i]==0)){
                dp[i]=dp[j-1]+1;
            }
        }
    }
    cout<<dp[str.size()-1]<<endl;
    return 0;
}
```

</div>
</details>

### C. 팰린드롬 분할

[1509번 펠린드롬 분할](https://www.acmicpc.net/problem/1509)

주어진 문자열을 펠린드롬 분할할 수 있는 개수의 최소값을 구하는 문제이다.  B번을 풀고보니 C번과 똑같은 문제였다. n의 범위만 바뀌었다. (1≤n≤2500)
