const redis = require('redis');
const { promisify } = require('util');
const config = require('./index');

const client = redis.createClient({
  host: config.redis.host,
  port: config.redis.port,
});

client.on("error", function(error) {
  console.error('redis error', error);
});
 
const setValue = (key, value, time) => {
  if (typeof time !== 'undefined') {
    client.set(key, value, 'EX', time);
  } else{
    client.set(key, value);
  }
};

const getValue = key => new Promise((resolve, reject) => {
  client.get(key, (err, data) => {
    if (err) reject(err);
    resolve(data);
  });
});

module.exports = {
  getValue,
  setValue,
}