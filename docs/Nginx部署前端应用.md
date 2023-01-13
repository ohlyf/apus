正向代理，客户端不想让服务器知道客户端的ip，所以让代理服务器去访问，再返回给客户端。
反向代理，服务器不想客户端知道是哪个服务器响应的，所以让代理服务器去分配，让空闲的服务器去响应。

反向代理：当浏览器访问`/`时，将代理转到`3000`端口

![img](https://raw.githubusercontent.com/ohlyf/img-url/master/202301131346267.png)



## 配置https

![img](https://raw.githubusercontent.com/ohlyf/img-url/master/202301131346567.png)

## 阿里云安装docker

```shell
yum install yum-utils device-mapper-persistent-data lvm2
```



```shell
yum install docker-ce docker-ce-cli containerd.io
systemctl start docker
```

` systemctl enable docker` 开机启动

![img](https://raw.githubusercontent.com/ohlyf/img-url/master/202301131346679.png)

 yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo

```shell
vi /etc/docker/daemon.json
systemctl daemon-reload
 systemctl restart docker
```



```
docker pull daocloud.io/library/mysql:8.0.20
```

docker images



```shell
docker run -d -p 3306:3306 --name mysql -e MYSQL_ROOT_PASSWORD=abc123456  be0dbf01a0f3
docker pull daocloud.io/library/redis:6.0.3-alpine3.11
docker run -d -p 6379:6379 --name redis 29c713657d31 --requirepass abc123456
```

![img](https://raw.githubusercontent.com/ohlyf/img-url/master/202301131346817.png)



```shell
docker pull daocloud.io/library/nginx:1.13.0-alpine
```



## 复制本地文件到远程

```shell
scp -rp nginx/ root@47.99.147.11:/root
```

- 运行nginx

```shell
docker run --name nginx -d -p 80:80 -v /root/nginx/log:/var/log/nginx -v /root/nginx/conf/nginx.conf:/etc/nginx/nginx.conf -v /root/nginx/conf.d:/etc/nginx/conf.d -v /root/nginx/html:/usr/share/nginx/html f00ab1b3ac6d
```



压缩服务端并上传

```shell
unzip -u -d server egg.zip
```



## 填充数据库

### 配置mysql权限

```shell
docker exec -it 1b743d3aee9f sh

mysql -uroot -p

# 远程连接授权
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;

# 刷新权限
FLUSH PRIVILEGES;

# 更改加密规则
ALTER USER 'root'@'localhost' IDENTIFIED BY 'password' PASSWORD EXPIRE NEVER;

# 更新root用户密码
ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY 'abc123456';

# 刷新权限
FLUSH PRIVILEGES;
```

## 运行server

```shell
docker build -t egg:v1.0 ./server

# 查看所有镜像 
docker images

# 运行egg镜像
docker run -d -p 7001:7001 --name server 960165707bde
```



![img](https://raw.githubusercontent.com/ohlyf/img-url/master/202301131346132.png)





