const pg = require('pg');
var config = require(__dirname + '/../config.js')
const connectionString = config.connectionString;
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
