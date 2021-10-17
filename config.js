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
