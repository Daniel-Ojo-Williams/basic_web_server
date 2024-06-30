import IPData from "ipdata";

export async function getIPDetails(ip: string) {
  const IPAPI = process.env.IPAPI as string;

  if (!IPAPI) throw new Error("IPData API key not found");

  const ipdata = new IPData(IPAPI);

  const data = await ipdata.lookup(ip);

  if (!data) throw new Error("Could not get IP data");

  if (!data.region) throw new Error("Could not get IP region");

  return { city: data.region, lat: data.latitude, lon: data.longitude };
}
