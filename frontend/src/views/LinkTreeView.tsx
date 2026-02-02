import React, { useState } from "react";
import { social } from "../data/social";
import DevTreeInput from "../components/DevTreeInput";
import { isValidUrl } from "../utils";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "../api/DevTreeApi";
import type { DevTreeLink, SocialNetwork, User } from "../types";

export default function LinkTreeView() {
  const queryClient = useQueryClient();
  const user: User = queryClient.getQueryData(["user"])!;

  const [devTreeLinks, setDevTreeLinks] = useState(() => {
    const updatedData = social.map((item) => {
      const userLink = JSON.parse(user.links).find(
        (link: DevTreeLink) => link.name === item.name,
      );
      if (userLink) {
        return {
          ...item,
          url: userLink.url,
          enabled: userLink.enabled,
        };
      }
      return item;
    });
    return updatedData;
  });

  const { mutate } = useMutation({
    mutationFn: updateProfile,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("Perfil actualizado correctamente");
    },
  });

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedLinks = devTreeLinks.map((link) =>
      link.name === e.target.name ? { ...link, url: e.target.value } : link,
    );
    setDevTreeLinks(updatedLinks);
  };

  const links: SocialNetwork[] = JSON.parse(user.links);
  const handleEnableLink = (socialNetwork: string) => {
    const updatedLinks = devTreeLinks.map((link) => {
      if (link.name === socialNetwork) {
        if (isValidUrl(link.url)) {
          return { ...link, enabled: !link.enabled };
        } else {
          toast.error("URL no válida");
        }
      }
      return link;
    });
    setDevTreeLinks(updatedLinks);

    let updatedItems: SocialNetwork[] = [];
    const selectedSocialNetwork = updatedLinks.find(
      (link) => link.name === socialNetwork,
    );
    if (selectedSocialNetwork?.enabled) {
      const id = links.filter((link) => link.id).length + 1;
      if (links.some((link) => link.name === socialNetwork)) {
        updatedItems = links.map((link) => {
          if (link.name === socialNetwork) {
            return { ...link, enabled: true, id };
          } else {
            return link;
          }
        });
      } else {
        const newItem = {
          ...selectedSocialNetwork,
          id,
        };
        updatedItems = [...links, newItem];
      }
    } else {
      const indexToUpdate = links.findIndex(
        (link) => link.name === socialNetwork,
      );
      updatedItems = links.map((link) => {
        if (link.name === socialNetwork) {
          return { ...link, id: 0, enabled: false };
        } else if (
          indexToUpdate !== 0 &&
          link.id === 1 &&
          link.id > indexToUpdate
        ) {
          return { ...link, id: link.id - 1 };
        } else {
          return link;
        }
      });
    }

    queryClient.setQueryData(["user"], (prevData: User) => {
      return { ...prevData, links: JSON.stringify(updatedItems) };
    });
  };

  return (
    <>
      <div className="space-y-5">
        {devTreeLinks.map((item) => (
          <DevTreeInput
            key={item.name}
            item={item}
            handleUrlChange={handleUrlChange}
            handleEnableLink={handleEnableLink}
          />
        ))}
        <button
          className="w-full p-2 text-lg font-bold uppercase rounded bg-cyan-400 text-slate-600"
          onClick={() => mutate(queryClient.getQueryData(["user"])!)}
        >
          Guardar Cambios
        </button>
      </div>
    </>
  );
}
