type PageDescriptionProps = {
  title: string,
  subtitle?: string;
};

export function PageTitle({ title, subtitle }: PageDescriptionProps) {
  return (
    <div className="flex flex-col gap-0.5">
      <h1 className="text-2xl font-bold">
        {title}
      </h1>

      {subtitle && (
        <p className="text-muted-foreground text-sm">
          {subtitle}
        </p>
      )}
    </div>
  )
}