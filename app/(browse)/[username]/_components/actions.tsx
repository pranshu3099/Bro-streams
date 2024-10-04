"use client";
import { onBlock, onUnBlock } from "@/actions/block";
import { onFollow, onUnFollow } from "@/actions/follow";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { toast } from "sonner";
interface ActionsProps {
  isFollowing: boolean;
  userId: string;
  hasBlocked: boolean;
}
export const Actions = ({ isFollowing, userId, hasBlocked }: ActionsProps) => {
  const [isPending, startTransition] = useTransition();
  const handleFollow = () => {
    startTransition(() => {
      onFollow(userId)
        .then((data) => {
          toast.success(`you are now following ${data.following.username}`);
        })
        .catch((err) => {
          console.log(err);
          toast.error("something went wrong");
        });
    });
  };

  const handleUnfollow = () => {
    startTransition(() => {
      onUnFollow(userId)
        .then((data) => {
          toast.success(`you unfollowed ${data.following.username}`);
        })
        .catch((err) => {
          console.log(err);
          toast.error("something went wrong");
        });
    });
  };

  const handleBlock = () => {
    startTransition(() => {
      onBlock(userId)
        .then((data) => {
          toast.success(`You blocked ${data?.blocked.username}`);
        })
        .catch((err) => {
          console.log(err);
          toast.error("something went wrong");
        });
    });
  };

  const handleunBlock = () => {
    startTransition(() => {
      onUnBlock(userId)
        .then((data) => {
          toast.success(`You unblocked ${data.blocked.username}`);
        })
        .catch((err) => {
          console.log(err);
          toast.error("something went wrong");
        });
    });
  };

  return (
    <>
      <Button
        disabled={isPending}
        variant={"primary"}
        onClick={!isFollowing ? handleFollow : handleUnfollow}
      >
        {!isFollowing ? "Follow" : "Unfollow"}
      </Button>

      <Button
        onClick={!hasBlocked ? handleBlock : handleunBlock}
        disabled={isPending}
      >
        {!hasBlocked ? "Block" : "Unblock"}
      </Button>
    </>
  );
};
