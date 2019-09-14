import os from 'os';

const interfaces = os.networkInterfaces();

export const getNetworkAddress = () => {
  for (const fields of Object.values(interfaces)) {
    for (const interf of fields) {
      const { address, family, internal } = interf;
      if (family === 'IPv4' && !internal) {
        return address;
      }
    }
  }
}