import { motion } from "framer-motion";

// ─── Types ─────────────────────────────────────────────────────────────────

export type Category = "shalwar-kameez" | "waistcoats" | "3-piece" | "trousers";

// Shalwar Kameez options
export interface ShalwarKameezOptions {
  clothType: "stitched" | "unstitched";
  collarType: "collar" | "cuff";
  buttonType: "simple" | "fancy";
  flareType: "circular" | "slit";
  pleatType: "single" | "double";
}

// Waistcoat options
export interface WaistcoatOptions {
  clothType: "stitched" | "unstitched";
  collarType: "collar" | "cuff";
  buttonType: "simple" | "fancy";
  flareType: "circular" | "slit";
  pleatType: "single" | "double";
}

// 3-Piece Suit options
export interface ThreePieceOptions {
  clothType: "stitched" | "unstitched";
  fitStyle: "slim" | "regular" | "relaxed";
  lapelStyle: "notch" | "peak" | "shawl";
  breasting: "single" | "double";
  jacketPocket: "flap" | "welt" | "patch";
  troUserCut: "straight" | "tapered" | "wide";
  troUserPleat: "flat" | "single" | "double";
  cuffStyle: "button" | "turnback";
}

// Trousers & Shirts options
export interface TrousersOptions {
  clothType: "stitched" | "unstitched";
  // Shirt options
  shirtCollar: "point" | "spread" | "button-down" | "mandarin";
  shirtCuff: "single" | "double" | "convertible";
  shirtFit: "slim" | "regular" | "relaxed";
  shirtFront: "plain" | "tucked-pleat" | "pintuck";
  // Trouser options
  trouserCut: "straight" | "tapered" | "wide";
  trouserPleat: "flat" | "single" | "double";
  trouserWaist: "plain" | "belt-loop" | "elastic";
  trouserBottom: "plain" | "cuffed";
}

export type CustomizationOptions =
  | ShalwarKameezOptions
  | WaistcoatOptions
  | ThreePieceOptions
  | TrousersOptions;

// ─── Extra Charges ──────────────────────────────────────────────────────────

export const EXTRA_CHARGES = {
  fancyButtons: 300,
  doublePleat: 600,
  doubleTrouserPleat: 600,
  doubleSuitPleat: 600,
  doubleCuff: 500,
  peakLapel: 500,
  doubleBreasted: 800,
  turnbackCuff: 400,
};

export const getExtraCharges = (options: CustomizationOptions, category: Category): number => {
  let extra = 0;

  if (category === "shalwar-kameez" || category === "waistcoats") {
    const o = options as ShalwarKameezOptions;
    if (o.buttonType === "fancy") extra += EXTRA_CHARGES.fancyButtons;
    if (o.pleatType === "double") extra += EXTRA_CHARGES.doublePleat;
  }

  if (category === "3-piece") {
    const o = options as ThreePieceOptions;
    if (o.lapelStyle === "peak") extra += EXTRA_CHARGES.peakLapel;
    if (o.breasting === "double") extra += EXTRA_CHARGES.doubleBreasted;
    if (o.troUserPleat === "double") extra += EXTRA_CHARGES.doubleSuitPleat;
    if (o.cuffStyle === "turnback") extra += EXTRA_CHARGES.turnbackCuff;
  }

  if (category === "trousers") {
    const o = options as TrousersOptions;
    if (o.shirtCuff === "double") extra += EXTRA_CHARGES.doubleCuff;
    if (o.trouserPleat === "double") extra += EXTRA_CHARGES.doubleTrouserPleat;
  }

  return extra;
};

export const getCustomizationLabel = (options: CustomizationOptions, category: Category): string => {
  if (category === "shalwar-kameez" || category === "waistcoats") {
    const o = options as ShalwarKameezOptions;
    if (o.clothType === "unstitched") return "Unstitched";
    return [
      "Stitched",
      o.collarType === "collar" ? "Collar" : "Cuff (Ban)",
      o.buttonType === "fancy" ? "Fancy Buttons" : "Simple Buttons",
      o.flareType === "circular" ? "Circular Flare" : "Slit Flare",
      o.pleatType === "double" ? "Double Pleat" : "Single Pleat",
    ].join(" • ");
  }

  if (category === "3-piece") {
    const o = options as ThreePieceOptions;
    if (o.clothType === "unstitched") return "Unstitched";
    return [
      "Stitched",
      o.fitStyle === "slim" ? "Slim Fit" : o.fitStyle === "regular" ? "Regular Fit" : "Relaxed Fit",
      o.lapelStyle === "notch" ? "Notch Lapel" : o.lapelStyle === "peak" ? "Peak Lapel" : "Shawl Lapel",
      o.breasting === "single" ? "Single Breasted" : "Double Breasted",
    ].join(" • ");
  }

  if (category === "trousers") {
    const o = options as TrousersOptions;
    if (o.clothType === "unstitched") return "Unstitched";
    return [
      "Stitched",
      o.shirtFit === "slim" ? "Slim Fit" : o.shirtFit === "regular" ? "Regular Fit" : "Relaxed Fit",
      o.shirtCollar === "point" ? "Point Collar" : o.shirtCollar === "spread" ? "Spread Collar" : o.shirtCollar === "button-down" ? "Button-Down" : "Mandarin Collar",
      o.trouserCut === "straight" ? "Straight Cut" : o.trouserCut === "tapered" ? "Tapered" : "Wide Leg",
    ].join(" • ");
  }

  return "Custom";
};

// ─── Default Options by Category ────────────────────────────────────────────

export const getDefaultOptions = (category: Category): CustomizationOptions => {
  if (category === "waistcoats") {
    return {
      clothType: "stitched",
      collarType: "cuff",
      buttonType: "fancy",
      flareType: "slit",
      pleatType: "single",
    } as WaistcoatOptions;
  }

  if (category === "shalwar-kameez") {
    return {
      clothType: "stitched",
      collarType: "collar",
      buttonType: "simple",
      flareType: "circular",
      pleatType: "single",
    } as ShalwarKameezOptions;
  }

  if (category === "3-piece") {
    return {
      clothType: "stitched",
      fitStyle: "slim",
      lapelStyle: "notch",
      breasting: "single",
      jacketPocket: "flap",
      troUserCut: "straight",
      troUserPleat: "flat",
      cuffStyle: "button",
    } as ThreePieceOptions;
  }

  // trousers
  return {
    clothType: "stitched",
    shirtCollar: "point",
    shirtCuff: "single",
    shirtFit: "slim",
    shirtFront: "plain",
    trouserCut: "straight",
    trouserPleat: "flat",
    trouserWaist: "belt-loop",
    trouserBottom: "plain",
  } as TrousersOptions;
};

// ─── UI Components ───────────────────────────────────────────────────────────

interface OptionButtonProps {
  selected: boolean;
  onClick: () => void;
  label: string;
  sublabel?: string;
  extra?: string;
}

const OptionButton = ({ selected, onClick, label, sublabel, extra }: OptionButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex-1 p-3 rounded-lg border text-left transition-all duration-300 ${
      selected
        ? "bg-primary/10 border-primary shadow-[0_0_12px_hsl(var(--primary)/0.15)]"
        : "border-border hover:border-primary/30"
    }`}
  >
    <p className="font-body text-xs font-semibold">{label}</p>
    {sublabel && <p className="text-[10px] text-muted-foreground font-body">{sublabel}</p>}
    {extra && <p className="text-[10px] text-primary font-body font-semibold mt-0.5">{extra}</p>}
  </button>
);

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section = ({ title, children }: SectionProps) => (
  <div>
    <p className="text-xs font-body text-muted-foreground mb-2">{title}</p>
    <div className="flex gap-2 flex-wrap">{children}</div>
  </div>
);

// ─── Category-Specific Panels ─────────────────────────────────────────────────

const ShalwarKameezPanel = ({
  options,
  update,
}: {
  options: ShalwarKameezOptions;
  update: (key: keyof ShalwarKameezOptions, value: string) => void;
}) => (
  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-4">
    <Section title="Collar Style">
      <OptionButton selected={options.collarType === "collar"} onClick={() => update("collarType", "collar")} label="Collar" sublabel="Classic collar neckline" />
      <OptionButton selected={options.collarType === "cuff"} onClick={() => update("collarType", "cuff")} label="Cuff (Ban)" sublabel="Band-style neckline" />
    </Section>
    <Section title="Button Style">
      <OptionButton selected={options.buttonType === "simple"} onClick={() => update("buttonType", "simple")} label="Simple Buttons" sublabel="Standard matching buttons" />
      <OptionButton selected={options.buttonType === "fancy"} onClick={() => update("buttonType", "fancy")} label="Fancy Buttons" sublabel="Premium decorative buttons" extra={`+PKR ${EXTRA_CHARGES.fancyButtons}`} />
    </Section>
    <Section title="Flare Style">
      <OptionButton selected={options.flareType === "circular"} onClick={() => update("flareType", "circular")} label="Circular Flare" sublabel="Gool Ghaira" />
      <OptionButton selected={options.flareType === "slit"} onClick={() => update("flareType", "slit")} label="Slit Flare" sublabel="Chakor Ghaira" />
    </Section>
    <Section title="Pleat Style">
      <OptionButton selected={options.pleatType === "single"} onClick={() => update("pleatType", "single")} label="Single Pleat" sublabel="Single Slai" />
      <OptionButton selected={options.pleatType === "double"} onClick={() => update("pleatType", "double")} label="Double Pleat" sublabel="Double Slai" extra={`+PKR ${EXTRA_CHARGES.doublePleat}`} />
    </Section>
  </motion.div>
);

const ThreePiecePanel = ({
  options,
  update,
}: {
  options: ThreePieceOptions;
  update: (key: keyof ThreePieceOptions, value: string) => void;
}) => (
  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-4">
    {/* Fit Style */}
    <Section title="Fit Style">
      <OptionButton selected={options.fitStyle === "slim"} onClick={() => update("fitStyle", "slim")} label="Slim Fit" sublabel="Modern tapered silhouette" />
      <OptionButton selected={options.fitStyle === "regular"} onClick={() => update("fitStyle", "regular")} label="Regular Fit" sublabel="Classic comfortable cut" />
      <OptionButton selected={options.fitStyle === "relaxed"} onClick={() => update("fitStyle", "relaxed")} label="Relaxed Fit" sublabel="Loose, ease of movement" />
    </Section>

    {/* Lapel Style */}
    <Section title="Lapel Style">
      <OptionButton selected={options.lapelStyle === "notch"} onClick={() => update("lapelStyle", "notch")} label="Notch Lapel" sublabel="Classic business look" />
      <OptionButton selected={options.lapelStyle === "peak"} onClick={() => update("lapelStyle", "peak")} label="Peak Lapel" sublabel="Formal & sharp" extra={`+PKR ${EXTRA_CHARGES.peakLapel}`} />
      <OptionButton selected={options.lapelStyle === "shawl"} onClick={() => update("lapelStyle", "shawl")} label="Shawl Lapel" sublabel="Elegant tuxedo style" />
    </Section>

    {/* Breasting */}
    <Section title="Jacket Style">
      <OptionButton selected={options.breasting === "single"} onClick={() => update("breasting", "single")} label="Single Breasted" sublabel="1–2 button front, versatile" />
      <OptionButton selected={options.breasting === "double"} onClick={() => update("breasting", "double")} label="Double Breasted" sublabel="6-button, bold & classic" extra={`+PKR ${EXTRA_CHARGES.doubleBreasted}`} />
    </Section>

    {/* Jacket Pocket */}
    <Section title="Jacket Pocket">
      <OptionButton selected={options.jacketPocket === "flap"} onClick={() => update("jacketPocket", "flap")} label="Flap Pockets" sublabel="Traditional covered pockets" />
      <OptionButton selected={options.jacketPocket === "welt"} onClick={() => update("jacketPocket", "welt")} label="Welt Pockets" sublabel="Sleek formal style" />
      <OptionButton selected={options.jacketPocket === "patch"} onClick={() => update("jacketPocket", "patch")} label="Patch Pockets" sublabel="Casual smart look" />
    </Section>

    {/* Sleeve Cuff */}
    <Section title="Sleeve Cuff">
      <OptionButton selected={options.cuffStyle === "button"} onClick={() => update("cuffStyle", "button")} label="Button Cuff" sublabel="Standard 3–4 buttons" />
      <OptionButton selected={options.cuffStyle === "turnback"} onClick={() => update("cuffStyle", "turnback")} label="Turnback Cuff" sublabel="Contrasting inner lining" extra={`+PKR ${EXTRA_CHARGES.turnbackCuff}`} />
    </Section>

    {/* Trouser Cut */}
    <Section title="Trouser Cut">
      <OptionButton selected={options.troUserCut === "straight"} onClick={() => update("troUserCut", "straight")} label="Straight Cut" sublabel="Even width, classic" />
      <OptionButton selected={options.troUserCut === "tapered"} onClick={() => update("troUserCut", "tapered")} label="Tapered" sublabel="Narrows at the ankle" />
      <OptionButton selected={options.troUserCut === "wide"} onClick={() => update("troUserCut", "wide")} label="Wide Leg" sublabel="Relaxed flowing look" />
    </Section>

    {/* Trouser Pleat */}
    <Section title="Trouser Pleat">
      <OptionButton selected={options.troUserPleat === "flat"} onClick={() => update("troUserPleat", "flat")} label="Flat Front" sublabel="Clean modern look" />
      <OptionButton selected={options.troUserPleat === "single"} onClick={() => update("troUserPleat", "single")} label="Single Pleat" sublabel="Single Slai" />
      <OptionButton selected={options.troUserPleat === "double"} onClick={() => update("troUserPleat", "double")} label="Double Pleat" sublabel="Double Slai" extra={`+PKR ${EXTRA_CHARGES.doubleSuitPleat}`} />
    </Section>
  </motion.div>
);

const TrousersPanel = ({
  options,
  update,
}: {
  options: TrousersOptions;
  update: (key: keyof TrousersOptions, value: string) => void;
}) => (
  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-4">
    {/* Shirt Section */}
    <p className="text-[10px] font-body tracking-widest uppercase text-primary font-semibold">— Shirt Options —</p>

    <Section title="Shirt Fit">
      <OptionButton selected={options.shirtFit === "slim"} onClick={() => update("shirtFit", "slim")} label="Slim Fit" sublabel="Close to body, modern" />
      <OptionButton selected={options.shirtFit === "regular"} onClick={() => update("shirtFit", "regular")} label="Regular Fit" sublabel="Classic comfortable cut" />
      <OptionButton selected={options.shirtFit === "relaxed"} onClick={() => update("shirtFit", "relaxed")} label="Relaxed Fit" sublabel="Loose & easy" />
    </Section>

    <Section title="Collar Style">
      <OptionButton selected={options.shirtCollar === "point"} onClick={() => update("shirtCollar", "point")} label="Point Collar" sublabel="Classic narrow spread" />
      <OptionButton selected={options.shirtCollar === "spread"} onClick={() => update("shirtCollar", "spread")} label="Spread Collar" sublabel="Wide modern look" />
      <OptionButton selected={options.shirtCollar === "button-down"} onClick={() => update("shirtCollar", "button-down")} label="Button-Down" sublabel="Casual smart" />
      <OptionButton selected={options.shirtCollar === "mandarin"} onClick={() => update("shirtCollar", "mandarin")} label="Mandarin" sublabel="Collarless band neck" />
    </Section>

    <Section title="Cuff Style">
      <OptionButton selected={options.shirtCuff === "single"} onClick={() => update("shirtCuff", "single")} label="Single Cuff" sublabel="Standard button cuff" />
      <OptionButton selected={options.shirtCuff === "double"} onClick={() => update("shirtCuff", "double")} label="Double Cuff" sublabel="French cuff, cufflinks" extra={`+PKR ${EXTRA_CHARGES.doubleCuff}`} />
      <OptionButton selected={options.shirtCuff === "convertible"} onClick={() => update("shirtCuff", "convertible")} label="Convertible" sublabel="Buttons or cufflinks" />
    </Section>

    <Section title="Shirt Front">
      <OptionButton selected={options.shirtFront === "plain"} onClick={() => update("shirtFront", "plain")} label="Plain Front" sublabel="Smooth & clean" />
      <OptionButton selected={options.shirtFront === "tucked-pleat"} onClick={() => update("shirtFront", "tucked-pleat")} label="Box Pleat" sublabel="Centre front pleat" />
      <OptionButton selected={options.shirtFront === "pintuck"} onClick={() => update("shirtFront", "pintuck")} label="Pintuck" sublabel="Fine tucks on chest" />
    </Section>

    {/* Trouser Section */}
    <p className="text-[10px] font-body tracking-widest uppercase text-primary font-semibold mt-2">— Trouser Options —</p>

    <Section title="Trouser Cut">
      <OptionButton selected={options.trouserCut === "straight"} onClick={() => update("trouserCut", "straight")} label="Straight Cut" sublabel="Even width, classic" />
      <OptionButton selected={options.trouserCut === "tapered"} onClick={() => update("trouserCut", "tapered")} label="Tapered" sublabel="Narrows at ankle" />
      <OptionButton selected={options.trouserCut === "wide"} onClick={() => update("trouserCut", "wide")} label="Wide Leg" sublabel="Relaxed flowing look" />
    </Section>

    <Section title="Trouser Pleat">
      <OptionButton selected={options.trouserPleat === "flat"} onClick={() => update("trouserPleat", "flat")} label="Flat Front" sublabel="Clean modern look" />
      <OptionButton selected={options.trouserPleat === "single"} onClick={() => update("trouserPleat", "single")} label="Single Pleat" sublabel="Single Slai" />
      <OptionButton selected={options.trouserPleat === "double"} onClick={() => update("trouserPleat", "double")} label="Double Pleat" sublabel="Double Slai" extra={`+PKR ${EXTRA_CHARGES.doubleTrouserPleat}`} />
    </Section>

    <Section title="Waistband">
      <OptionButton selected={options.trouserWaist === "belt-loop"} onClick={() => update("trouserWaist", "belt-loop")} label="Belt Loop" sublabel="Standard loops" />
      <OptionButton selected={options.trouserWaist === "elastic"} onClick={() => update("trouserWaist", "elastic")} label="Elastic Waist" sublabel="Comfortable stretch" />
      <OptionButton selected={options.trouserWaist === "plain"} onClick={() => update("trouserWaist", "plain")} label="Plain Waist" sublabel="No loops or elastic" />
    </Section>

    <Section title="Trouser Bottom">
      <OptionButton selected={options.trouserBottom === "plain"} onClick={() => update("trouserBottom", "plain")} label="Plain Hem" sublabel="Clean tapered finish" />
      <OptionButton selected={options.trouserBottom === "cuffed"} onClick={() => update("trouserBottom", "cuffed")} label="Cuffed Hem" sublabel="Folded turn-up at ankle" />
    </Section>
  </motion.div>
);

// ─── Main Component ──────────────────────────────────────────────────────────

interface ProductCustomizationProps {
  options: CustomizationOptions;
  onChange: (options: CustomizationOptions) => void;
  category: Category;
}

const ProductCustomization = ({ options, onChange, category }: ProductCustomizationProps) => {
  const isSKOrWC = category === "shalwar-kameez" || category === "waistcoats";
  const is3P = category === "3-piece";
  const isTR = category === "trousers";

  const clothType = (options as ShalwarKameezOptions | ThreePieceOptions | TrousersOptions).clothType;

  const updateSK = (key: keyof ShalwarKameezOptions, value: string) =>
    onChange({ ...(options as ShalwarKameezOptions), [key]: value });

  const update3P = (key: keyof ThreePieceOptions, value: string) =>
    onChange({ ...(options as ThreePieceOptions), [key]: value });

  const updateTR = (key: keyof TrousersOptions, value: string) =>
    onChange({ ...(options as TrousersOptions), [key]: value });

  const extraCharges = getExtraCharges(options, category);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 mb-6">
      <p className="text-xs font-body tracking-wider uppercase text-muted-foreground">Customization Options</p>

      {/* Cloth Type */}
      <div>
        <p className="text-xs font-body text-muted-foreground mb-2">Cloth Type</p>
        <div className="flex gap-2">
          <OptionButton
            selected={clothType === "stitched"}
            onClick={() => onChange({ ...options, clothType: "stitched" } as any)}
            label="Stitched"
            sublabel="Custom tailored to your measurements"
          />
          <OptionButton
            selected={clothType === "unstitched"}
            onClick={() => onChange({ ...options, clothType: "unstitched" } as any)}
            label="Unstitched"
            sublabel="Raw fabric, no stitching"
          />
        </div>
      </div>

      {/* Category-specific options — only shown for stitched */}
      {clothType === "stitched" && (
        <>
          {isSKOrWC && (
            <ShalwarKameezPanel options={options as ShalwarKameezOptions} update={updateSK} />
          )}
          {is3P && (
            <ThreePiecePanel options={options as ThreePieceOptions} update={update3P} />
          )}
          {isTR && (
            <TrousersPanel options={options as TrousersOptions} update={updateTR} />
          )}
        </>
      )}

      {/* Extra charges summary */}
      {clothType === "stitched" && extraCharges > 0 && (
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
          <div className="flex justify-between text-xs font-body">
            <span className="text-muted-foreground">Extra customization charges</span>
            <span className="text-primary font-semibold">+PKR {extraCharges.toLocaleString()}</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ProductCustomization;
