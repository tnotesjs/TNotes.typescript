import {
  getConfig2
} from "./chunk-ZXK4MBU4.js";
import {
  __name
} from "./chunk-EFFMIOS3.js";
import {
  select_default
} from "./chunk-QAFMDVE3.js";

// node_modules/.pnpm/mermaid@11.11.0/node_modules/mermaid/dist/chunks/mermaid.core/chunk-EXTU4WIE.mjs
var selectSvgElement = __name((id) => {
  var _a;
  const { securityLevel } = getConfig2();
  let root = select_default("body");
  if (securityLevel === "sandbox") {
    const sandboxElement = select_default(`#i${id}`);
    const doc = ((_a = sandboxElement.node()) == null ? void 0 : _a.contentDocument) ?? document;
    root = select_default(doc.body);
  }
  const svg = root.select(`#${id}`);
  return svg;
}, "selectSvgElement");

export {
  selectSvgElement
};
//# sourceMappingURL=chunk-T3F7R44V.js.map
