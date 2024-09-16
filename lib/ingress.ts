"use server";

import {
  IngressAudioEncodingPreset,
  IngressInput,
  IngressClient,
  IngressVideoEncodingPreset,
  RoomServiceClient,
  TrackSource,
  CreateIngressOptions,
  IngressVideoOptions,
  IngressAudioOptions,
} from "livekit-server-sdk";

import { db } from "@/lib/db";
import { getSelf } from "./authservice";
import { revalidatePath } from "next/cache";

const roomService = new RoomServiceClient(
  process.env.LIVEKIT_API_URL!,
  process.env.LIVEKIT_API_KEY!,
  process.env.LIVEKIT_API_SECRET!
);

const ingressClient = new IngressClient(process.env.LIVEKIT_API_URL!);

const resetIngresses = async (hostIdentity: string) => {
  const ingresses = await ingressClient.listIngress({
    roomName: hostIdentity,
  });

  const rooms = await roomService.listRooms([hostIdentity]);
  for (const room of rooms) {
    await roomService.deleteRoom(room.name);
  }

  for (const ingress of ingresses) {
    if (ingress.ingressId) {
      await ingressClient.deleteIngress(ingress.ingressId);
    }
  }
};

export const createIngress = async (ingressType: IngressInput) => {
  const self = await getSelf();

  await resetIngresses(self.id);

  //TODO: Reset Previous Ingress

  const options: CreateIngressOptions = {
    name: self?.username,
    roomName: self?.id,
    participantName: self?.username,
    participantIdentity: self?.id,
  };

  if (ingressType === IngressInput.WHIP_INPUT) {
    options.enableTranscoding = true;
  } else {
    const videoOptions = new IngressVideoOptions();
    videoOptions.source = TrackSource.CAMERA;
    videoOptions.encodingOptions = {
      case: "preset",
      value: IngressVideoEncodingPreset.H264_1080P_30FPS_3_LAYERS,
    };

    const audioOptions = new IngressAudioOptions();
    audioOptions.source = TrackSource.MICROPHONE;
    audioOptions.encodingOptions = {
      case: "preset",
      value: IngressAudioEncodingPreset.OPUS_STEREO_96KBPS,
    };
    options.video = videoOptions;
    options.audio = audioOptions;
  }

  const ingress = await ingressClient.createIngress(ingressType, options);
  if (!ingress || !ingress.url || !ingress.streamKey) {
    throw new Error("Failed to create ingress");
  }

  await db.stream.update({
    where: {
      UserId: self.id,
    },
    data: {
      ingressId: ingress.ingressId,
      serverUrl: ingress.url,
      streamKey: ingress.streamKey,
    },
  });

  revalidatePath(`/u/${self.username}/keys`);
  // return ingress;
};
