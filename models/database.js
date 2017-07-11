const pg = require('pg');
//credentials of postgre
//username : postgres
//password:root
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:root@localhost:5432/todo'; 

const client = new pg.Client(connectionString);
client.connect();
const query = client.query(
  'CREATE TABLE items(id SERIAL PRIMARY KEY, text VARCHAR(40) not null, complete BOOLEAN)');
query.on('end', () => { client.end(); });



// //schema
//                                  Table "public.items"
//   Column  |         Type          |                     Modifiers                      
// ----------+-----------------------+----------------------------------------------------
//  id       | integer               | not null default nextval('items_id_seq'::regclass)
//  text     | character varying(40) | not null
//  complete | boolean               | 
// Indexes:
//     "items_pkey" PRIMARY KEY, btree (id)
