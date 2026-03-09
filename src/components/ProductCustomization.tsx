import { motion } from "framer-motion";
import { Scissors, Shirt } from "lucide-react";

export interface CustomizationOptions {
  clothType: "stitched" | "unstitched";
  collarType: "collar" | "cuff";
  buttonType: "simple" | "fancy";
  flareType: "circular" | "slit";
  pleatType: "single" | "double";
}

export const EXTRA_CHARGES = {
  fancyButtons: 300,
  doublePleat: 600,
};

export const getExtraCharges = (options: CustomizationOptions): number => {
  let extra = 0;
  if (options.buttonType === "fancy") extra += EXTRA_CHARGES.fancyButtons;
  if (options.pleatType === "double") extra += EXTRA_CHARGES.doublePleat;
  return extra;
};

export const getCustomizationLabel = (options: CustomizationOptions): string => {
  const parts = [
    options.clothType === "stitched" ? "Stitched" : "Unstitched",
    options.collarType === "collar" ? "Collar" : "Cuff (Ban)",
    options.buttonType === "fancy" ? "Fancy Buttons" : "Simple Buttons",
    options.flareType === "circular" ? "Circular Flare" : "Slit Flare",
    options.pleatType === "double" ? "Double Pleat" : "Single Pleat",
  ];
  return parts.join(" • ");
};

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

interface ProductCustomizationProps {
  options: CustomizationOptions;
  onChange: (options: CustomizationOptions) => void;
}

const ProductCustomization = ({ options, onChange }: ProductCustomizationProps) => {
  const update = (key: keyof CustomizationOptions, value: string) => {
    onChange({ ...options, [key]: value });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 mb-6"
    >
      <p className="text-xs font-body tracking-wider uppercase text-muted-foreground">Customization Options</p>

      {/* Cloth Type */}
      <div>
        <p className="text-xs font-body text-muted-foreground mb-2">Cloth Type</p>
        <div className="flex gap-2">
          <OptionButton
            selected={options.clothType === "stitched"}
            onClick={() => update("clothType", "stitched")}
            label="Stitched"
            sublabel="Custom tailored to your measurements"
          />
          <OptionButton
            selected={options.clothType === "unstitched"}
            onClick={() => update("clothType", "unstitched")}
            label="Unstitched"
            sublabel="Raw fabric, no stitching"
          />
        </div>
      </div>

      {/* Only show stitching options if stitched */}
      {options.clothType === "stitched" && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-4"
        >
          {/* Collar Type */}
          <div>
            <p className="text-xs font-body text-muted-foreground mb-2">Collar Style</p>
            <div className="flex gap-2">
              <OptionButton
                selected={options.collarType === "collar"}
                onClick={() => update("collarType", "collar")}
                label="Collar"
                sublabel="Classic collar neckline"
              />
              <OptionButton
                selected={options.collarType === "cuff"}
                onClick={() => update("collarType", "cuff")}
                label="Cuff (Ban)"
                sublabel="Band-style neckline"
              />
            </div>
          </div>

          {/* Button Type */}
          <div>
            <p className="text-xs font-body text-muted-foreground mb-2">Button Style</p>
            <div className="flex gap-2">
              <OptionButton
                selected={options.buttonType === "simple"}
                onClick={() => update("buttonType", "simple")}
                label="Simple Buttons"
                sublabel="Standard matching buttons"
              />
              <OptionButton
                selected={options.buttonType === "fancy"}
                onClick={() => update("buttonType", "fancy")}
                label="Fancy Buttons"
                sublabel="Premium decorative buttons"
                extra={`+PKR ${EXTRA_CHARGES.fancyButtons}`}
              />
            </div>
          </div>

          {/* Flare Type */}
          <div>
            <p className="text-xs font-body text-muted-foreground mb-2">Flare Style</p>
            <div className="flex gap-2">
              <OptionButton
                selected={options.flareType === "circular"}
                onClick={() => update("flareType", "circular")}
                label="Circular Flare"
                sublabel="Gool Ghaira"
              />
              <OptionButton
                selected={options.flareType === "slit"}
                onClick={() => update("flareType", "slit")}
                label="Slit Flare"
                sublabel="Chakor Ghaira"
              />
            </div>
          </div>

          {/* Pleat Type */}
          <div>
            <p className="text-xs font-body text-muted-foreground mb-2">Pleat Style</p>
            <div className="flex gap-2">
              <OptionButton
                selected={options.pleatType === "single"}
                onClick={() => update("pleatType", "single")}
                label="Single Pleat"
                sublabel="Single Slai"
              />
              <OptionButton
                selected={options.pleatType === "double"}
                onClick={() => update("pleatType", "double")}
                label="Double Pleat"
                sublabel="Double Slai"
                extra={`+PKR ${EXTRA_CHARGES.doublePleat}`}
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Extra charges summary */}
      {options.clothType === "stitched" && getExtraCharges(options) > 0 && (
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
          <div className="flex justify-between text-xs font-body">
            <span className="text-muted-foreground">Extra customization charges</span>
            <span className="text-primary font-semibold">+PKR {getExtraCharges(options).toLocaleString()}</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ProductCustomization;
