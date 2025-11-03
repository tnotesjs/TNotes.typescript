import {
  parse
} from "./chunk-IMXX4P7U.js";
import "./chunk-3E72UTQ5.js";
import "./chunk-ADE27HSI.js";
import "./chunk-Q5NDKBRU.js";
import "./chunk-MHQDOJXZ.js";
import "./chunk-NLMFQOLT.js";
import "./chunk-BCMAAY74.js";
import "./chunk-R52PX3HQ.js";
import "./chunk-T5H4PB2M.js";
import "./chunk-D6UTVHLJ.js";
import {
  package_default
} from "./chunk-3JMOGEMN.js";
import {
  selectSvgElement
} from "./chunk-T3F7R44V.js";
import {
  configureSvgSize
} from "./chunk-ZXK4MBU4.js";
import {
  __name,
  log
} from "./chunk-EFFMIOS3.js";
import "./chunk-MLGC5PPN.js";
import "./chunk-2LDH7PQA.js";
import "./chunk-QAFMDVE3.js";
import "./chunk-FDBJFBLO.js";

// node_modules/.pnpm/mermaid@11.11.0/node_modules/mermaid/dist/chunks/mermaid.core/infoDiagram-STP46IZ2.mjs
var parser = {
  parse: __name(async (input) => {
    const ast = await parse("info", input);
    log.debug(ast);
  }, "parse")
};
var DEFAULT_INFO_DB = {
  version: package_default.version + (true ? "" : "-tiny")
};
var getVersion = __name(() => DEFAULT_INFO_DB.version, "getVersion");
var db = {
  getVersion
};
var draw = __name((text, id, version) => {
  log.debug("rendering info diagram\n" + text);
  const svg = selectSvgElement(id);
  configureSvgSize(svg, 100, 400, true);
  const group = svg.append("g");
  group.append("text").attr("x", 100).attr("y", 40).attr("class", "version").attr("font-size", 32).style("text-anchor", "middle").text(`v${version}`);
}, "draw");
var renderer = { draw };
var diagram = {
  parser,
  db,
  renderer
};
export {
  diagram
};
//# sourceMappingURL=infoDiagram-STP46IZ2-XPIDTIF6.js.map
