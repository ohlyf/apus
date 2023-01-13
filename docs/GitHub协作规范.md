## git团队协作 

以官网项目为例 

1. fork云端的项目，后续开发都在fork下来的项目中进行，云端项目只做Pull Request（简称PR、pr）和发布使用。
2. 将fork到自己账户下的仓库clone至本地，安装依赖并运行。
3. 当有新需求需要开发时，从upstream的dev分支切额外的开发分支，分支以tiket号命名。



```plain
团队协作规范 
//查看上游仓库 
git remote -v 
 
//添加上游仓库(公司账号下的项目) 
git remote add upstream xxxxxx（上游仓库地址） 
 
//抓取上游代码仓库的更新（为后面基于此新建分支做准备） 
git fetch upstream 
 
//从上游的dev分支切出分支，此时该分支的track是连接在上游仓库的，如果需要连接在origin，需要在github Desktop中以此为基础再切分支 
git checkout upstream/dev -b xxxx（分支名） 
 
//查看当前分支track对应的远端分支 
git branch -vv 
 
//第一次向远端提交，并且可以顺便在远端建立新分支，还会改变当前分支的track路径（指定分支名提交可以避免很多错误） 
git push -u origin xxxx（分支名）
```



### git良好习惯 



```plain
//查看提交日志 
git log 
 
//查看当前状态，也能看到推荐命令 
git status 
 
//对当前分支做备份
```



## git常见问题 



```shell
常见问题1: 
//如果将本地修改误提交到公司项目，重复进行revert和提交操作 
git revert HEAD 
git push origin/... 
git revert HEAD 
git push origin/... 
 
常见问题2: 
//有许多临时commit需要合并，在页面中根据提示进行操作 
git rebase -i commit-hash 
 
或者 
 
git pull --rebase upstream dev 
 
常见问题3: 
//更改commit信息 
//以某个版本为基础创建分支（原分支多出很多无用commit） 
git checkout -b branch-name hash 
 
//这一步要确定好起点，多用git log查看当前起点及commit信息 
git rebase -i hash 
https://blog.csdn.net/u013276277/article/details/82470177 
 
//修改还没push的commit信息，有的时候一次修改不成功，需要二次修改，通过git log来看是否成功；将本次更改合并到上一次修改里 
git commit --amend 
 
//修改后，如果有第二个就修改第二个，没有就回到主分支 
git rebase --continue 
 
//让commit链路更清晰,不然无法合并 
git rebase upstream/branch-name 
git pull --rebase upstream branch-name 
https://stackoverflow.com/questions/15915430/what-exactly-does-gits-rebase-preserve-merges-do-and-why/50555740#50555740 
 
//强推到原来的分支，覆盖commit，这样的话可以避免关闭PR操作 
git push -f origin HEAD:branch-name 
 
常见问题4：提了pr但未合并进入远程分支时不小心删掉对应的本地分支（此法会再打开一个pr) 
// 1. 找到删掉的分支的最后一个想捡起的commit号并保存 
git log -g 
// 2. 找回删掉分支的commit 
git branch 新分支名 删掉的分支的最后一个想捡起的commit号 
// 3. 绑定新分支的上游分支 
git branch -u upstream/上游对应的分支 新分支
```



![img](https://raw.githubusercontent.com/ohlyf/img-url/master/202301131342103.png)



## 推送到alpha-only

```shell
git push -f zaihui HEAD:alpha-only
```



## changfu发版

1. git stash
2. git fetch zaihui
3. git reset --hard zaihui/main
4. git log
5. git stash pop
6. git commit -m 'APP-2214(fix): 修改惠外卖筛选条件'
7. git push origin APP-2214
8. pr的时候改分支 
9. 跑完 点击deploy
10. 然后发版群@ 惠芹
11. 将main 和到dev  @Keven. /m changfu main dev



发版:

/rel 项目名

/m 项目名 master dev    // dev落后master的时候 需要两次





## git merge 的三种操作 merge , squash merge , 和rebase merge



举例来说：
假设在 master 分支的B点拉出一个新的分支dev，经过一段时间开发后：



- master 分支上有两个新的提交M1和M2
- dev分支上有三个提交D1，D2，和D3



如下图所示：



![img](https:////upload-images.jianshu.io/upload_images/6035627-cc0a26ddd001d80d.png?imageMogr2/auto-orient/strip|imageView2/2/w/704/format/webp)





现在我们完成了dev分支的开发测试工作，需要把dev分支合并回 master 分支。



1. merge



这是最基本的 merge ，就是把提交历史原封不动的拷贝过来，包含完整的提交历史记录。



```ruby
$ git checkout master
$ git merge dev
```



![img](https://raw.githubusercontent.com/ohlyf/img-url/master/202301131344002)





此时还会生产一个 merge commit (D4')，这个 merge commit 不包含任何代码改动，而包含在dev分支上的几个commit列表(D1, D2和D3)。查看git的提交历史(git log )可以看到所有的这些提交历史记录。



1. squash merge :



根据字面意思，这个操作完成的是压缩的提交；解决的是什么问题呢，由于在dev分支上执行的是开发工作，有一些很小的提交，或者是纠正前面的错误的提交，对于这类提交对整个工程来说不需要单独显示出来一次提交，不然导致项目的提交历史过于复杂；所以基于这种原因，我们可以把dev上的所有提交都合并成一个提交；然后提交到主干。



```ruby
$ git checkout master
$ git merge --squash dev
```



![img](https://raw.githubusercontent.com/ohlyf/img-url/master/202301131345784)





在这个例子中，我们把D1，D2和D3的改动合并成了一个D。



注意， squash merge 并不会替你产生提交，它只是把所有的改动合并，然后放在本地文件，需要你再次手动执行git commit 操作；此时又要注意了，因为你要你手动 commit ，也就是说这个commit是你产生的，不是有原来dev分支上的开发人员产生的，提交者本身发生了变化。也可以这么理解，就是你把dev分支上的所有代码改动一次性 porting 到 master 分支上而已。



1. rebase merge



由于 squash merge 会变更提交者作者信息，这是一个很大的问题，后期问题追溯不好处理(当然也可以由分支dev的所有者来执行 squash merge 操作，以解决部分问题)，rebase merge可以保留提交的作者信息，同时可以合并 commit 历史，完美的解决了上面的问题。



```ruby
$ git checkout dev
$ git rebase -i master
$ git checkout master
$ git merge dev
```



rebase merge 分两步完成：
第一步：执行rebase操作，结果是看起来dev分支是从M2拉出来的，而不是从B拉出来的，然后使用-i参数手动调整 commit 历史，是否合并如何合并。例如下rebase -i命令会弹出文本编辑框：



```bash
pick <D1> Message for commit #1
pick <D2> Message for commit #2
pick <D3> Message for commit #3
```



假设D2是对D1的一个拼写错误修正，因此可以不需要显式的指出来，我们把D2修改为fixup：



```bash
pick <D1> Message for commit #1
fixup <D2> Message for commit #2
pick <D3> Message for commit #3
```



rebase之后的状态变为：



![img](https://raw.githubusercontent.com/ohlyf/img-url/master/202301131345588)







D1'是D1和D2的合并。



第二步：再执行 merge 操作，把dev分支合并到 master 分支：



![img](https://raw.githubusercontent.com/ohlyf/img-url/master/202301131345020)





注意：在执行rebase的时候可能会出现冲突的问题，此时需要手工解决冲突的问题，然后执行(git add)命令；所有冲突解决完之后，这时不需要执行(git commit )命令，而是运行(git rebase -- continue )命令，一直到rebase完成；如果中途想放弃rebase操作，可以运行(git rebase --abort)命令回到rebase之前的状态。