import type { Response, Request } from 'express-serve-static-core';
import express from 'express';
import cors from 'cors';
import { getIPDetails, getTemperature } from './services';
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors());

app.get('/api/hello', async (req: Request, res: Response) => {
  try {
    const { visitorName } = <{ visitorName: string }>req.query;

    if (!visitorName) return res.status(400).json({ error: true, message: 'Visitor name is required is request query' });

    const ip = req.ip as string;

    if (!ip || typeof ip === 'undefined') return res.status(500).json({ error: true, message: 'Could not get user IP Data, please try again later' });

    const { city, lat, lon } = await getIPDetails(ip);
    const { temp } = await getTemperature(lon, lat);

    const greeting = `Hello, ${visitorName}, the temperature is ${temp} degree Celcius in ${city}`;

    res.status(200).json({ client_ip: ip, location: city, greeting });
  } catch (error) {
    res.status(500).json({ error: true, message: 'Something went wrong, please try again later', severMessage: (error as Error).message });
  }
});



app.all('*', (req: Request, res: Response) => res.send(400).json({ error: true, message: 'Invalid endpoint or method used, please check and try again later' }));

const PORT = process.env.PORT as string || '9000';

app.listen(PORT, () => console.log(`Server running on ${PORT}`)); 