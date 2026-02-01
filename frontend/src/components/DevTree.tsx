import { Link, Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import { DndContext, type DragEndEvent, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import NavigationTabs from "../components/NavigationTabs";
import type { SocialNetwork, User } from "../types";
import DevTreeLink from "./DevTreeLink";
import { useState, useEffect, startTransition } from "react";
import { useQueryClient } from "@tanstack/react-query";

type DevTreeProps = {
  data: User;
};

// Helper function to ensure unique IDs
const ensureUniqueIds = (links: SocialNetwork[]) => {
  const ids = new Set<number>();
  return links.map((link) => {
    let id = link.id;
    while (ids.has(id)) {
      id = id + 1; // Incrementa el ID hasta que sea único
    }
    ids.add(id);
    return { ...link, id };
  });
};

export default function DevTree({ data }: DevTreeProps) {
  const [enabledLinks, setEnabledLinks] = useState<SocialNetwork[]>(
    ensureUniqueIds(
      JSON.parse(data.links).filter((item: SocialNetwork) => item.enabled),
    ),
  );

  useEffect(() => {
    startTransition(() => {
      const uniqueLinks = ensureUniqueIds(
        JSON.parse(data.links).filter((item: SocialNetwork) => item.enabled),
      );
      setEnabledLinks(uniqueLinks);
    });
  }, [data]);

  const queryClient = useQueryClient();

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;

    if (over && over.id) {
      const prevIndex = enabledLinks.findIndex((link) => link.id === active.id);
      const newIndex = enabledLinks.findIndex((link) => link.id === over.id);
      const order = arrayMove(enabledLinks, prevIndex, newIndex);
      const uniqueOrder = ensureUniqueIds(order);

      setEnabledLinks(uniqueOrder);

      const disabledLinks: SocialNetwork[] = ensureUniqueIds(
        JSON.parse(data.links).filter((item: SocialNetwork) => !item.enabled),
      );
      const links = uniqueOrder.concat(disabledLinks);

      queryClient.setQueryData(["user"], (prevData: User) => ({
        ...prevData,
        links: JSON.stringify(links),
      }));
    }

    console.log("Enabled Links after drag:", enabledLinks);
  };

  return (
    <>
      <div className="min-h-screen py-10 bg-gray-100">
        <main className="max-w-5xl p-10 mx-auto md:p-0">
          <NavigationTabs />

          <div className="flex justify-end">
            <Link
              className="text-2xl font-bold text-right text-slate-800"
              to={`/${data.handle}`}
              target="_blank"
              rel="noreferrer noopener"
            >
              Visitar Mi Perfil: /{data.handle}
            </Link>
          </div>

          <div className="flex flex-col gap-10 mt-10 md:flex-row">
            <div className="flex-1 ">
              <Outlet />
            </div>
            <div className="w-full px-5 py-10 space-y-6 md:w-96 bg-slate-800">
              <p className="text-4xl text-center text-white">{data.handle}</p>

              {data.image && (
                <img
                  src={data.image}
                  alt="Imagen Perfil"
                  className="mx-auto max-w-[250px]"
                />
              )}

              <p className="text-lg font-black text-center text-white">
                {data.description}
              </p>

              <DndContext
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <div className="flex flex-col gap-5 mt-20">
                  <SortableContext
                    items={enabledLinks}
                    strategy={verticalListSortingStrategy}
                  >
                    {enabledLinks.map((link) => (
                      <DevTreeLink key={link.id} link={link} />
                    ))}
                  </SortableContext>
                </div>
              </DndContext>
            </div>
          </div>
        </main>
      </div>
      <Toaster position="top-right" />
    </>
  );
}
