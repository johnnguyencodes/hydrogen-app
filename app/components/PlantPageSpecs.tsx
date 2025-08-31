import {
  BadgeDollarSign,
  ExternalLink,
  Leaf,
  Pipette,
  Ruler,
  ScissorsLineDashed,
  Shovel,
  Sprout,
} from 'lucide-react';

export function PlantPageSpecs({
  productTitle,
  llifleDatabaseLink,
  parsedAcquisition,
  datePlantAcquired,
  parsedMeasurement,
  dateMeasurementTaken,
  wateringFrequency,
}: PlantPageSpecsProps) {
  return (
    <div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
        <div className="cols-span-1 flex flex-col justify-center">
          <h2 className="text-balance text-5xl font-medium text-[var(--color-fg-green)]">
            {productTitle}
          </h2>
          {llifleDatabaseLink && (
            <a
              href={llifleDatabaseLink}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-3 flex items-center text-[var(--color-fg-text)] hover:text-[var(--color-fg-text-hover)]"
            >
              <span className="inline-flex items-center border-b border-transparent hover:border-current text-sm">
                View species info on LLIFLE
                <ExternalLink size="16" className="ml-1" />
              </span>
            </a>
          )}
        </div>
        {parsedAcquisition && (
          <div className="col-span-1 rounded-md bg-[var(--color-bg-1)] flex flex-col items-center p-5">
            {parsedAcquisition?.method && (
              <div className="flex flex-col items-center justify-center">
                <div className="rounded-4xl bg-[var(--color-bg-green)] p-1 text-[var(--color-fg-text)] border-[1.5px] border-[var(--color-fg-text)]">
                  {parsedAcquisition?.method === 'Seed Grown' ? (
                    <Sprout size={36} />
                  ) : parsedAcquisition?.method === 'Purchased from' ? (
                    <BadgeDollarSign size={36} />
                  ) : parsedAcquisition?.method === 'Cutting' ? (
                    <ScissorsLineDashed size={36} />
                  ) : null}
                </div>
                {parsedAcquisition?.method.length > 0 && (
                  <p className="font-bold text-[var(--color-fg-green)] mt-1 text-sm">
                    {parsedAcquisition.method}
                  </p>
                )}
                {parsedAcquisition?.pText.length > 0 && (
                  <p className="text-[var(--color-fg-text)] text-sm">
                    {parsedAcquisition.pText}
                  </p>
                )}
                {parsedAcquisition?.aHref.length > 0 && (
                  <a
                    href={parsedAcquisition.aHref}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex items-center text-[var(--color-fg-text)] hover:text-[var(--color-fg-text-hover)]"
                  >
                    <span className="inline-flex items-center border-b border-transparent hover:border-current text-sm">
                      {parsedAcquisition.aText}
                      <ExternalLink size="16" className="ml-1" />
                    </span>
                  </a>
                )}
                {parsedAcquisition?.date.length > 0 && (
                  <p className="text-[var(--color-fg-text)] text-sm">
                    {datePlantAcquired}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
        {parsedMeasurement && (
          <div className="col-span-1 rounded-md bg-[var(--color-bg-2)] p-5">
            <div className="flex flex-col items-center justify-center">
              <div className="rounded-4xl bg-[var(--color-bg-green)] p-[5px] text-[var(--color-fg-text)] border-[1.5px] border-[var(--color-fg-text)]">
                <Ruler size={34} />
              </div>
              <p className="font-bold text-[var(--color-fg-green)] mt-1 text-sm">
                Measurements
              </p>
              <p className="text-[var(--color-fg-text)] text-sm">
                {parsedMeasurement[0].height} tall x{' '}
                {parsedMeasurement[0].width} wide,
              </p>
              <p className="text-[var(--color-fg-text)] text-sm">
                in a {parsedMeasurement[0].pot}
              </p>
              <p className="text-[var(--color-fg-text)] text-sm">
                {dateMeasurementTaken}
              </p>
            </div>
          </div>
        )}
        <div className="col-span-1 rounded-md bg-[var(--color-bg-3)] p-5">
          <div className="flex flex-col items-center justify-center">
            <div className="relative rounded-4xl bg-[var(--color-bg-green)] p-[7px] text-[var(--color-fg-text)] border-[1.5px] border-[var(--color-fg-text)]">
              <Shovel
                className="relative left-[1.25px] bottom-[1.25px]"
                size={30}
              />
            </div>
            <p className="font-bold text-[var(--color-fg-green)] mt-1 text-sm">
              Soil Mix
            </p>
            <ul className="text-[var(--color-fg-text)] text-center text-pretty text-sm">
              <li>8 parts pumice</li>
              <li>1 part calcinated clay</li>
              <li>1 part cactus soil</li>
            </ul>
            <p className="font-bold text-[var(--color-fg-green)] mt-3 text-sm">
              Top Dressing
            </p>
            <p className="text-[var(--color-fg-text)] text-sm">
              {' '}
              calcinated clay
            </p>
          </div>
        </div>
        <div className="col-span-1 rounded-md bg-[var(--color-bg-4)] p-5">
          <div className="flex flex-col items-center justify-center">
            <div className="relative rounded-4xl bg-[var(--color-bg-green)] p-[7px] text-[var(--color-fg-text)] border-[1.5px] border-[var(--color-fg-text)]">
              <Pipette
                className="relative left-[.25px] bottom-[.25px]"
                size={30}
              />
            </div>
            <p className="font-bold text-[var(--color-fg-green)] mt-1 text-sm">
              Fertilizer Regimen{' '}
            </p>
          </div>
          <p className="text-[var(--color-fg-text)] mb-3 text-center text-sm">
            Mix into 1 L reverse osmosis water:
          </p>

          <ul className="text-[var(--color-fg-text)] text-center text-pretty text-sm">
            <li>67 μL Schultz Cactus Plus (2–2–7)</li>
            <li>133 μL Grow More Cactus Juice (1–7–6)</li>
            <li>133 μL epsom salt stock solution (5 g/30 mL)</li>
            <li>30 mg chelated micronutrients</li>
          </ul>
        </div>
        <div className="col-span-1 rounded-md bg-[var(--color-bg-5)] p-5">
          <div className="flex flex-col items-center justify-center">
            <div className="relative rounded-4xl bg-[var(--color-bg-green)] p-[7px] text-[var(--color-fg-text)] border-[1.5px] border-[var(--color-fg-text)]">
              <Leaf
                className="relative left-[1.25px] bottom-[1.25px]"
                size={30}
              />
            </div>
            <p className="font-bold text-[var(--color-fg-green)] mt-1 text-sm">
              Care Regimen
            </p>
            <ul className="text-[var(--color-fg-text)] text-center text-pretty text-sm">
              <li>Grown indoors with 24/7 fan circulation</li>
              <li>15 hours of light daily under T5 6500K LEDs</li>
              <li>Deep watered every {wateringFrequency}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
