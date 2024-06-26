"use client";

import { useEditAbout } from "@/features/about/use-edit-about";
import { InsertAboutValues } from "@/server/drizzle/schema";
import { TAboutWithAchievements } from "@/types/about-type";
import { DescriptionForm } from "./description-form";
import { YoutubeUrlForm } from "./youtube-url-form";
import { VisionForm } from "./vision-form";
import { MissionForm } from "./mission-form";
import { Achievements } from "./achivements";
import { useGetQuery } from "@/hooks/use-get-query";
import { getAbout } from "@/server/data/about";
import { Skeleton } from "../ui/skeleton";

const About = () => {
  const { statusEditProduct, executeEditProduct } = useEditAbout();

  const { data, isLoading } = useGetQuery({
    queryKey: "about",
    queryFn: async (): Promise<TAboutWithAchievements[]> => {
      const about = await getAbout();

      return about;
    },
  });

  const onSubmitDescription = async (
    values: InsertAboutValues["description"],
  ) => {
    executeEditProduct({
      description: values,
      id: data?.[0]?.id,
      youtubeUrl: data?.[0]?.youtubeUrl,
      vision: data?.[0]?.vision,
      mission: data?.[0]?.mission,
    });
  };

  const onSubmitYoutubeUrl = async (
    values: InsertAboutValues["youtubeUrl"],
  ) => {
    executeEditProduct({
      description: data?.[0]?.description,
      id: data?.[0]?.id,
      youtubeUrl: values,
      vision: data?.[0]?.vision,
      mission: data?.[0]?.mission,
    });
  };

  const onSubmitVision = async (values: InsertAboutValues["vision"]) => {
    executeEditProduct({
      description: data?.[0]?.description,
      id: data?.[0]?.id,
      youtubeUrl: data?.[0]?.youtubeUrl,
      vision: values,
      mission: data?.[0]?.mission,
    });
  };

  const onSubmitMission = async (values: InsertAboutValues["mission"]) => {
    executeEditProduct({
      description: data?.[0]?.description,
      id: data?.[0]?.id,
      youtubeUrl: data?.[0]?.youtubeUrl,
      vision: data?.[0]?.vision,
      mission: values,
    });
  };

  if (isLoading) {
    return (
      <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2">
        <div className="w-full">
          <Skeleton className="h-24 md:h-48" />
        </div>
        <div className="w-full">
          <Skeleton className="h-24 md:h-48" />
        </div>
        <div className="w-full">
          <Skeleton className="h-24 md:h-48" />
        </div>
        <div className="w-full">
          <Skeleton className="h-24 md:h-48" />
        </div>
      </div>
    );
  }

  return (
    <>
      {data &&
        data.map((about: TAboutWithAchievements) => (
          <div key={about.id}>
            <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-12">
              <div className="h-max space-y-3 md:col-span-6">
                <DescriptionForm
                  initialData={about.description}
                  onSubmit={onSubmitDescription}
                  loadingEditDescription={statusEditProduct === "executing"}
                />
                <VisionForm
                  initialData={about.vision}
                  onSubmit={onSubmitVision}
                  loadingEditVision={statusEditProduct === "executing"}
                />
              </div>
              <div className="h-max space-y-3 md:col-span-6">
                <YoutubeUrlForm
                  initialData={about.youtubeUrl}
                  onSubmit={onSubmitYoutubeUrl}
                  loadingEditYoutubeUrl={statusEditProduct === "executing"}
                />
                <MissionForm
                  initialData={about.mission}
                  onSubmit={onSubmitMission}
                  loadingEditMission={statusEditProduct === "executing"}
                />
              </div>
            </div>
            <div className="mt-3 grid w-full grid-cols-1 gap-3 md:grid-cols-3">
              <Achievements data={about.aboutAchievements} aboutId={about.id} />
            </div>
          </div>
        ))}
    </>
  );
};

export default About;
