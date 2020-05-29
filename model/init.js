let Slider = require('./Slider');
let User = require('./User');
let Role = require('./Role');
let Auth = require('./Auth');

// 创建轮播图
// Slider.create([
//   { url:'http://www.ez12316.net/uploads/img/website/e63d6eb9901c48c0b99cd66a7f928b6d.jpg' }, 
//   { url: 'http://www.ez12316.net/uploads/img/website/46f32083b42941d8ab5601892409c39a.jpg' }, 
//   { url: 'http://www.ez12316.net/uploads/img/website/9cd3aab4dd38438ca5547235596a0a18.jpg' }
// ])

// 创建角色
// Role.create([
//   { roleName: '普通管理员' },
//   { roleName: '管理员' },
// ])

// 创建权限 
// Auth.create([
//   { pid: -1, name: '用户管理', id: 1, role: '5ecf7e6d1fb3832918dac1d5'},
//   { pid: 1, name: '用户权限', id: 2, role: '5ecf7e6d1fb3832918dac1d5', auth: 'userAuth', path: '/manager/userAuth' },
//   { pid: 1, name: '用户统计', id: 3, role: '5ecf7e6d1fb3832918dac1d5', auth: 'userStatistics', path: '/manager/userStatistics' },
//   { pid: -1, name: '信息发布', id: 4, role: '5ecf7e6d1fb3832918dac1d5', auth: 'infoPublish', path: '/manager/infoPublish' },
//   { pid: -1, name: '文章管理', id: 5, role: '5ecf7e6d1fb3832918dac1d5', auth: 'articleManage', path: '/manager/articleManage' },
//   { pid: -1, name: '个人中心', id: 6, role: '5ecf7e4a1fb3832918dac1c3', auth: 'personal', path: '/manager/personal' },
//   { pid: -1, name: '我的收藏', id: 7, role: '5ecf7e4a1fb3832918dac1c3', auth: 'myCollection', path: '/manager/myCollection' },
//   { pid: -1, name: '私信消息', id: 8, role: '5ecf7e4a1fb3832918dac1c3', auth: 'privateMessage', path: '/manager/privateMessage' },
//   { pid: -1, name: '我的文章', id: 9, role: '5ecf7e4a1fb3832918dac1c3', auth: 'myArticle', path: '/manager/myArticle' },
// ])

// 创建用户
// User.create([
//   { userName: 'admin', password: 'admin', role: '5ecf7e6d1fb3832918dac1d5' },
// ]).then(res => {
//   console.log(res);
// })

// ( async () => {
//   let { role } = await User.findOne({ userName: 'admin', password: 'admin' }).populate('role');
//   let data = await Auth.find({ role: role._id });
//   console.log(data);
// } )()