import {Heart, Share} from 'lucide-react';
import {Button} from './ui/button';

export function PlantPageTitle({productTitle}: PlantPageTitleProps) {
  return (
    <div className="lg:col-start-2 lg:row-start-1">
      <div className="hidden justify-end">
        <Button size="sm" className="mr-3">
          <Heart />
        </Button>
        <Button size="sm">
          <Share />
        </Button>
      </div>
      <h1 className="text-3xl font-medium leading-tight max-w-[30ch] text-balance text-[var(--color-fg-green)]">
        {productTitle}
      </h1>
    </div>
  );
}
