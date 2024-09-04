import { db } from "./db";
import { getSelf } from "@/lib/authservice";

export const isFollowingUser = async (id: string) => {
  try {
    const self = await getSelf();
    const otherUser = await db.user.findFirst({
      where: { id },
    });

    if (!otherUser) {
      throw new Error("User not found");
    }
    if (otherUser.id === self.id) {
      return true;
    }
    const existingFollow = await db.follow.findFirst({
      where: {
        followerId: self.id,
        followingId: otherUser.id,
      },
    });
    return !!existingFollow;
  } catch {
    return false;
  }
};

export const FollowUser = async (id: string) => {
  const self = await getSelf();
  const otherUser = await db.user.findFirst({
    where: { id },
  });
  if (!otherUser) {
    throw new Error("User not found");
  }
  if (otherUser.id === self.id) {
    throw new Error("Cannot follow user");
  }
  const existingFollow = await db.follow.findFirst({
    where: {
      followerId: self.id,
      followingId: otherUser.id,
    },
  });

  if (existingFollow) {
    throw new Error("Already Following");
  }

  const follow = await db.follow.create({
    data: {
      followerId: self.id,
      followingId: otherUser.id,
    },
    include: {
      following: true,
      follower: true,
    },
  });
  return follow;
};

export const unFollowUser = async (id: string) => {
  const self = await getSelf();
  const otherUser = await db.user.findFirst({
    where: { id },
  });

  if (!otherUser) {
    throw new Error("User not found");
  }

  if (otherUser.id === self.id) {
    throw new Error("Cannot unfollow yourself");
  }

  const existingFollow = await db.follow.findFirst({
    where: {
      followerId: self.id,
      followingId: otherUser.id,
    },
  });

  if (!existingFollow) {
    throw new Error("not Following");
  }

  const unfollow = await db.follow.delete({
    where: {
      id: existingFollow.id,
    },
    include: {
      following: true,
    },
  });

  return unfollow;
};
