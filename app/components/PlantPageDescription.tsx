import {Heart, Share} from 'lucide-react';
import {Button} from './ui/button';

export function PlantPageDescription({
  productTitle,
  modifiedProductDescription,
}: PlantPageDescriptionProps) {
  return (
    <div className="col-span-1">
      <div className="flex justify-end">
        <Button size="sm" className="mr-3">
          <Heart />
        </Button>
        <Button size="sm">
          <Share />
        </Button>
      </div>
      <h1 className="text-3xl mb-5 mt-3 font-medium leading-tight max-w-[30ch] text-balance text-[var(--color-fg-green)]">
        {productTitle}
      </h1>
      <div className="lg:sticky lg:top-[64px] lg:self-start rounded-md bg-[var(--color-bg-3)] prose prose-p:text-[var(--color-fg-text)] prose-p:text-sm text-base prose-strong:text-[var(--color-fg-green)]">
        <div
          className="prose p-10"
          id="plant-description"
          dangerouslySetInnerHTML={{__html: modifiedProductDescription}}
        ></div>
      </div>
    </div>
  );
}
