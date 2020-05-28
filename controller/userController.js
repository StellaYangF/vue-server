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