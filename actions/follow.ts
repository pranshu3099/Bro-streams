"use server";
// use server will ensure security so that it actually behaves like an api route and does not get mix-up with javascript
// bundle
import { revalidatePath } from "next/cache";
import { FollowUser, unFollowUser } from "@/lib/follow-service";

export const onFollow = async (id: string) => {
  try {
    const followedUser = await FollowUser(id);
    revalidatePath("/");
    if (followedUser) {
      revalidatePath(`/${followedUser.following.username}`);
    }
    return followedUser;
  } catch (err) {
    throw new Error("Internal server");
  }
};

export const onUnFollow = async (id: string) => {
  try {
    const UnfollowedUser = await unFollowUser(id);
    revalidatePath("/");
    if (UnfollowedUser) {
      revalidatePath(`/${UnfollowedUser.following.username}`);
    }
    return UnfollowedUser;
  } catch (err) {
    throw new Error("Internal server");
  }
};
