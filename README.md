# health-records-js

health-records-js is a simple web app to store and visualize health records. It is based on health-records-pg which uses a Postgres batabase for the backend. This version is implemented as a pure node app with no external (non-npm) dependencies. It does not support concurrent users due to the use of the default session store.

Plotty.js is used to plot graphs of the daily records.

Not included in this repository is the config.js file at the root of the project. Below is an example of what this file should contain. 

```
module.exports = {
  data: {
    root: __dirname + '/data',
    users: __dirname + '/data/users.json'
  },
  server: {
    approot: __dirname,
    port:8300
  },
  session: {
    name: 'session', // name of session cookie
    maxAge: 30 * (24 * 60 * 60 * 1000), // 30 days in ms
    key: 'x3au15726p'
  }
};
```
