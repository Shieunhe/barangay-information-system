export function PageIntro({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-semibold tracking-tight text-brgy-navy lg:text-3xl">{title}</h1>
      <p className="mt-2 max-w-2xl text-base text-brgy-muted">{description}</p>
    </div>
  );
}
