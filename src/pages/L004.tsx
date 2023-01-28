import { useEffect, useRef, useState, useMemo } from "react";
import * as d3 from "d3";
import Button from "@mui/material/Button";
import ViolineJpeg from "./../assets/violin.jpeg";
import ViolinePng from "./../assets/violin.png";
import ViolineSvg from "./../assets/violin.svg";

/*
L002 で canvas を使ったシミュレーションをしたので svg を使ったシミュレーションに書き換えてみる
*/

const svgWidth = 500;
const svgHeight = 500;

export function L004() {
  const [reloadCount, setReloadCount] = useState(0);
  const svg = useRef(
    null as d3.Selection<SVGSVGElement, unknown, HTMLElement, any> | null
  );
  const canvasRef = useRef<HTMLDivElement>(null);
  // React 18 で StricMode の場合 useEffect が 2回実行されてしまうのでその対応
  useEffect(() => {
    if (svg.current) return;
    svg.current = d3
      .select(".canvas")
      .append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight);
  }, []);

  useEffect(() => {
    const s = svg.current;
    if (!s) return;
    const svgNode = s.node();
    if (!svgNode) return;

    const radius = 100;

    // d3.js で使用するデータをここで作成する
    const data: {
      x: number;
      y: number;
      width: number;
      height: number;
      src: string;
    }[] = [
      {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        src: ViolineJpeg,
      },
      {
        x: 100,
        y: 0,
        width: 100,
        height: 100,
        src: ViolinePng,
      },
      {
        x: 200,
        y: 0,
        width: 100,
        height: 100,
        src: ViolineSvg,
      },
    ];

    const drawImage = () => {
      const chain = s.selectAll<SVGImageElement, unknown>("image").data(data);

      chain.exit().remove();

      const chainAdd = chain.enter().append("image");

      const chainUpdate = chainAdd.merge(chain);

      chainUpdate
        .attr("x", (d) => d.x)
        .attr("y", (d) => d.y)
        .attr("width", (d) => d.width)
        .attr("height", (d) => d.height)
        .attr("href", (d) => d.src)
        .attr("stroke", "#000")
        .attr("stroke-width", 1);
    };

    const drawRect = () => {
      const chain = s.selectAll<SVGRectElement, unknown>("rect").data(data);

      chain.exit().remove();

      const chainAdd = chain.enter().append("rect");

      const chainUpdate = chainAdd.merge(chain);

      chainUpdate
        .attr("x", (d) => d.x)
        .attr("y", (d) => d.y)
        .attr("width", (d) => d.width)
        .attr("height", (d) => d.height)
        .attr("stroke", "#000")
        .attr("stroke-width", 1)
        .attr("fill", "#0000");
    };

    const draw = () => {
      drawRect();
      drawImage();
    };
    const simulation = d3.forceSimulation(data).on("tick", draw);

    const dragsubject = (e: any) => {
      return simulation.find(e.x - 50, e.y - 50, 50);
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

      // ドラッグが終わったら fx, fy をnullにして再び動くようにする
      e.subject.fx = null;
      e.subject.fy = null;
    };

    const callhandler = d3
      .drag<SVGSVGElement, unknown>()
      .container(svgNode)
      .subject(dragsubject)
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);

    s.call(callhandler);
  }, [reloadCount]);

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
