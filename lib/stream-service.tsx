import { db } from "@/lib/db";

export const getStreamByUserId = async (UserId: string) => {
  const stream = await db.stream.findUnique({
    where: {
      UserId,
    },
  });
  return stream;
};
