const fs = require('fs');
const _ = require('underscore');
const config = require('../config');
const users = require('./users');

let records = {
  getRecords: async(id) =>  {
    try {
      let user = await users.getUser(id);
      return user.records;
    }
    catch (error) {
      console.error('Error selecting records for user ' + user);
      throw(error);
    }
  },
  setRecord: async(fields, data) => {
    //let client = null;
    try {
      let user = await users.getUser(data.user);
      let row = {modified:new Date()};

      for(var i = 0; i < fields.length; i++) {
        if (fields[i] == 'date') {
          if (!data.date.match(/[0-9]+\/[0-9]+\/[0-9]+/)) {
            console.log('date field ' + data.date + ' could not be parsed');
            return false;
          }
          row[fields[i]] = data[fields[i]];
        }
        else if (data[fields[i]] && !isNaN(data[fields[i]])) {
          row[fields[i]] = Number(data[fields[i]]);
        }
      }

      if (!data.id || data.id == 0) {
        row.id = user.records.length + 1;
        user.records.push(row);
      }
      else {
        var i = _.findLastIndex(user.records, {id : Number(data.id) });
        user.records[i] = row;
      }
      await users.writeUser(user);

    }
    catch (error) {
      console.error('Error modifying record')
      throw(error);
    }
  },
  getFields: async() => {
      return  new Array(
        "weight" ,
        "systolic" ,
        "diastolic" ,
        "pulse" ,
        "blood sugar" ,
        "alcohol" ,
        "coffee" ,
        "exercise" ,
        "steps" ,
        "distance ran" ,
        "distance walked" ,
        "distance biked" ,
        "calories" ,
        "water" ,
        "sleep" ,
        "basal temp" ,
        "body temp");
  },
  getCsv: async(user, fields) => {
    try {
      var rows = await records.getRecords(user);
      fields.unshift('user');
      fields.unshift('date');
      var csv = fields.join() + '\n';
      for(var i=0; i<rows.length; i++) {
        var vals = []
        for(var ii=0; ii<fields.length; ii++) {
          var val = rows[i][fields[ii]];
          if (fields[ii] == 'date' || fields[ii] == 'modified') {
            var dt = new Date(rows[i][fields[ii]]);
            val = dt.toLocaleDateString('en-US')
          }
          vals.push(val);
        }
        csv += vals.join() + '\n';
      }
      return csv;
    }
    catch (error) {
      console.error('Error generating records csv for user ' + user);
      throw(error);
    }
  },
  deleteRecord: async(user, id) => {
    try {
      let u = await users.getUser(user);
      var i = _.findLastIndex(user.records, {id : Number(id) });
      u.records.splice(i, 1);
      await users.writeUser(u);
    }
    catch (error) {
      console.error('Error selecting records for user ' + user);
      throw(error);
    }
  }
}

module.exports = records;
