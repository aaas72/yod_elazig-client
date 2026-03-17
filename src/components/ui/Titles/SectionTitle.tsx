interface SectionTitleProps {
  title: string;
  className?: string;
  center?: boolean;
}

export default function SectionTitle({
  title,
  className = "",
  center = false,
}: SectionTitleProps) {
  return (
    <h2
      className={`text-2xl md:text-3xl font-bold ${center ? "text-center" : ""} ${className}`}
    >
      {title}
    </h2>
  );
}
