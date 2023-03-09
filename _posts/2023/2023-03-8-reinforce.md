---
title: REINFORCE 알고리즘 구현
layout: post
Created: March 8, 2023 1:12 PM
tags:
    - Machine Learning
use_math: true
comments: true
sitemap :
  changefreq : daily
  priority : 1.0
---

> Policy Gradient method 중 하나인 REINFORC를 구현하는 중, Categorical 함수를 사용해야 했다. torch.distributions 패키지와 Categorical 함수와 관련하여 pytorch 공식문서를 참고하였고, 기존의 알고있던 REINFORCE 알고리즘의 일부분을 같이 정리해 보았다.
>

---

`distributions` package는 parameterizable probability distributions와 sampling functions을 포함하고 있다. 이 패키지를 이용하면 stochastic computation graphs와stochastic gradient estimators for optimization을 구현해 줄 수 있다.

Parameterizable probability distributions을 직접 학습하는 것은 불가능하고, torch 공식 문서에서는 대표적인 두가지 방법인 Score function(REINFORCE)와 pathwise derivative estimator을 설명한다. 두번째 방법에 대해서는 아직 잘 몰라서, 첫번째 방법만 간단하게 설명하고 넘어가려 한다.

---

REINFORCE 알고리즘에서 Policy gradient 업데이트 할때의 식을 유도하면 다음과 같다.

$$
\nabla_\theta J(\theta) = \nabla_ \theta \sum_{\tau}P(r;\theta)R(\tau) \newline = \sum_{\tau} \nabla_ \theta P(r;\theta)R(\tau) \newline
$$

이때 $\nabla_x logf(x) = \frac {\nabla_x f(x)}{f(x)}$ 이므로 다음과 같이 작성할 수 있다.

$$
\nabla_{\theta}J(\theta)=\sum_{\tau} P(\tau;\theta)\nabla_{\theta}logP(\tau;\theta)R(\tau)
$$

sample-based estimate으로 likelihood ratio policy gradient를 approximate할 수 있으므로 위의 식을 다음과 같이 다시 쓸 수 있다.

$$
\nabla_{\theta}J(\theta)=\frac 1 m\sum^m_{i=1} \nabla_{\theta}logP(\tau^{(i)};\theta)R(\tau^{(i)})
$$

그리고 $\nabla_{\theta}logP(\tau^{(i)};\theta)$에 미분 식을 전개하고, 정리하면 다음과 같은 식이 나온다.

$$
\nabla_{\theta}logP(\tau^{(i)};\theta) = \newline \nabla_{\theta}log[\mu(s_0) \Pi^H_{t=0}P(s^{(t)}_{t+1}\mid s_t^{(i)},a_t^{(i)})\pi_{\theta}(a_t^{(i)}\mid s_t^{(i)})]
\newline = \nabla_{\theta}[log\mu(s_0)+\sum^H_{t=0} log P(s^{(t)}_{t+1}\mid s_t^{(i)},a_t^{(i)})+\sum^H_{t=0} log\pi_{\theta}(a_t^{(i)}\mid s_t^{(i)})]
\newline = \nabla_{\theta}\sum^H_{t=0} log\pi_{\theta}(a_t^{(i)}\mid s_t^{(i)})
$$

REINFORCE를 실제로 구현할때는 Policy Network의 output으로부터 action을 샘플링하고, 이 action을 환경에 적용 한뒤, log_prob을 이용하여 gradient ascent를 구현해야 한다.

이와 관련되어 공식문서에는 다음과 같이 예제코드가 작성되어 있다.

```python
probs = policy_network(state)
m = Categorical(probs)
action = m.sample()
next_state, reward = env.step(action)
loss = -m.log_prob(action)*reward
loss.backward()
```

Policy Network라는 class에 act라는 method를 추가적으로 구현하면 다음과 같이 작성할 수 있다.

```python
class Policy(nn.Module):
    def __init__(self, s_size, a_size, h_size):
        super(Policy, self).__init__()
        self.fc1 = nn.Linear(s_size, h_size)
        self.fc2 = nn.Linear(h_size, a_size)

    def forward(self,x):
        x = F.relu(self.fc1(x))
        x = self.fc2(x)
        return F.softmax(x, dim=1)

    def act(self, state):
        """
        Given a state, take action
        """
        state = torch.from_numpy(state).float().unsqueeze(0).to(device)
        probs = self.forward(state).cpu()
        m = Categorical(probs)
        action = m.sample()
        return action.item(), m.log_prob(action)
```

---

이제 `torch.distributions.Categorical`에 대해 알아보자.

```python
>>> m = Categorical(torch.tensor([ 0.25, 0.25, 0.25, 0.25 ]))
>>> m.sample()  # equal probability of 0, 1, 2, 3
tensor(3)
```

Categorical 함수 Categorical distributions를 갖는 객체이다. 위의 sample()을 사용하면 해당 객체의 분포를 이용하여 샘플링 해준다. m.log_prob은 해당 action(index)에 대응하는 probability를 반환한다.

---

## Reference

1. [torch.distributions](https://pytorch.org/docs/stable/distributions.html)
