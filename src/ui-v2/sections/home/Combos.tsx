import React, { useState } from "react";
import { IoAdd, IoBagAddOutline } from "react-icons/io5";
import { useCombos, type Combo } from "../../hooks/useHomeData";
import { Badge, Button, Container, Img, Section, SectionHeader } from "../../primitives";
import { inr } from "../../lib/format";

/** v1: ComboDeals. Hidden when the API returns no combos. */
const Combos: React.FC = () => {
  const { combos, loading, addCombo } = useCombos();
  if (loading || combos.length === 0) return null;

  return (
    <Section className="bg-v2-lilac/60">
      <Container>
        <SectionHeader eyebrow="Better together" title="Bundles that save you more" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {combos.map((c) => (
            <ComboCard key={c._id} combo={c} onAdd={addCombo} />
          ))}
        </div>
      </Container>
    </Section>
  );
};

const ComboCard: React.FC<{ combo: Combo; onAdd: (c: Combo) => Promise<void> }> = ({ combo, onAdd }) => {
  const [busy, setBusy] = useState(false);
  const shown = combo.products.slice(0, 3);
  return (
    <article className="flex flex-col rounded-v2-lg bg-v2-surface p-5 shadow-v2-sm">
      <div className="flex items-center gap-2">
        {shown.map((p, n) => (
          <React.Fragment key={p._id}>
            {n > 0 && <IoAdd className="shrink-0 text-v2-muted" />}
            <Img src={p.productImage} alt={p.name} frameClassName="aspect-square flex-1 rounded-v2" />
          </React.Fragment>
        ))}
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-[18px]">{combo.name}</h3>
          {combo.description && <p className="mt-1 line-clamp-2 text-[13.5px] text-v2-muted">{combo.description}</p>}
        </div>
        {combo.savingsPercent > 0 && <Badge tone="coral">Save {combo.savingsPercent}%</Badge>}
      </div>
      <div className="mt-auto flex items-end justify-between gap-3 pt-5">
        <div>
          <span className="font-v2-display text-[22px] font-semibold">{inr(combo.comboPrice)}</span>
          {combo.originalTotal > combo.comboPrice && (
            <span className="ml-2 text-[13px] text-v2-muted line-through">{inr(combo.originalTotal)}</span>
          )}
        </div>
        <Button
          size="sm"
          loading={busy}
          onClick={async () => {
            setBusy(true);
            try {
              await onAdd(combo);
            } finally {
              setBusy(false);
            }
          }}
        >
          <IoBagAddOutline /> Add bundle
        </Button>
      </div>
    </article>
  );
};

export default Combos;
