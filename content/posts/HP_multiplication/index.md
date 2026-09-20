+++
title = "高精度乘法"
date = 2026-09-20T15:42:49+08:00
categories = ["算法"]
tags = ["高精度乘法"]
description = "一篇关于高精度乘法的解释"
draft = true
+++

# 高精度乘法

高精度乘法分为两类：  

- 第一类是高精度乘以低精度
- 第二类是高精度乘以高精度

我们将依次讲解

---

## 高精度乘以低精度

实现代码如下：

```cpp
#include<iostream>
#include<vector>
using namespace std;

vector<int> a, c;

void mul(vector<int>& a, int b){
    int t=0;
    for(int i=0; i<a.size() || t!=0; ++i){
        if(i<a.size()) t += a[i]*b;
        c.push_back(t%10);
        t /= 10;
    }
    // 去除前导0
    while(c.size()>1 && c.back()==0 ) c.pop_back();
}

int main(){
    string x;
    cin>> x;
    for(int i= x.size()-1; i>=0; --i){ a.push_back(x[i]-'0'); }

    int b;
    cin>>b;

    mul(a,b);

    for(int i= c.size()-1; i>=0; --i){
        cout<<c[i];
    }
}
```

我们依旧是解释核心代码  

### 核心代码解释

```cpp
void mul(vector<int>& a, int b){
    int t=0; //此时，t 的作用为进位数，初始化为0
    for(int i=0; i<a.size() || t!=0; ++i){
        if(i<a.size()) t += a[i]*b; 
        c.push_back(t%10);
        t /= 10;
    }
    // 去除前导0
    while(c.size()>1 && c.back()==0 ) c.pop_back();
}
```

和高精度加法、高精度减法类似，这里的 t 照样还是两种作用：  

- 上一位数的进位数
- 当前数位的乘法结果

要理解这段高精度乘法代码，我们首先要转变一个思想：把一个大数（这里为
a）看作是`n1*10^0+n2*10^1+n3*10^2...`，用 n1、n2、n3 等依次去乘以
那个小数（这里为 b），再对每一个数位进行适当的进位操作和取模操作，
最后去除前导 0（至于为什么要这个操作，极端情况有一个例子很好理解，**用 0 去乘以一下这个数就好了**）

---

依照这个思想，for循环里面的代码就不难理解了

```cpp
if(i<a.size()) t += a[i]*b; // 不超过a的数位，则对该数位进行乘法操作，并加上上一个数位的进位数，此时 t 作为对应数位乘法结果

c.push_back(t%10); // 取个位数字，记入结果当中

t /= 10; // 计算此数位的进位数
```

唯一说明的一点是，循环条件还有一个 `||t!=0` ,这里用一个例子来解释吧  

- 比如`123*9`,按照上述逻辑来，在`i=2`的时候，此时得到这种情况：`c[0]='7',c[1]='0',t=2`  
- 继续运行， `t+=9*1 -> t=11` ,`c.push_back(t%10) -> c[2]=1` ,`t/=10 -> t=1`  
- 显然，这个 t 是一个进位，如果此时没有`||t!=0`这个条件，循环就到此结束，最后一个进位数就无法保留，这就是这个条件的存在意义

---

## 高精度乘以高精度

高精度乘以高精度相比于高精度乘以低精度稍微复杂一点，但其实也不算特别难懂，核心思想和普通高精度一样的：

> **把一个大数（这里为 a）看作是
> `n1*10^0+n2*10^1+n3*10^2...` 这样的式子**，只不过这里是用一个数的每一个数位去
> 依次乘以另一个数的每一个数位（毕竟两个都是大数，这一点和普通的不一样）

实现代码如下：

```cpp
#include<iostream>
#include<vector>
#include<string>
using namespace std;

vector<int> a,b;

vector<int> mul(vector<int>& a, vector<int>& b){
    vector<int> c(a.size()+b.size(),0);

    for(int i=0; i<a.size(); ++i){
        for(int j=0; j<b.size(); ++j){
            c[j+i]+= a[i]*b[j];
        }
    }

    // 进位操作
    int t= 0;
    for(int i=0; i<c.size(); ++i){
        t+= c[i];
        c[i]= t%10;
        t /=10;
    }

    // 去除前导0
    while(c.size()>1 && c.back()== 0 ) c.pop_back();

    return c;

}

int main(){
    string x, y;
    cin>> x>> y;

    for(int i= x.size()-1; i>=0; --i){ a.push_back(x[i]-'0'); }
    for(int i= y.size()-1; i>=0; --i){ b.push_back(y[i]-'0'); }

    vector<int> c= mul(a,b);

    for(int i= c.size()-1; i>=0; --i){
        cout<<c[i];
    }
}
```

### 核心代码讲解

```cpp
vector<int> mul(vector<int>& a, vector<int>& b){
    vector<int> c(a.size()+b.size(),0); // 两个数字相乘，他们的结果的位数一定一定不会超过这两个数字位数之和

    //这里是关键，稍后单独讲
    for(int i=0; i<a.size(); ++i){
        for(int j=0; j<b.size(); ++j){
            c[j+i]+= a[i]*b[j];
        }
    }

    // 进位操作，这里的 t 是老盆友了，作用还是两个：进位数和当前数位乘法结果
    int t= 0;
    for(int i=0; i<c.size(); ++i){
        t+= c[i];
        c[i]= t%10;
        t /=10;
    }

    // 去除前导0，极端例子：999999999*0
    while(c.size()>1 && c.back()== 0 ) c.pop_back();

    return c;

}
```

---

我们着重讲一下怎么实现模拟乘法的部分，也就是这一段代码

```cpp
for(int i=0; i<a.size(); ++i){
    for(int j=0; j<b.size(); ++j){
        c[j+i]+= a[i]*b[j];
    }
}
```

这个for循环的含义是，**拿a的每一个数位，依次去乘以b的每一数位**  

这里比较晦涩难懂的就是这一点`c[j+i]+= a[i]*b[j];`，这个`j+i`是何意味？

我们拿一个案例进行讲解：`123*56` ，其中，a=123，b=56  

输入数字后，`vector a` `vector b`中存储情况是这样的：

```text
逆序存储:
  a = [5, 3, 2]  (235 的个位、十位、百位)
  b = [6, 5]     (56 的个位、十位)

初始化 c:
  长度 = a.size() + b.size() = 3 + 2 = 5
  c = [0, 0, 0, 0, 0]
索引:  0  1  2  3  4
```

- 第一次外层循环的时候，i=0，我们拿`a`的个位去依次乘以`b`的每一个数位，最终不难得到这个结果：`c = [30, 25, 0, 0, 0]`，代表着有30个1，25个10

- 第二次，i=1，我们拿`a`的十位去依次乘以`b`的每一个数位，  
`a[1]*b[0]` -> 结果是得到一个**10的倍数**，应当填入`c[1]`；  
`a[1]*b[1]` -> 结果是一个**100的倍数**，应当填入`c[2]`  
不难看出，我们每一次都要从`c[1+j]`填入数字  

依次类推，我们便可以发现这样的规律：  

- 第一次`i=0`，从`c[0]`开始填入，每一次填入`c[0+j]`处
- 第二次`i=1`，从`c[1]`开始填入，每一次填入`c[1+j]`处  
......（剩下的就不一个个推导了，你可以自己验证一下www）

所以，用代码实现就是`c[j+i]+= a[i]*b[j];`
