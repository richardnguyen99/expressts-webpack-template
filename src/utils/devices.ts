import { mockedData } from "../server";
import type { Device } from "../types";

export const getLoggedDevicesFromUserId = async (
  userId: string,
): Promise<Device[]> => {
  const data = await mockedData;

  return data.devices.filter((device) => device.userId === userId);
};
