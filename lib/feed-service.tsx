import { db } from "@/lib/db";
import { getSelf } from "@/lib/authservice";

export const getStreams = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  let userId;
  try {
    const self = await getSelf();
    userId = self.id;
  } catch {
    userId = null;
  }
  let streams = [];
  if (userId) {
    streams = await db.stream.findMany({
      where: {
        user: {
          NOT: {
            blocking: {
              some: {
                blockedId: userId,
              },
            },
          },
        },
      },

      select: {
        user: true,
        id: true,
        thumbnailUrl: true,
        name: true,
        isLive: true,
      },
      orderBy: [
        {
          isLive: "desc",
        },
        {
          updatedAt: "desc",
        },
      ],
    });
  } else {
    streams = await db.stream.findMany({
      select: {
        user: true,
        id: true,
        thumbnailUrl: true,
        name: true,
        isLive: true,
      },

      orderBy: [
        {
          isLive: "desc",
        },
        {
          updatedAt: "desc",
        },
      ],
    });
  }
  return streams;
};
