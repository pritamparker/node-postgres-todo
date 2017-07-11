var config = {//credentials of postgre
//username : postgres
//password:root
  connectionString : process.env.DATABASE_URL || 'postgres://postgres:root@localhost:5432/todo'

};

module.exports = exports = config;