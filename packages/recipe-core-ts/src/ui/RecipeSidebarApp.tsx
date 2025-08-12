import { useEffect, useMemo, useState } from "preact/hooks";
import type { Ingredient, Recipe } from "../index";
import { getIframeContainerStyles, getMobileContainerStyles, injectStyles } from "./styles";

function clampToPeople(n: number): number {
  return Math.max(1, Math.round(n));
}


export function RecipeSidebarApp({
  initialRecipe,
  isMobile = false,
}: {
  initialRecipe: Recipe;
  isMobile?: boolean;
}) {
  // Inject component (content) styles once mounted
  useEffect(() => {
    const STYLE_ID = "recipe-sidebar-app-styles";
    const styles = isMobile ? getMobileContainerStyles() : getIframeContainerStyles();
    injectStyles(STYLE_ID, styles);
  }, [isMobile]);
  const yieldParsed = useMemo(() => initialRecipe.yield, [initialRecipe]);
  const yieldText = useMemo(() => initialRecipe.formatYield(), [initialRecipe]);

  const isInteractiveRange = Boolean(
    (yieldParsed.quantityRange || yieldParsed.quantity != null) &&
    (yieldParsed.unit === "cup" || yieldParsed.unit === "serving")
  );
  const isRange = Boolean(yieldParsed.quantityRange);

  const [minVal, setMinVal] = useState<number>(() => {
    if (!isInteractiveRange) return 1;
    if (yieldParsed.quantityRange) return Math.round(yieldParsed.quantityRange.min);
    if (yieldParsed.quantity != null) return Math.round(yieldParsed.quantity);
    return 1;
  });
  const [maxVal, setMaxVal] = useState<number>(() => {
    if (!isInteractiveRange) return 1;
    if (yieldParsed.quantityRange) return Math.round(yieldParsed.quantityRange.max);
    if (yieldParsed.quantity != null) return Math.round(yieldParsed.quantity);
    return 1;
  });

  const displayedRecipe = useMemo(() => {
    if (!isInteractiveRange) return initialRecipe;
    const min = clampToPeople(minVal);
    const max = clampToPeople(maxVal);
    const mid = (min + max) / 2;
    const base = Math.round(initialRecipe.baseServings ?? 2);
    const factorServings = Math.max(1, Math.round(base * (mid / base)));
    return initialRecipe.scale(factorServings);
  }, [initialRecipe, isInteractiveRange, minVal, maxVal]);

  return (
    <>
      <div class="rb-body">
        {displayedRecipe.imageUrl && (
          <div class="rb-header-image">
            <img class="rb-image" src={displayedRecipe.imageUrl} />
            <div class="rb-title-overlay">
              <h1 class="rb-name">{displayedRecipe.name || "レシピ"}</h1>
            </div>
          </div>
        )}
        {!displayedRecipe.imageUrl && (
          <div class="rb-name">{displayedRecipe.name || "レシピ"}</div>
        )}

        <div class="rb-section-header">
          <div class="rb-section-title">材料</div>
          {yieldText && (
            <div class="rb-yield">
              {!isInteractiveRange ? (
                <span>{yieldText}</span>
              ) : (
                <span class="rb-yield-inline">
                  <button
                    class="rb-btn rb-btn-round"
                    onClick={() => {
                      setMinVal((v) => clampToPeople(v - 1));
                      setMaxVal((v) => clampToPeople(v - 1));
                    }}
                  >
                    −
                  </button>
                  <span class="rb-yield-display">
                    {yieldParsed.prefix && <span>{yieldParsed.prefix}</span>}
                    <input
                      class="rb-num"
                      type="number"
                      value={String(minVal)}
                      onInput={(e) => {
                        const v = clampToPeople(
                          parseFloat((e.target as HTMLInputElement).value) || minVal
                        );
                        setMinVal(v);
                        if (!isRange) setMaxVal(v);
                      }}
                    />
                    {isRange && <span>〜</span>}
                    {isRange && (
                      <input
                        class="rb-num"
                        type="number"
                        value={String(maxVal)}
                        onInput={(e) =>
                          setMaxVal(
                            clampToPeople(
                              parseFloat((e.target as HTMLInputElement).value) || maxVal
                            )
                          )
                        }
                      />
                    )}
                    {yieldParsed.unitText && <span>{yieldParsed.unitText}</span>}
                    {yieldParsed.suffix && <span>{yieldParsed.suffix}</span>}
                  </span>
                  <button
                    class="rb-btn rb-btn-round"
                    onClick={() => {
                      setMinVal((v) => clampToPeople(v + 1));
                      setMaxVal((v) => clampToPeople(v + 1));
                    }}
                  >
                    +
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
        <ul class="rb-list">
          {displayedRecipe.ingredients.map((ing: Ingredient) => (
            <li>
              <span>{ing.name || ing.originalText}</span>
              <span class="rb-qty">{ing.format() || ""}</span>
            </li>
          ))}
        </ul>

        <div class="rb-section-header">
          <div class="rb-section-title">作り方</div>
        </div>
        <ol class="rb-steps">
          {displayedRecipe.instructions.map((step, index) => (
            <li>
              <div class="rb-step-content">
                <div class="rb-step-text">{step.text}</div>
                {step.imageUrl && (
                  <div class="rb-step-image">
                    <img src={step.imageUrl} alt={`手順${index + 1}`} />
                  </div>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}


