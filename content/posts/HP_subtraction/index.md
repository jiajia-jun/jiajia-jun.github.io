+++
title = "高精度减法"
date = 2026-09-20T15:42:49+08:00
categories = ["算法"]
tags = ["高精度减法"]
description = "一篇关于高精度减法的解释"
draft = true
+++

# 高精度减法

高精度减法的核心思路是模拟，模拟咱们的传统减法运算以应对超长数字的减法  
以下是代码实现，这里我采用的是vector向量，实际上也可以使用数组来实现的 **（注意，所有的高精度算法都是倒序存储数字的）**

```cpp
#include<iostream>
#include<string>
#include<vector>

using namespace std;

vector<int> a,b,c;

bool cmp(const string& a, const string& b){
    //先看位数，位数大的数字一定是大的
    if(a.size()!=b.size()){return a.size()>b.size();}
    //位数相同情况，再通过字典序比较（切忌直接比较）
    return a>b;
}

//为了方便起见，这里要确保 a >= b
void sub(vector<int>& a,vector<int>& b){
    //这一步是模拟减法的过程
    int t=0;
    for(int i=0;i<a.size();++i){
        t=a[i]-t;
        if(i<b.size()){
            t-=b[i];
        }
        c.push_back((t+10) % 10);
        if(t<0) t=1;
        else t=0;
    }
    //这一步是去除多余的0
    while(c.size()>1&&c.back()==0){
        c.pop_back();
    }
}

int main(){
    string x,y;
    cin>>x>>y;

    int al,bl;
    al=x.size();
    bl=y.size();

    //倒序存储
    for(int i=al-1;i>=0;--i){ a.push_back(x[i]-'0');}
    for(int i=bl-1;i>=0;--i){ b.push_back(y[i]-'0');}

    //符号判断
    if(cmp(x,y)) sub(a,b);
    else {
        sub(b,a);
        cout<< '-';
    }

    //倒序输出结果
    for(int i=0;i<c.size();++i){
        cout<<c[c.size()-i-1];
    }
}

```  

## 核心代码解释  

下面这段代码是高精度减法的核心部分（这里a是大于等于b的）  

```cpp
void sub(vector<int>& a,vector<int>& b){
    //这一步是模拟减法的过程
    int t=0;
    for(int i=0;i<a.size();++i){
        t=a[i]-t;
        if(i<b.size()){
            t-=b[i];
        }
        c.push_back((t+10) % 10);
        if(t<0) t=1;
        else t=0;
    }
    //这一步是去除多余的0
    while(c.size()>1&&c.back()==0){
        c.pop_back();
    }
}
```  

---

首先要说明的关键是，这里的`int t`所充当的作用：  

- 作为上一位数的借位数
- 作为当前数位的减法结果

为什么这样说？我们拿第一次循环解释

```cpp
int t=0; // 此处，t先作为借位数参与运算，在第一次借位当然是0
for(int i=0;i<a.size();++i)

    t=a[i]-t; // 一直到这里，等号右侧 a[i]-t 为当前数位减去借位数的结果，模拟了借位，得到了等号左侧的被减数 t

    if(i<b.size()){ //如果当前数位在较小数 b 内，进行减法运算即可: t（被减数）-b[i]（对应数位上的减数）
        t-=b[i];
    }    
```

---

这个时候减法的模拟做完了，接下来是模拟进位操作了

```cpp
c.push_back((t+10) % 10);
```

这里是将当前数位的减法结果保存到最终结果的向量中  
之所以是`(t+10)%10`，是因为这里集成了两个情况：

- 被减数大于等于减数
- 被减数小于减数

1）当被减数大于等于减数的时候，比如 `5-3`与`2-2`，加上一个10并不影响结果  
2）当被减数小于减数的时候，这个操作就变成了借位操作了，比如`2-8`，这种情况是不是就要向前借位了，变成`2-8+10`，最后取模得到 4，也不影响正常计算结果

所以，这个地方就同时涵盖了两个情况😋

---

好了，接下来就是记录进位情况了，现在 `t` 的含义就从 **当前数位的减法结果** 变成 **借位数**

```cpp
if(t<0) t=1;  //减法结果小于0，代表向前接了一位数
else t=0;    //反之，就不要借位了
```

---

最后，模拟完成减法后，别忘记去除前导0了（比如，像145-123这种情况，倒序处理到 1 的时候，1-1会得到0，这个0当然不用输出的）

```cpp
while(c.size()>1&&c.back()==0){
    c.pop_back();  //直接调用pop_back函数就好了
}
```  
