const fs = require('fs');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const config = require('../config');
const records = require('./records');

let users = {
  getUsers: async() =>  {
    try {
      let data = fs.readFileSync(config.data.users);
      return JSON.parse(data);
    }
    catch (error) {
      console.error('Error getting users');
      throw(error);
    }
  },
  getUser: async(id) =>  {
    try {
      let all = await users.getUsers();
      let match = _.where(all, {id:Number(id)});
      if (!match || match.length < 1) return null;

      let user = fs.readFileSync(match[0].path);
      return JSON.parse(user);
    }
    catch (error) {
      console.error('Error selecting user');
      throw(error);
    }
  },
  setOrder: async(user, order) => {
    try {
      let u = await users.getUser(user);
      u.order = order;
      users.writeUser(u);
    }
    catch (error) {
      console.error('Error updating user order');
      throw(error);
    }
  },
  setUser: async(data) => {
    try {
      var existing = await users.getUsers();
      for(var i=0; i<existing.length; i++) {
        if (existing[i].username == data.username && existing[i].id != data.id) {
          return {"error": "User name is already in use"};
        }
      }

      if (!data.height) {
        data.height = null;
      }

      let hash = '*';
      if (data.password && data.password.length > 0) {
        hash = await bcrypt.hash(data.password, 12);
      }

      let user = {
        id: (data.id && data.id > 0) ? data.id : existing.length + 1,
        username: data.username,
        fields: data.fields,
        height: data.height,
        theme: data.theme,
        persist: data.persist,
        protected: data.protected,
        password: hash,
        modified: new Date()
      };

      if (!data.id || data.id == 0) {
        // create a new user
        let path = config.data.root + '/user-' + user.id + '.json';
        user.records = [];
        user.order = "ASC";
        existing.push({id:user.id, username: user.username, path: path});
        fs.writeFileSync(config.data.users, JSON.stringify(existing));
        fs.writeFileSync(path, JSON.stringify(user));
      }
      else {
        // update a user
        let old = await users.getUser(user.id);
        let i = _.findLastIndex(existing, {id:Number(user.id)})
        user.records = old.records;
        user.order = old.order;
        let path = existing[i].path;
        if (existing[i].username != user.username) {
          existing[i].username = user.username;
          fs.writeFileSync(config.data.users, JSON.stringify(existing));
        }
        fs.writeFileSync(path, JSON.stringify(user));
      }
    }
    catch (error) {
      console.error('Error modifying user');
      throw(error);
    }
  },
  writeUser: async(user) => {
    try {
      var existing = await users.getUsers();
      var match = _.where(existing, {id : Number(user.id)});
      fs.writeFileSync(match[0].path, JSON.stringify(user));
    }
    catch (error) {
      console.error('Error writing user');
      throw(error);
    }
  }
}

module.exports = users;
