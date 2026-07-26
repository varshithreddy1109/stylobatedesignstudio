const DEFAULT_VISION =
  "We want our work to still make sense in fifty years — chosen for how it sits on its site and ages with its materials, not for how it photographs today.";
const DEFAULT_MISSION =
  "Every brief starts with time spent on-site and with the client before design begins, so the final building reflects how people actually intend to live or work in it.";

interface VisionMissionProps {
  vision?: string;
  mission?: string;
}

export default function VisionMission({ vision, mission }: VisionMissionProps) {
  return (
    <section className="bg-ink py-20 text-paper md:py-28">
      <div className="container-studio grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-8">
        <div className="flex flex-col gap-5 border-t border-white/15 pt-8">
          <span className="label-tag text-brass-light">Vision</span>
          <h3 className="font-display text-2xl font-medium md:text-3xl">
            Buildings that outlast trend.
          </h3>
          <p className="text-sm leading-relaxed text-stone md:text-base">
            {vision || DEFAULT_VISION}
          </p>
        </div>
        <div className="flex flex-col gap-5 border-t border-white/15 pt-8">
          <span className="label-tag text-brass-light">Mission</span>
          <h3 className="font-display text-2xl font-medium md:text-3xl">
            Design led by listening.
          </h3>
          <p className="text-sm leading-relaxed text-stone md:text-base">
            {mission || DEFAULT_MISSION}
          </p>
        </div>
      </div>
    </section>
  );
}
