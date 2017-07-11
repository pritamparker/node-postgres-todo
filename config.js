var config = {
//credentials of postgres
//username : postgres
//password:root
//connectionString : process.env.DATABASE_URL || 'postgres://avqiapzwhicwyx:0678153f3f20fbb7ac90cfb8aef1426668ec4fe34c736cf14b97cc8e79c6d4a1@ec2-23-23-248-162.compute-1.amazonaws.com:5432/d73mgevoc8jlt8'
connectionString : process.env.DATABASE_URL || 'postgres://postgres:root@localhost:5432/todo';

};

module.exports = exports = config;