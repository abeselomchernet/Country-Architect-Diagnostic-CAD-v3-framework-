import net from 'net';
import * as dotenv from 'dotenv';
dotenv.config();

const client = net.createConnection({ path: process.env.SQL_HOST + '/.s.PGSQL.5432' });
client.on('connect', () => {
  console.log('Connected to socket!');
  // Write a basic SSL Request packet
  client.write(Buffer.from([0, 0, 0, 8, 4, 210, 22, 47])); 
});
client.on('data', (data) => console.log('Data:', data.toString('hex')));
client.on('error', (err) => console.log('Error:', err));
client.on('end', () => console.log('End!'));
