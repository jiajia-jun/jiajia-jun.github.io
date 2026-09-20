+++
title = "高精度加法"
date = 2026-09-20T15:42:49+08:00
categories = ["算法"]
tags = ["高精度加法"]
description = "一篇关于高精度加法的解释"
draft = true
+++

# 高精度加法

高精度加法和高精度减法一样，仍然是模拟传统加法的过程，但是要比高精度减法简单许多，下面是实现的代码

```cpp
#include<iostream>
#include<vector>

using namespace std;

vector<int> a,b,c;

void add(vector<int>& a, vector<int>& b){
    int t=0;
    for(int i=0; i<a.size()||i<b.size(); ++i){
        if(i<a.size()) t+= a[i];
        if(i<b.size()) t+= b[i];
        c.push_back(t%10);
        t= t/10;
    }
    if(t==1){
        c.push_back(1);
    }
}

int main(){
    string x, y;
    cin>> x>> y;

    for(int i= x.size()-1; i>=0; --i){ a.push_back(x[i]-'0'); }
    for(int i= y.size()-1; i>=0; --i){ b.push_back(y[i]-'0'); }

    add(a,b);

    for(int i= c.size()-1; i>=0; --i){
        cout<<c[i];
    }
}
```

我们仍然选取核心部分讲解（这可比高精度减法好理解多）

---

## 核心代码解释

```cpp
void add(vector<int>& a, vector<int>& b){
    int t=0;
    for(int i=0; i<a.size()||i<b.size(); ++i){
        if(i<a.size()) t+= a[i];
        if(i<b.size()) t+= b[i];
        c.push_back(t%10);
        t= t/10;
    }
    if(t==1){
        c.push_back(1);
    }
}
```

首先，这里的`int t`的作用其实与高精度减法差不多，也是两个：

- 上一个数的进位数
- 当前数位的加法结果

我们从头开始来讲解这段代码

```cpp
int t= 0
```

初始化 t 为 0，此时作用是代表着**进位数**

---

```cpp
for(int i=0; i<a.size()||i<b.size(); ++i){
    //先判断是否位于对应数位
    if(i<a.size()) t+= a[i];
    if(i<b.size()) t+= b[i];

    //将当前数位的加法记录到结果中，此时 t 的作用变成了当前位数的加法结果
    c.push_back(t%10);

    //这里是进位操作，满十进一，应该好理解的
    t= t/10;
}
```

这一段是模拟加法操作，请看注释  
事实上在每一次循环开始的时候，t 的作用就会**重新变成进位数**

---

```cpp
if(t==1){
    c.push_back(1);
}
```

最后，这里是收尾操作，防止漏掉最高位的一（不可能出现其他情况的最高位进位，简单想想就知道了），咱们不妨举个例子：  
比如`9000+9000`，**倒序存储**后在处理最后一位的时候，是`9+9`，即 t =18，在最后一次循环的时候，t = t/10，从而 t 变成了1，显然，这是一个进位数，所以，这段代码的用处就在这里体现了
