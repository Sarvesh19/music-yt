interface Props {
  title: string;
  subtitle?: string;
  gradient?: string;
}

export default function PageHeader({
  title,
  subtitle,
  gradient = "from-green-900/60 via-emerald-900/30 to-neutral-900",
}: Props) {
  return (
    <div
      className={`bg-gradient-to-b ${gradient} px-3 sm:px-6 pt-8 sm:pt-12 pb-4 sm:pb-6 -mx-3 sm:-mx-6 -mt-3 sm:-mt-6 mb-4 sm:mb-6`}
    >
      <h1 className="text-xl sm:text-3xl font-bold text-white tracking-tight">
        {title}
      </h1>
      {subtitle && (
        <p className="text-xs sm:text-sm text-neutral-400 mt-0.5 sm:mt-1">
          {subtitle}
        </p>
      )}
    </div>
  );
}
