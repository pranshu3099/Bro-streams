"use server";

import { Stream } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getSelf } from "@/lib/authservice";
import { getStreamByUserId } from "@/lib/stream-service";

export const updateStream = async (values: Partial<Stream>) => {
  try {
    const self = await getSelf();
    const selfstream = await getStreamByUserId(self?.id);
    if (!selfstream) {
      throw new Error("Stream not Found");
    }

    const validData = {
      name: values?.name,
      isChatEnabled: values?.isChatEnabled,
      isChatDelayed: values?.isChatDelayed,
      isChatFollowersOnly: values?.isChatFollowersOnly,
    };

    const stream = await db.stream.update({
      where: {
        id: selfstream?.id,
      },
      data: {
        ...validData,
      },
    });
    revalidatePath(`/u/${self.username}/chat`);
    revalidatePath(`/u/${self.username}`);
    revalidatePath(`/${self.username}`);
  } catch {
    throw new Error("Internal server Error");
  }
};
