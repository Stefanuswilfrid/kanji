import { BackRouteButton } from "@/components/route-button";
import { Layout } from "@/modules/layout/layout";
import { VideoIdContainer } from "@/modules/youtube/video-id-container";

export default function Youtube() {
    return (
      <Layout>
        <div>
          <main className="max-w-[1080px] mx-auto md:px-8">
            <div className="flex flex-col justify-end bg-black z-10 max-md:px-2 pb-2 border-b-[1.5px] border-b-subtle">
              <div className="w-fit">
                <BackRouteButton />
              </div>
            </div>
            <VideoIdContainer />

          </main>
        </div>
      </Layout>
    );
  }
  