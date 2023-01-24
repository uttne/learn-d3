import { useEffect, useRef, useState, useMemo } from "react";
import * as d3 from "d3";
import Button from "@mui/material/Button";

/*
参考
https://observablehq.com/d/c55a5839a5bb7c73
https://gist.github.com/mbostock/2990a882e007f8384b04827617752738
*/

const svgWidth = 500;
const svgHeight = 500;
const dataCount = 1000;

export function L002() {
  const [reloadCount, setReloadCount] = useState(0);
  const canvas = useRef(
    null as d3.Selection<HTMLCanvasElement, unknown, HTMLElement, any> | null
  );
  const canvasRef = useRef<HTMLDivElement>(null);
  // React 18 で StricMode の場合 useEffect が 2回実行されてしまうのでその対応
  useEffect(() => {
    if (canvas.current) return;
    canvas.current = d3
      .select(".canvas")
      .append("canvas")
      .attr("width", svgWidth)
      .attr("height", svgHeight);
  }, []);

  // data の生成
  const data = useMemo(() => Array(dataCount).map((_, i) => i), []);

  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const canvasNode = c.node();
    if (!canvasNode) return;
    const context = canvasNode.getContext("2d");
    if (!context) return;

    const radius = 20;

    const circles = d3.range(324).map((i) => ({
      x: (i % 25) * (radius + 1) * 2,
      y: Math.floor(1 / 25) * (radius + 1) * 2,
    }));

    const drawCircle = (d: { x: number; y: number }) => {
      context.moveTo(d.x + radius, d.y);
      context.arc(d.x, d.y, radius, 0, 2 * Math.PI);
    };
    const drawCircles = () => {
      context.clearRect(0, 0, svgWidth, svgHeight);
      context.save();
      context.beginPath();
      circles.forEach(drawCircle);
      context.fill();
      context.strokeStyle = "#fff";
      context.stroke();
    };
    const simulation = d3
      .forceSimulation(circles)
      .force("collide", d3.forceCollide(radius + 1).iterations(4))
      .on("tick", drawCircles);

    const dragsubject = (e: any) => {
      return simulation.find(e.x, e.y, radius);
    };
    const dragstarted = (e: any) => {
      if (!e.active) simulation.alphaTarget(0.3).restart();
      e.subject.fx = e.subject.x;
      e.subject.fy = e.subject.y;
    };
    const dragged = (e: any) => {
      e.subject.fx = e.x;
      e.subject.fy = e.y;
    };
    const dragended = (e: any) => {
      if (!e.active) simulation.alphaTarget(0);
      e.subject.fx = null;
      e.subject.fy = null;
    };

    // any にしてしまったが型をきちんと確認する
    const callhandler: any = d3
      .drag()
      .container(canvasNode)
      .subject(dragsubject)
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
    c.call(callhandler);
  }, [reloadCount, data]);

  return (
    <div className="page-root">
      <div className="canvas" ref={canvasRef} />
      <div className="control">
        <Button
          onClick={() => {
            setReloadCount(reloadCount + 1);
          }}
        >
          reload {reloadCount}
        </Button>
      </div>
    </div>
  );
}
