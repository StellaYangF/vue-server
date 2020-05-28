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

  async validate(ctx) {}

  async sendEmail(ctx) {}

  async codeValidate(ctx) {}

  async changePassword(ctx) {}
  
}

module.exports = new UserController;