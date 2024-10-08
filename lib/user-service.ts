import { db } from "@/lib/db";
export const getUserByUsername = async (username: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        username,
      },
      select: {
        id: true,
        externalUserId: true,
        username: true,
        bio: true,
        imageurl: true,
        stream: {
          select: {
            id: true,
            name: true,
            thumbnailUrl: true,
            isLive: true,
            isChatDelayed: true,
            isChatEnabled: true,
            isChatFollowersOnly: true,
          },
        },
        _count: {
          select: {
            followedBy: true,
          },
        },
      },
    });

    return user;
  } catch (err) {
    console.log(err);
  }
};

export const getUserById = async (id: string) => {
  const user = await db.user.findUnique({
    where: {
      id,
    },
    include: {
      stream: true,
    },
  });

  return user;
};
