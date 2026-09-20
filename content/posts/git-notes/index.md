+++
title = "git 常用操作"
date = 2026-09-19
categories = ["技术"]
tags = ["Git"]
description = "16 条 git 常用命令"
+++

> 备注：以下内容中，包含CommitHash的地方（提交对象）也可以用HEAD及相对引用类型
>
> `Name`：分支名
> `CommitHash`：提交对象（节点）
> `DHEAD状态`：detached HEAD状态

1. `git init`\
   在当前目录内新建一个初始化仓库

2. `git commit`\
   在当前分支提交一次版本

3. `git branch Name`\
   在当前节点创建一个名为Name的分支（不会切换到其上）\
   `git branch Name CommitHash`\
   在CommitHash对应的节点上新增一个名为Name的分支

4. `git checkout Name`\
   切换到名为Name的分支上

5. `git checkout -b Name`\
   在当前节点创建并切换到名为Name的分支\
   `git checkout -b Name CommitHash`\
   在CommitHash对应的节点上新增并切换到名为Name的分支上

6. `git merge Name`\
   将名为Name的分支合并到当前的分支上，并提交一次版本

7. `git rebase Name` 变基\
   将当前分支的从分支点开始的全部提交记录，嫁接到Name分支上，形成线性结构

8. `git checkout CommitHash`\
   将当前的分支的HEAD分离出来，使其指向CommitHash对应的节点（进入DHEAD状态），以方便在当前的版本上进行安全修改（相当于建立了一个临时副本，不会影响原来结点）

   > ✅注：`git log` 可以查看每一次提交的commithash，`git checkout Name`即可退出对应节点的DHEAD状态（DHEAD状态下使用checkout就会切出）

9. 相对引用 `git checkout BranchName^/ CommitHash^/HEAD^`\
   切换到当前分支最新提交的版本/hash对应指定节点/HEAD的parent节点，并进入DHEAD状态\
   `^` 代表着前移一个版本（可叠加，如`^^`）\
   `~Num` 代表前移Num个版本

10. `git branch -f Name Commithash` 强制移动\
    强制移动Name分支到Commithash对应的指定节点位置（不会切换到这个分支上）

11. `git reset T`\
    重置时间线到目标节点T的全部提交，会清除提交记录

    > T的类型一般有：
    > 1. 相对引用（使用 HEAD HEAD^ 等）
    > 2. 绝对引用（直接使用CommitHash）
    >
    > 注意：此方法只能适用于本地提交

12. `git revert T`\
    新建立一次与目标节点T镜像的提交（比如T新增了1行代码，镜像提交T’则是删除1行代码），会保留以前的提交记录，适用于协作开发

    > T的类型一般有：
    > 1. 相对引用（使用 HEAD HEAD^ 等）
    > 2. 绝对引用（直接使用CommitHash）
    >
    > 就代码而言，T’的代码会与T的parent节点一致

13. `git cherry-pick`\
    CommitHash1 CommitHash2...\
    将CommitHash1，CommitHash2依次复制到当前节点（HEAD指向）的下方

14. `git rebase -i CommitHash`\
    从CommitHash对应的节点进行交互式变基，适用于不清楚变基节点的提交哈希的情况，可以直接交互式地完成 `git rebase` 的效果

15. `git commit --amend`\
    修改最近的一次提交（相当于把旧的删掉，换上去一个新的），如果代码只做了微小改动并且你不想在创建一个commit，可以试试添加 --amend 这个选项

16. `git tag TagName CommitHash`\
    给CommitHash对应的节点打名为TagName永久性的标签\
    同样的，可以通过标签来切换到指定节点（ git branch -f和git checkout ），从而避免了复杂的CommitHash

    > 注意：用 git checkout TagName 会进入节点的DHEAD状态
