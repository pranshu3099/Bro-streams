import { isFollowingUser } from "@/lib/follow-service";
import { getUserByUsername } from "@/lib/user-service";
import { notFound } from "next/navigation";
import { Actions } from "./_components/actions";
import { HasblockedOtherUser } from "@/lib/block-service";
interface UserPageProps {
  params: {
    username: string;
  };
}

const UserPage = async ({ params }: UserPageProps) => {
  const user = await getUserByUsername(params?.username);
  if (!user) {
    notFound();
  }

  const isFollowing = await isFollowingUser(user?.id);
  const hasBlocked = await HasblockedOtherUser(user?.id);
  return (
    <div className="flex flex-col gap-y-4">
      <p>{user?.username}</p>
      <p>{user?.id}</p>
      <p>is following : {`${isFollowing}`}</p>
      <Actions
        isFollowing={isFollowing}
        userId={user.id}
        hasBlocked={hasBlocked}
      />
    </div>
  );
};

export default UserPage;
