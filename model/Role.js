const mongoose = require('mongoose');

const RoleSchema = mongoose.Schema({
  roleName: {
    type: String,
  },
});

const RoleModel = mongoose.model('Role', RoleSchema);

module.exports = RoleModel;