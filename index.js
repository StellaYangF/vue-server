const Koa = require("koa");
const cors = require("@koa/cors");
const body = require("koa-bodyparser");
const router = require("./routes/index");
const JWT = require("koa-jwt");
const { secret } = require("./config/index");

const WS = require("./config/webSocket");
// new WS().create();

const app = new Koa();
app.use((ctx, next) => {
  return next().catch((err) => {
    console.log(err);
    if (err.status == 401) {
      ctx.status = 401;
      ctx.body = "Protected resource, use Authorization header to get access\n";
    } else {
      throw err;
    }
  });
});
app.use(cors());
app.use(JWT({ secret }).unless({ path: [/^\/public/, /^\/user/] }));
app.use(body());
app.use(router());
app.on('error', err => console.log(err))
app.listen(3000, () =>
  console.log(
    `Server listening on http://localhost:3000, press Ctl + C to stop`
  )
);