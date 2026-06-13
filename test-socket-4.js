import net from 'net';
import * as dotenv from 'dotenv';
dotenv.config();

function stringToNullTerminatedBuffer(str) {
  return Buffer.concat([Buffer.from(str, 'utf8'), Buffer.from([0])]);
}

const start = Date.now();
const client = net.createConnection({ path: process.env.SQL_HOST + '/.s.PGSQL.5432' });
client.on('connect', () => {
  console.log('Connected to socket at', Date.now()-start, 'ms');
  
  // StartupMessage
  const params = [
    "user", "ai_studio_app_user",
    "database", "cloud_sql_development_database"
  ];
  let buffers = [];
  params.forEach(p => buffers.push(stringToNullTerminatedBuffer(p)));
  buffers.push(Buffer.from([0])); // End of params

  const body = Buffer.concat(buffers);
  const lengthBuf = Buffer.alloc(4);
  lengthBuf.writeUInt32BE(4 + 4 + body.length, 0);

  const protocolBuf = Buffer.alloc(4);
  protocolBuf.writeUInt32BE(0x00030000, 0);

  const startupMsg = Buffer.concat([lengthBuf, protocolBuf, body]);
  client.write(startupMsg);
});

client.on('data', (data) => console.log('Data:', data.toString('utf8'), 'at', Date.now()-start));
client.on('error', (err) => console.log('Error:', err.message));
client.on('end', () => console.log('End!'));

// Wait 45s so control plane doesn't timeout
setTimeout(() => {
  console.log("Exiting after 45s");
  client.destroy();
}, 45000);
