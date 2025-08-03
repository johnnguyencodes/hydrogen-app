export function PlantPageDescription({
  modifiedProductDescription,
}: PlantPageDescriptionProps) {
  return (
    <div className="lg:col-start-2 lg:row-start-2">
      <div className="rounded-md lg:bg-[var(--color-bg-3)] prose prose-p:text-[var(--color-fg-text)] prose-p:text-sm text-base prose-strong:text-[var(--color-fg-green)] lg:top-4 lg:sticky">
        <div
          className="prose lg:p-10"
          id="plant-description"
          dangerouslySetInnerHTML={{__html: modifiedProductDescription}}
        ></div>
      </div>
    </div>
  );
}
