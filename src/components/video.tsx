import { cdnUrl } from "@/lib/cdn";

type VideoProps = {
  src: string;
  poster?: string;
  caption?: string;
};

export function Video({ src, poster, caption }: VideoProps) {
  return (
    <figure className="my-8">
      <video
        controls
        preload="metadata"
        poster={poster ? cdnUrl(poster) : undefined}
        className="w-full rounded-lg"
      >
        <source src={cdnUrl(src)} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-slate-600">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
