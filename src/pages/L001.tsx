import { Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import Button from "@mui/material/Button";

export function L001() {
  const [reloadCount, setReloadCount] = useState(0);
  const canvasRef = useRef<HTMLDivElement>(null);
  // React 18 で StricMode の場合 useEffect が 2回実行されてしまうのでその対応
  const didEffect = useRef(false);
  useEffect(() => {
    if (didEffect.current) return;
    if (canvasRef.current) {
      canvasRef.current.innerHTML = "";
    }
    didEffect.current = true;
    const svg = d3
      .select(".canvas")
      .append("svg")
      .attr("width", 500)
      .attr("height", 500);

    svg
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", "blue");

    svg
      .selectAll("rect")
      .attr("width", 0)
      .transition()
      .delay(1000)
      .duration(3000)
      .ease(d3.easeLinear)
      .attr("width", 200);
  }, [reloadCount]);
  return (
    <div className="page-root">
      <div className="canvas" ref={canvasRef} />
      <div className="control">
        <Button
          onClick={() => {
            didEffect.current = false;
            setReloadCount(reloadCount + 1);
          }}
        >
          reload {reloadCount}
        </Button>
      </div>
    </div>
  );
}
