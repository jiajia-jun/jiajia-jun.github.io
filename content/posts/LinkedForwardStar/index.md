+++
title = "链表与链式前向星"
date = 2026-10-09T21:04:49
categories = ["算法"]
tags = ["链表", "链式前向星"]
description = "算法竞赛里面，实现链表、树和图的存储的方法"
draft = false
+++

---

## 链表

在数据结构课上和工程实现当中，**链表**最常见的实现就是如下方式：

```cpp
struct Node{
    int val;
    Node *next; 
};
```

这种创建链表的方式要依赖于关键字`new`，但是在算法竞赛里面通常不使用这种方式，因为算法竞赛的本质还是追求时间效率  

所以，在算法题里面通常会使用如下的结构来表示链表：

```cpp
const int N = 100010;
int v[N], nxt[N];
int head, id;
```

- **v[k]** 存放编号为k的节点数值  
- **nxt[k]** 存编号为k的节点的下一个节点编号  
- **head** 记录头指针指向的节点编号  
- **id** 用于分配节点编号  

不同于使用`new`关键字建立的链表，这种方式的不同之处如下：

1. `id`可以理解为每一个节点的专属编号，是一个**单调递增**的数，用于分配新节点
2. `nxt[]`数组是用来维护节点关系（因为有了单调递增的`idx`，使得每一个节点都是唯一的）

下面是相关的操作：

1. 初始化

   ```cpp
    void init(){
        head= -1, id= 0; //-1代表指向空
    }
    ```

2. 添加到链表头部（头插法）

    ```cpp
    void add_to_head(int val){
        v[id]= val; //设置新节点值
        nxt[id]= head; //设置新节点指向
        head= id++; //更新head指针，并给id（可分配编号）+1
    }
    ```

3. 添加节点到编号为k的节点后

    ```cpp
    void add_to(int k, int val){
        v[id]= val; //设置新节点值
        nxt[id]= nxt[k]; //设置新节点指向（为编号为k的节点的指向）
        nxt[k]= id++; //把编号为k的节点指向新节点，并给id+1
    }
    ```

4. 删除编号为k的节点的后一个节点

    ```cpp
    void rmv_after(int k){
        if (nxt[k] == -1) return; // 如果 k节点是最后一个节点就直接返回
        int p_after_k = nxt[k]; // 编号 k节点后一个节点的编号
        nxt[k]= nxt[p_after_k]; // 把 k的指向改为后一个节点的指向
    }
    ```

5. 遍历

    ```cpp
    for(int i=head; i!=-1; i=nxt[i]){
        // 逻辑操作
    }
    ```

## 链式前向星

链式前向星是一个极其高效的存储树和图的数据结构，它基于上面的链表来实现，其结构如下：

```cpp
const int N= 100010;
const int M=2*N; //两倍的边数
int h[N], e[M], nxt[M], idx;
```

>注意：当需要存入无向图的时候，数组必须开**两倍的边数**

- idx：单调递增，用于分配新的边，是**边的编号**
- nxt[i]: next，与边i同一起点的**下一条边的编号**
- h[u]：head, 指向与节点u相连的最新加入的**边的编号**
- e[i]: end, 表示编号为i的边的终点的**节点编号**

这里不同于链表，在这里：

- `idx`所负责的是**每一个边的专属编号**
- `nxt[]`数组维护的是**前一个边到下一条边的关系**
- `h[u]`所记录的是**节点u的出边的编号**
- `e[i]`则是在这里面**访问节点编号**的唯一方式

对于链式前向星的常用操作如下：

1. 初始化

    ```cpp
    //记得#include<cstring>
    void init(){
        memset(h, -1, sizeof(h)); //初始化为-1，代表没有出边
        idx= 0;
    }
    ```

2. 建立 编号为a的节点 -> 编号为b的节点单向边

    下面这个代码就是在节点a和节点b之间，建立一条idx的单向边

    ```cpp
    void add1(int a, int b){
        e[idx]= b; //分配了一条编号为idx的边，边末端为节点b
        nxt[idx]= h[a]; //为了保持a->b的关系，idx边的下一个边就是h[a]
        h[a]= idx++; //a节点的出边为idx，然后idx指向下一条待分配边
    }
    ```

3. 建立 编号为a的节点 <-> 编号为b的节点无向边

    ```cpp
    void add2(int a, int b){
        e[idx]= b;
        nxt[idx]= h[a];
        h[a]= idx++;

        e[idx]= a;
        nxt[idx]= h[b];
        h[b]= idx++;
    }
    ```

4. 遍历

    这里拿无向图的深度优先搜索举例：

    ```cpp
    // vis[]用来标记节点是否被访问过
    int vis[N];
    memset(vis, 0, N);

    void dfs(int u){
        vis[u] = 1;
        printf("%d ", u);

        for(int i = h[u]; i != -1; i = nxt[i]){
            int v = e[i];
            if(vis[v]) continue;
            dfs(v);
        }
    }
    ```

    至于有向图的遍历，就不需要开一个`vis[]`数组了，类似方法遍历即可
