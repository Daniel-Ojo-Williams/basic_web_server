import type { Response, Request } from "express-serve-static-core";
import express from "express";
import cors from "cors";
import { getIPDetails, getTemperature } from "./services";
import 'dotenv/config';
const app = express();

app.set("trust proxy", true);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Hello, welcome to Stage 1 server!" })
})

app.get("/api/hello", async (req: Request, res: Response) => {
  try {
    const { visitor_name } = <{ visitor_name: string }>req.query;

    if (!visitor_name)
      return res.status(400).json({
        error: true,
        message: "Visitor name is required is request query",
      });

    let ip = (req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress) as string;

    if (!ip || typeof ip === "undefined")
      return res.status(500).json({
        error: true,
        message: "Could not get user IP Data, please try again later",
      });

      if (ip.startsWith('::ffff:')) {
        ip = ip.split('::ffff:')[1];
      }

    const { city, lat, lon } = await getIPDetails(ip);
    const { temp } = await getTemperature(lon, lat);

    const greeting = `Hello, ${visitor_name}, the temperature is ${Math.round(
      temp
    )} degree Celcius in ${city}`;

    res.status(200).json({ client_ip: ip, location: city, greeting });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: "Something went wrong, please try again later",
    });
  }
});

app.all("*", (req: Request, res: Response) =>
  res.status(400).json({
    error: true,
    message:
      "Invalid endpoint or method used, please check and try again later",
  })
);

const PORT = (process.env.PORT as string) || "9000";

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
