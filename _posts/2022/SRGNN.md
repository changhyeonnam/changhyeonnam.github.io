---
title: SRGNN
Created: July 28, 2022 2:54 PM
tags:
  - Graph Neural Network
  - Recommendation System
comments: true
sitemap :
  changefreq : daily
  priority : 1.0
---

## Prior Knowledge
Before explaining SRGNN, I will skim through Session, Session based Recsys, GNN(from Scarselli et al), Gated GNN.

### Session
[(cite)](https://docs.oracle.com/cd/E13222_01/wls/docs81/webapp/sessions.html) A session is defined as a series of related browser requests that come from the same client during a certain time period. Session tracking ties together a series of browser requests—think of these requests as pages—that may have some meaning as a whole, such as a shopping cart application.

### Session based Recsys
[(cite)](https://arxiv.org/pdf/1902.04864.pdf) Different from other RSs such as content-based RSs and collaborative filtering-based RSs which usually model long-term yet static user preferences, SBRSs aim to capture short-term but dynamic user preferences to provide more timely and accurate recommendations sensitive to the evolution of their session contexts.

### Graph Neural Networks(from Scarselli et al)
[(cite lecture)](https://www.youtube.com/watch?v=_Uj-tNjhVDQ&t=50s) From This lecture, basically GNN has two key model (1) Propagation model (2) Output model (possibly outdated but this is gated GNN author's presentation).
1. Propagation model

    ![Screen Shot 2022-07-29 at 6.19.26 PM.png](https://i.imgur.com/FtSxp6L.png)
    Node representation for node v at propagation step $t:h_v^{(t)}$

    $$h_v^{t}=\sum_{v'\in IN(v)}f(h_{v'}^{(t-1)},l_{(v',v)})+\sum_{v'\in OUT(v)}f(h_{v'}^{(t-1)},l_{(v,v')})$$

    This equation is for propagation and summation of node representations. Propagate representations along edges, allow multiple edge types and propagation on both directions. And When They finished propagation, then they summation of all node representation.
    ($f$:  transformation function which transform nodes by their edge type and directions.)

    $$ Example: f(h_{v'}^{(t-1)},l_{(v',v)})=A^{(l_{(v,v')})}h_{v'}^{(t-1)}+b^{(l_{(v,v')})}$$

2. Output model
    For each node v, compute an output based on final node representation. $g$ can be a neural net.

When we consider GNN as RNN (propagate each time step), Back propagation through time is expensive. GNN restrict the propagation model so that the propagation function is a contraction map which have a unique fixed point. (I don't any of Banach fixed-point theorem(contraction mapping theorem) but anyway It restrict propagate.) And then Run the propagation until convergence.

### Gated Graph Neural Networks
**This main key-point (same cite from GNN)** [(cite lecture)](https://www.youtube.com/watch?v=_Uj-tNjhVDQ&t=50s)
1. Unroll recurrence for a fixed number of steps and just use back propagation through time with modern optimization methods.
2. Also changed the propagation model a bit to use gating mechanisms like in LSTMs and GRUs.

**From This architecture We can get these Benefits.**
1. No restriction on the propagation model, does not need to be a contraction map. (Author said that It can have more capacity and Power to solve more complicated model)
2. Initialization matters now so problem specific information can be fed in as the input.
3. Learning to compute representations within a fixed budget. When we train or test model, we just propagate fixed number of steps, so computation cost decrease.
4. Gating makes the propagation model better.

**This is Initialization Parts.**
- Problem specific node annotations in $h_v^{(0)}$.
- Q. Example reachability problem: can we go from A to B?

    ![Screen Shot 2022-07-29 at 6.28.55 PM](https://i.imgur.com/QfGl3kmm.png)
    It is easy to learn a propagation model that copies and adds the first bit to a node's neighbor.

    It is easy to learn an output model that outputs 'yes' if it seems the [red, green] pattern, otherwise no.
- In practice, we pad node annotations with extra 0's to add capacity h.
    $$ h_v^{(0)}=[l_v^T,0^T]^T$$
    This means problem specific node annotations.

**This is Propagation Model part for Gated GNN.**

![Screen Shot 2022-07-29 at 6.33.00 PM](https://i.imgur.com/YhVrBfv.png)

GNN propagation model with gating and other minor differences. You can thinks as Feed-Forward Network which is special connection structure. This is sort of Sparse structure and each connection share parameters dependent on edge's type and direction.

![Screen Shot 2022-07-29 at 6.35.32 PM](https://i.imgur.com/L4x2h6D.png)

$$a^{t}= \left[
\begin{matrix}
    a^{(OUT)} \\
    a^{(IN)} \\
\end{matrix}
\right]
$$
$a$ : concatenate all node representation in to big vector for matrix operation.


**A** stands for transformation Matrix. In matrix, each block can share parameter dependent on graph structure.

Let's talk about equation of Gated GNN.

$$
a^{(t)} = Ah^{(t-1)}+b \newline
h_v^{(t)} = tanh(Wa_v^{(t)})
$$
It's look's like vanilla RNN. And In this equation above, we add equation about gate.

$$
a^{(t)} = Ah^{(t-1)}+b \newline
Reset \space gate: r_v^{t}=\sigma(W^ra_v^{(t)}+U^rh_v^{(t-1)}) \newline
Update \space gate: z_v^{t}=\sigma(W^za_v^{(t)}+U^zh_v^{(t-1)}) \newline
h_v^{(t)} = tanh(Wa_v^{(t)}+ U(r_v^t\odot h_v^{(t-1)}))\newline
h_v^{(t)} = (1-z_v^t)\odot h_v^{(t-1)}+z_v^t\odot h_v^{(t)}
$$

**This is Output Models for Gated GNN.**
1. Per node output same as in GNNs.
2. Node selection output
    $o_v=g(h_v^{(T)},l_v)$ computes scores for each node, then take softmax over all nodes to select one.
3. Graph level output
    Graph representation vector*
    $$h_g=\sum_{v\in g}\sigma(i(h_v^{(T)},l_v))\cdot h_v^{(T)}$$
    This vector can be used to do graph level classification, regression etc.

**There is one more architecture which called Graph Graph Sequence Neural Networks**
![Screen Shot 2022-07-29 at 7.36.18 PM](https://i.imgur.com/i27Ycqx.png)

## Prior Works before SRGNN
1. **Session-based recommendations with recurrent neural networks(Hidasi et al. 2016a)** : proposes RNN approach at first.
2. **Improved recurrent neural networks for session-based recommendations(Tan, Xu, and Liu 2016)** : Imporoved first one by data augmentation and considering temporal shift
3. **Neural attentive session-based recommendation,NARM(Li et al. 2017a)** : design a global and local RNN recommendation to capture users's sequential behavior and main purposes simultaneously.
4. **Stamp: Short-term attention/memory priority model for session-based recommendation(Liu et al. 2018)** : Similar to NARM, STAMP also captured user's general interests and current interests by employing simple MLP networks and an attentive net.

## Prior Works Limitation
1. Firstly, without adequate user behavior in one session, these methods have difficulty in estimating user representations. Sessions are mostly anonymous and numerous, and user behavior implicated in session clicks is often limited. It is thus difficult to accurately estimate the representation of each user from each session. 
2. Secondly, previous work reveals that patterns of item transitions are important and can be used as a local factor (Li et al. 2017a; Liu et al. 2018) in session-based recommendation, but these methods always model single way transitions between consecutive items and neglect the transitions among the contexts, i.e. other items in the session.

## How  Session-based Recommendation with Graph Neural Networks, SR-GNN solved these problem?
1. We model separated session sequences into graph- structured data and use graph neural networks to capture complex item transitions.
2. To generate session-based recommendations, we do not rely on user representations, but use the session embedding, which can be obtained merely based on latent vectors of items involved in each single session.
3. Extensive experiments conducted on real-world datasets show that SR-GNN evidently outperforms the state-of-art methods.

## How does SRGNN works?
![Screen Shot 2022-07-29 at 7.51.51 PM](https://i.imgur.com/8qQ7mIj.png)
1. **(input)** At first, all session sequences are modeled as directed session graphs, where each session sequence can be treated as a subgraph.
2. Then, each session graph is proceeded successively and the latent vectors for all nodes involved in each graph can be obtained through gated graph neural networks.
3. After that, we represent each session as a composition of the global preference and the current interest of the user in that session, where these global and local session embedding vectors are both composed by the latent vectors of nodes.
4. **(output)** Finally, for each session, we predict the probability of each item to be the next click.


## Model
1. Notations
2. Constructing Session graphs
3. Learning Item Embeddings on Session graphs.
4. Generating Session Embeddings
5. Making Recommendation and Model Training

### Notations
1. $V$ : set consisting of all unique items involved in all the sessions.
    $$V={v_1,v_2,...,v_m} $$
2. $s$ : anonymous session sequence s
    $$s=[v_{s,1},v_{s,2},...,v_{s,n}]$$
3. $v_{s,i}$ represents a clicked item of the user within the session $s$.
    $$ v_{s,i}\in V $$
4. $\hat y $: probability for all possible items.

### Constructing Session graphs
1. Each session sequence $s$ can be modeled as a directed graph $g_s$.
    $$ g_s=(V_s, \varepsilon_s)$$

2. Each node represents an item $v_{s,i}$.
    $$ v_{s,i}\in V$$

3. Each Edge $(v_{s,i-1},v_{s,i})$ means that a user clicks item $v_{s,i}$ after $v_{s,i-1}$ in the session s.
    $$ (v_{s,i-1},v_{s,i})\in \varepsilon_s$$

4. Since several items may appear in the sequence repeatedly, we assign each edge with a normalized weighted which is calculated as the occurrence of the edge divided by the out degree of that edge's start node.

5. We embed every item $v\in V$ into an unified embedding space.

6. node vector $v\in \R^d$ indicates the latent vector of item v learned via GNN, where d is dimensionality.

7. Based on node vectors, each session s can be represented by embedding vector $s$, which is composed of node vectors used in that graph.

###Learning Item Embeddings on Session graphs
