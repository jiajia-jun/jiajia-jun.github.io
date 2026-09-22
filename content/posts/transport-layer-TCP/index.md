+++
title = "运输层：UDP 与 TCP 原理（下）"
date = 2026-09-21
categories = ["计算机网络"]
tags = ["计算机网络", "TCP", "运输层"]
description = "一篇讲解TCP的原理的文章"
draft = true
+++

# 运输层：UDP 与 TCP 原理（下）

- [上篇]({{< relref "transport-layer-UDP" >}}) 主要讲**前置知识和UDP的工作原理**
- [下篇]({{< relref "transport-layer-TCP" >}}) 主要讲**TCP的工作原理**

## 前言

这一篇主要是讲**TCP协议**的原理，关于UDP协议请看[上篇](../transport-layer-UDP/index.md)

---

## 相关词条

- 网络层
  - IP：Internet Protocol，网际协议  
  它既是一种传输协议，也是定位协议
- 传输层
  - TCP：Transmission Control Protocol，传输控制协议

    - Seq：Sequence Number，序列号
    - ACK：Acknowledgment Number，确认号
    - ISN：Initial Sequence Number，初始序列号

  - UDP：User Datagram Protocol，用户数据报协议
  - MSS：Maximum Segment Size，最大报文段长度
  - MTU：Maximum Transmission Unit，最大传输单元
