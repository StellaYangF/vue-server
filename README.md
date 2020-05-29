# Koa 搭建一个 Web 服务

本文主要内容为：

- 项目描述
- 方案选型
- 目录结构
- 构建
- 总结

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
```js
const Koa = require("koa");
const cors = require("@koa/cors");
const body = require("koa-bodyparser");
const router = require("./routes/index");
const JWT = require("koa-jwt");
const { secret } = require("./config/index");

const WS = require("./config/webSocket");
// new WS().create();

const app = new Koa();
app.use((ctx, next) => {
  return next().catch((err) => {
    console.log(err);
    if (err.status == 401) {
      ctx.status = 401;
      ctx.body = "Protected resource, use Authorization header to get access\n";
    } else {
      throw err;
    }
  });
});
app.use(cors());
app.use(JWT({ secret }).unless({ path: [/^\/public/, /^\/user/] }));
app.use(body());
app.use(router());
app.on('error', err => console.log(err))
app.listen(3000, () =>
  console.log(
    `Server listening on http://localhost:3000, press Ctl + C to stop`
  )
);
```

### routes 路由

子路由创建注册时时，就是一个个的中间件，接收 `ctx`, `next` 参数

index.js
```js
let publicRouter =  require('./publicRouter');
let userRouter = require('./userRouter');
let init = require('./init');
let combineRoutes = require('koa-combine-routers');

module.exports = combineRoutes(publicRouter, userRouter, init);
```
> Tip: 这里对子路由进行合并

publishRouter.js
```js
const Router = require('@koa/router');
const { getSlider, getCaptcha } = require('../controller/publicController');

const router = new Router({ prefix: '/public' });

router.get('/getSlider', getSlider);
router.get('/getCaptcha', getCaptcha);

module.exports = router;
```

userRouter.js
```js
const Router = require('@koa/router');
const userController = require('../controller/userController');

const router = new Router({ prefix: '/user' });
router.post('/login', userController.login);
router.post('/reg', userController.reg);
router.post('/validate', userController.validate);
router.post('/sendEmail', userController.sendEmail);
router.post('/codeValidate', userController.codeValidate);
router.post('/changePassword', userController.changePassword);

module.exports = router;
```

### controller 控制层

实现 router 内部具体的操作行为的数据类，引入 Model 层，链接数据库进行操作

publishController.js
```js
const SliderModel = require('../model/Slider');
const { setValue } = require('../config/redisConfig');
const svgCaptcha = require('svg-captcha');

class PublicController {
  async getSlider(ctx) {
    let sliders = await SliderModel.find({});
    ctx.body = {
      err: 0,
      data: sliders,
    }
  }

  async getCaptcha(ctx) {
    const query = ctx.query;
    const newCaptcha = svgCaptcha.create({
      size: 4,
      width: 150,
      height: 38,
      noise: Math.floor(Math.random() * 5),
    });
    setValue(query.uid, newCaptcha.text, 10 * 60);
    ctx.body = {
      err: 0,
      data: newCaptcha.data,
    }
  }
}

module.exports = new PublicController;
```

userController.js
```js
const User = require('../model/User');
const { getValue, setValue } = require('../config/redisConfig');
const sendEmail = require('../config/emailConfig');
const jsonwebtoken = require('jsonwebtoken');
const { secret } = require('../config/index');
const Auth = require('../model/Auth');

class UserController {
  async login(ctx) {
    const { uid, code, password, username } = ctx.request.body;
    let storeUid = await getValue(uid);
    console.log(storeUid);
    if (code.toLowerCase() == storeUid.toLowerCase()) {
      let user = await User.findOne({ username, password });
      user = uer.toJSON();
      let authList = await Auth.find({ role: user.role._id });
      if (user.status === 1){ // 禁用
        ctx.body = {
          err: 1,
          data: '用户已被禁用'
        };
      } else {
        delete user.password;
        const toke = jsonwebtoken.sign({ ...user, authList }, secret, {
          expiresIn: '1h',
        });
        ctx.body = {
          err: 0,
          data: {
            toke,
            ...user,
            authList,
          }
        }
      }
    } else {
      ctx.body = {
        err: 1,
        data: '验证码不正确'
      }
    }
  }

  async reg(ctx) {
    let { username, password } = ctx.request.body;
    if (username && password) {
      try {
        let user = await User.findOne({ username });
        if (user) {
          ctx.body = {
            err: 1,
            data: '用户名已经存在',
          }
        } else {
          console.log(username, password);
          await User.create({
            username,
            password,
          });
          ctx.body = {
            err: 0,
            data: '注册成功',
          }
        }
      } catch(e) {
        console.log(e);
        ctx.body = {
          err: 1,
          data: '数据库出错',
        }
      }
    } else {
      ctx.body = {
        err: 1,
        data: '用户名密码不能为空'
      }
    }
  }

  async validate(ctx) {
    let [ , token ] = ctx.headers.authorization.split(' ');
    try {
      let decoded = jsonwebtoken.verify(token, secret);
      decoded.exp = Math.floor(Date.now() / 1000) + (60 *60);
      let newToken = jsonwebtoken.sign({ ...decoded }, secret);
      ctx.body = {
        err: 0,
        data: {
          token: newToken,
          ...decoded,
        }
      }
    } catch(e) {
      console.log(e);
      ctx.body = {
        err: 1,
        data: 'token 不正确或者过期',
      }
    }
  }

  async sendEmail(ctx) {
    let { email: username } = ctx.query;
    let r = await User.findOne({ username });
    if (r) {
      try {
        const code = Math.ceil(Math.random() * 100000);
        await sendEmail({
          email: username,
          code,
        });
        setValue(username, code, 10 * 60);
      } catch(e) {
        console.log(e);
        ctx.body = {
          err: 1,
          data: '发送失败'
        }
      }
    } else {
      ctx.body = {
        err: 1,
        data: '用户不存在呢，去注册一个吧'
      }
    }
  }

  async codeValidate(ctx) {
    let { code, username } = ctx.request.body;
    let oldCode = await getValue(username);
    if (code == oldCode) {
      ctx.body = {
        err: 0,
        data: '验证码正确',
      }
    } else {
      ctx.body = {
        err: 1,
        data: '验证码不正确'
      }
    }
  }

  async changePassword(ctx) {
    let { code, username, password } = ctx.request.body;
    let oldCode = await getValue(username);
    if (code == oldCode) {
      try {
        await User.update({ username }, { password });
        ctx.body = {
          err: 0,
          data: '修改成功',
        }
      }catch(e) {
        ctx.body = {
          err: 1,
          data: '修改失败',
        }
      }
    } else {
      ctx.body = {
        err: 1,
        data: '验证码不正确',
      }
    }
  }
  
}

module.exports = new UserController;
```

### model 模型层

根据 `mongoose` 定义数据库（`collect`）模型，操作文件（`document`）数据结构类型

Auth.js
```js
const mongoose = require('mongoose');

const AuthSchema = new mongoose.Schema({
  pid: {
    type: Number,
    default: -1,
  },
  id: {
    type: Number,
  },
  name: {
    type: String,
  },
  auth: {
    type: String,
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
  },
  path: {
    type: String,
  },
});

const AuthModel = mongoose.model('Auth', AuthSchema);
module.exports = AuthModel;
```

Role.js
```js
const mongoose = require('mongoose');

const RoleSchema = mongoose.Schema({
  roleName: {
    type: String,
  },
});

const RoleModel = mongoose.model('Role', RoleSchema);

module.exports = RoleModel;
```

User.js
```js
let mongoose = require('../config/dbConfig');

const UserSchema = new mongoose.Schema({
  username: {// 用户名
    type: String,
    required: true,
  },
  password: {
    type: String,
    required:  true,
  },
  name: {
    type: String,
    default: '',
  },
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
  gender: {
    type: Number,
    default: -1,
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role', // 0 普通用户 1 管理员
    default: '5ecf7e4a1fb3832918dac1c3', // 普通用户
  },
  avatar: {
    type: String,
    default: ''
  },
  status: { // 1 禁用
    type: String,
    default: 0,
  }
});

const UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;
```

Slider.js
```js
const mongoose = require('mongoose');
const SliderSchema = new mongoose.Schema({
  url: {
    type: String
  }
});
const SliderModel = mongoose.model('Slider', SliderSchema);
module.exports = SliderModel;
```

### config 数据库等配置连接

index.js
```js
module.exports = {
  mongo: 'mongodb://localhost:27017/saas',
  redis: {
    hostname: 'localhost',
    port: 6379,
  },
  secret: 'xiangju',
}
```
> Tip: 定义 mongo， redis，toke 的 secret（加盐方式） 

dbConfig.js
```js
const mongoose = require('mongoose');
const config = require('./index');

mongoose.connect(config.mongo, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = mongoose;
```

emailConfig.js
```js
const nodemailer = require('nodemailer');

async function sendEmail(sendInfo) {
  let transporter = nodemailer.createTransport({
    host: 'smtp.qq.com',
    prot: 587,
    secure: false,
    auth: {
      user: '188761973@qq.com',
      pass: 'yf920622yf',
    },
  });
  
  const info = await transporter.sendMail({
    from: '"认证邮箱" <188761973@qq.com>',
    to: sendInfo.email,
    subject: '修改密码的验证码，无需回复',
    html: `
      <p>您好，${sendInfo.email}，您的验证码是 ${sendInfo.code}，有效时间 30 分钟。</p>
    `,
  });

  return 'Message sent: %s', info.messageId
};

module.exports = sendEmail;
```

redisConfig.js
```js
const redis = require('redis');
const { promisify } = require('util');
const config = require('./index');

const client = redis.createClient({
  host: config.redis.hostname,
  prot: config.redis.port,
});

const setValue = (key, value, time) => {
  if (typeof time !== 'undefined') {
    client.set(key, value, 'EX', time);
  } else{
    client.set(key, value);
  }
};

const getValue = key => new Promise((resolve, reject) => {
  client.get(key, (err, data) => {
    if (err) reject(err);
    resolve(data);
  });
});

module.exports = {
  getValue,
  setValue,
}
```


## 总结

- koa 中间件处理机制，需要巩固
- model 层，controller 层合理划分
- router 二级路由实现