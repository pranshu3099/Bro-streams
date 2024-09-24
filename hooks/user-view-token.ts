import { toast } from "sonner";
import { useEffect, useState } from "react";
import { JwtPayload, jwtDecode } from "jwt-decode";
import { createViewerToken } from "@/actions/token";

export const useViwerToken = (hostIdentity: string) => {
  const [token, setToken] = useState("");
  const [name, setName] = useState("");
  const [identity, setIdentity] = useState("");

  useEffect(() => {
    const createToken = async () => {
      try {
        const viwerToken = await createViewerToken(hostIdentity);
        setToken(viwerToken);
        const decodeToken = jwtDecode(viwerToken) as JwtPayload & {
          name?: string;
        };
        const name = decodeToken?.name;
        const identity = decodeToken.sub;
        if (identity) {
          setIdentity(identity);
        }
        if (name) {
          setName(name);
        }
      } catch {
        toast.error("Something went wrong");
      }
    };
    createToken();
  }, [hostIdentity]);
  return { token, name, identity };
};
