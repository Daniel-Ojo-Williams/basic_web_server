import axios from "axios";

export async function getTemperature(lon: number, lat: number) {
  const appid = process.env.WEATHERAPI as string;

  if (!appid) throw new Error('Open weather API Key not found')

  const res = await axios.get('https://api.openweathermap.org/data/3.0/onecall', {
    params: {
      lat, lon, appid, units: 'metric'
    }
  });

  if (!res) throw new Error('Could not get temperature');

  const data = res.data as { current: { temp: number } };

  return data.current;
}

