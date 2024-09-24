"use client";
import { useState, useMemo } from "react";
import { useDebounceValue } from "usehooks-ts";
import { useParticipants } from "@livekit/components-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CommunityItem } from "./community-item";
import { LocalParticipant, RemoteParticipant } from "livekit-client";
interface ChatCommunityProps {
  viewerName: string;
  hostName: string;
  isHidden: boolean;
}

export const ChatCommunity = ({
  viewerName,
  hostName,
  isHidden,
}: ChatCommunityProps) => {
  const [value, setValue] = useState("");
  const debouncedValue = useDebounceValue<string>(value, 500);
  const particpants = useParticipants();
  const onChange = (newValue: string) => {
    setValue(newValue);
  };

  const filteredParticipants = useMemo(() => {
    const deduped = particpants.reduce((acc, particpant) => {
      const hostAsViewer = `host-${particpant.identity}`;

      if (!acc.some((p) => p.identity === hostAsViewer)) {
        acc.push(particpant);
      }
      return acc;
    }, [] as (RemoteParticipant | LocalParticipant)[]);

    return deduped.filter((particpant) => {
      return particpant.name?.toLowerCase().includes(value);
    });
  }, [particpants, debouncedValue]);

  if (isHidden) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-muted-foreground">Community is Disabled</p>
      </div>
    );
  }
  return (
    <div className="p-4 ">
      <Input
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search Community"
        className="border-white/10"
      />
      <ScrollArea className="gap-y-2 mt-4">
        <p className="text-center text-sm text-muted-foreground hidden last:block p-2">
          No result
        </p>
        {filteredParticipants.map((particpant) => (
          <CommunityItem
            key={particpant.identity}
            hostName={hostName}
            viewerName={viewerName}
            participantName={particpant.name}
            participantIdentity={particpant.identity}
          />
        ))}
      </ScrollArea>
    </div>
  );
};
