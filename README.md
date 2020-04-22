# Portrait Server

一个自用的 nodejs 服务，用于支撑个人应用的开发。
采用 NestJS + TypeORM + Apollo GraphQL 搭建； 数据库采用 mysql + redis

## 环境需求

- nodejs >= 12
- mysql
- redis

## 目前功能

- [x] 账号登录/注册
- [x] 第三放登陆接入（GitHub登录, weibo登录）
- [x] jwt 鉴权
- [x] 自定义 GraphQL 类型
- [x] GraphQL的 query、mutation、subscription 常用操作
- [x] relay 风格 GraphQL 分页
- [x] 根据 graphql 文件，自动生成 Typescript 类型定义
