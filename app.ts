import express, { Express, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
// import morgan from "morgan";
import { PrismaClient } from "@prisma/client";

import userRouter from "./routes/user";
import marketplaceRouter from "./routes/marketplace";
import stripeRouter from "./routes/stripe";
import eventosRouter from "./routes/eventos";
import entradasRouter from "./routes/entradas";
import cuponesRouter from "./routes/entradas";




import bodyParser from "body-parser";

dotenv.config();

const prisma = new PrismaClient();
const app: Express = express();
const port = process.env.PORT || 3000;

app.use(cors());
// app.use(morgan("tiny"));
app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  // @ts-ignore
  req.prisma = prisma;
  next();
});
app.use(bodyParser.urlencoded({ limit: 1024*1024*10,type:'application/x-www-form-urlencode',
extended: true }));
app.use(bodyParser.json({ limit: 1024*1024*10,type:'application/json',
 }));
 app.use(bodyParser.json({ limit:'50mb'
 }));
app.use("/user", userRouter);
app.use("/marketplace", marketplaceRouter);
app.use("/stripe", stripeRouter);
app.use("/eventos", eventosRouter);
app.use("/entradas", entradasRouter);
app.use("/cupones", cuponesRouter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));



app.use((err:any, req:any, res:any, next:any) => {
  if (err && err.error && err.error.isJoi) {
    // we had a joi error, let's return a custom 400 json response
    const cadena = err.error.details[0].message
    console.log(cadena)
    const i= cadena.indexOf("")
    console.log(cadena.slice(1,i))
    res.status(400).json({
      error: err.error.details[0].message
    });
  } else {
    // pass on to another error handler
    next(err);
  }
});

app.get("/", (req: Request, res: Response) => res.type("html").send(html));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
const html = `
<!DOCTYPE html>
<html>
  <head>
    <title>Hello from Render!</title>
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js"></script>
    <script>
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          disableForReducedMotion: true
        });
      }, 500);
    </script>
    <style>
      @import url("https://p.typekit.net/p.css?s=1&k=vnd5zic&ht=tk&f=39475.39476.39477.39478.39479.39480.39481.39482&a=18673890&app=typekit&e=css");
      @font-face {
        font-family: "neo-sans";
        src: url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff2"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("opentype");
        font-style: normal;
        font-weight: 700;
      }
      html {
        font-family: neo-sans;
        font-weight: 700;
        font-size: calc(62rem / 16);
      }
      body {
        background: white;
      }
      section {
        border-radius: 1em;
        padding: 1em;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-right: -50%;
        transform: translate(-50%, -50%);
      }
    </style>
  </head>
  <body>
    <section>
      Hello from Render!
    </section>
  </body>
</html>
`;
