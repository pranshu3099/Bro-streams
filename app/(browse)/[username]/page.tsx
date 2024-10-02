import { isFollowingUser } from "@/lib/follow-service";
import { getUserByUsername } from "@/lib/user-service";
import { notFound } from "next/navigation";
import { Actions } from "./_components/actions";
import { HasblockedOtherUser, isBlockedByUser } from "@/lib/block-service";
import StreamPlayer from "@/components/stream-player";
interface UserPageProps {
  params: {
    username: string;
  };
}

const UserPage = async ({ params }: UserPageProps) => {
  const user = await getUserByUsername(params?.username);
  if (!user || !user.stream) {
    notFound();
  }

  let isFollowing = false;
  let isBlocked = false;

  isFollowing = await isFollowingUser(user?.id);
  isBlocked = await isBlockedByUser(user?.id);
  if (isBlocked) {
    notFound();
  }
  return (
    <>
      <StreamPlayer
        user={user}
        stream={user.stream}
        isFollowing={isFollowing}
      />
    </>
  );
};

export default UserPage;
