import net from 'net';
import * as dotenv from 'dotenv';
dotenv.config();

function stringToNullTerminatedBuffer(str) {
  return Buffer.concat([Buffer.from(str, 'utf8'), Buffer.from([0])]);
}

const client = net.createConnection({ path: process.env.SQL_HOST + '/.s.PGSQL.5432' });
client.on('connect', () => {
  console.log('Connected to socket!');
  // Send SSL Request
  client.write(Buffer.from([0, 0, 0, 8, 4, 210, 22, 47])); 
});

let state = 'ssl';

client.on('data', (data) => {
  console.log('Data (hex):', data.toString('hex'), 'str:', data.toString('utf8'));
  if (state === 'ssl' && data.toString('utf8') === 'N') {
    state = 'startup';
    console.log("Got N. Sending StartupMessage...");
    // StartupMessage
    // Length: size of this message
    // Protocol version: 3.0 (196608 = 0x00030000)
    // parameters: "user\0ai_studio_app_user\0database\0cloud_sql_development_database\0\0"
    const params = [
      "user", "ai_studio_app_user",
      "database", "cloud_sql_development_database"
    ];
    let buffers = [];
    params.forEach(p => buffers.push(stringToNullTerminatedBuffer(p)));
    buffers.push(Buffer.from([0])); // End of params

    const body = Buffer.concat(buffers);
    const lengthBuf = Buffer.alloc(4);
    lengthBuf.writeUInt32BE(4 + 4 + body.length, 0); // length + protocol + body

    const protocolBuf = Buffer.alloc(4);
    protocolBuf.writeUInt32BE(0x00030000, 0);

    const startupMsg = Buffer.concat([lengthBuf, protocolBuf, body]);
    client.write(startupMsg);
  } else if (state === 'startup') {
    console.log("Got reply to startup!");
    // It should be AuthenticationCleartextPassword or MD5 or SASL
  }
});
client.on('error', (err) => console.log('Error:', err));
client.on('end', () => console.log('End!'));
