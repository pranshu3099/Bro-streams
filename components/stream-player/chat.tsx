"use client";
import { useEffect, useState, useMemo } from "react";
import { ChatVariant, useChatSidebar } from "@/store/use-chat-sidebar ";
import { useMediaQuery } from "usehooks-ts";
import {
  useChat,
  useConnectionState,
  useRemoteParticipant,
} from "@livekit/components-react";
import { Skeleton } from "../ui/skeleton";
import { ConnectionState } from "livekit-client";
import { ChatHeader, ChatHeaderSkeleton } from "./chat-header";
import { ChatForm, ChatFormSkeleton } from "./chat-form";
import { ChatList, ChatListSkeleton } from "./chat-list";
import { ChatCommunity } from "./chat-community";
interface Chatprops {
  hostName: string;
  hostIdentity: string;
  viwerName: string;
  isFollowing: boolean;
  isChatEnabled: boolean;
  isChatDelayed: boolean;
  isChatFollowersOnly: boolean;
}

export const Chat = ({
  viwerName,
  hostName,
  hostIdentity,
  isFollowing,
  isChatDelayed,
  isChatEnabled,
  isChatFollowersOnly,
}: Chatprops) => {
  const matches = useMediaQuery("(max-width:1024px)");
  const { variant, onExpand } = useChatSidebar((state) => state);
  const connectionState = useConnectionState();
  const participant = useRemoteParticipant(hostIdentity);

  const isOnline = participant && connectionState === ConnectionState.Connected;
  const isHidden = !isChatEnabled || !isOnline;
  const [value, setValue] = useState("");
  const { chatMessages: messages, send } = useChat();
  //   The useChat hook provides chat functionality for a LiveKit room. It returns a simple send function
  // to send chat messages and an array of chatMessages to hold received messages.
  // It also returns a update function that allows you to implement message-edit functionality.
  useEffect(() => {
    if (matches) {
      onExpand();
    }
  }, [matches, onExpand]);
  const reversedMessages = useMemo(() => {
    return messages.sort((a, b) => b.timestamp - a.timestamp);
  }, [messages]);
  const onSubmit = () => {
    if (!send) return;
    send(value);
    setValue("");
  };

  const onChange = (value: string) => {
    console.log(value);
    setValue(value);
  };
  return (
    <div className="flex flex-col  bg-[#252731] border-[#2D2E35] border-l border-b pt-0 h-[calc(100vh-80px)]">
      <ChatHeader />
      {variant === ChatVariant.CHAT && (
        <>
          <ChatList messages={reversedMessages} isHidden={isHidden} />
          <ChatForm
            onSubmit={onSubmit}
            onChange={onChange}
            value={value}
            isHidden={isHidden}
            isFollowersOnly={isChatFollowersOnly}
            isDelayed={isChatDelayed}
            isFollowing={isFollowing}
          />
        </>
      )}
      {variant === ChatVariant.COMMUNITY && (
        <>
          <ChatCommunity
            viewerName={viwerName}
            hostName={hostName}
            isHidden={isHidden}
          />
        </>
      )}
    </div>
  );
};

export const ChatSkeleton = () => {
  return (
    <div className="flex flex-col border-l border-b pt-0 h-[calc(100vh-80px)] border-2">
      <ChatHeaderSkeleton />
      <ChatListSkeleton />
      <ChatFormSkeleton />
    </div>
  );
};
