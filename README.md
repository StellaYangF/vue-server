# Koa 搭建一个 Web 服务

本文主要内容为：

- 项目描述
- 方案选型
- 目录结构
- 构建

## 项目描述

该服务是配套 Vue-front 前端的一套 node 服务，提供首页、文章、用户管理、角色管理等相关模块的接口。

## 方案选型

基于 Koa 的框架开发，配合 Mongoose, Redis 数据库设计，引入 jsonwebtoken 实现用户登录验证。

## 目录结构

```bash
vue-server
          ├─ package.json
          ├─ README.md
          ├─ index.js     #服务入口
          ├─ routes       #路由
          ├─ model        #数据模型层
          ├─ controller   #控制器
          └─ config       #配置文件
```

## 构建

构建部分为核心内容，主要有以下步骤：

- index.js 入口文件
- routes 路由
- controller 控制层
- model 模型层
- config 数据库等配置连接

### index.js 入口文件

### routes 路由

### controller 控制层

### model 模型层

### config 数据库等配置连接
