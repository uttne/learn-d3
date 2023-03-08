import { useEffect, useRef, useState, useMemo } from "react";
import * as d3 from "d3";
import Button from "@mui/material/Button";
import ViolineJpeg from "./../assets/violin.jpeg";
import ViolinePng from "./../assets/violin.png";
import ViolineSvg from "./../assets/violin.svg";

/*
同じデータソースを元に順番を維持したまま異なる図形を生成する
*/

const svgWidth = 500;
const svgHeight = 500;

interface CircleData {
  type: "circle";
  cx: number;
  cy: number;
  r: number;
}
interface RectData {
  type: "rect";
  x: number;
  y: number;
  width: number;
  height: number;
}

export function L005() {
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
    const data: (CircleData | RectData)[] = [
      {
        type: "circle",
        cx: 50,
        cy: 50,
        r: 50,
      },
      {
        type: "rect",
        x: 50,
        y: 50,
        width: 100,
        height: 100,
      },
      {
        type: "circle",
        cx: 150,
        cy: 150,
        r: 50,
      },
      {
        type: "rect",
        x: 150,
        y: 150,
        width: 100,
        height: 100,
      },
    ];
    {
      const chain = s
        .selectAll<SVGCircleElement | SVGRectElement, unknown>(".target")
        .data(data);

      chain.exit().remove();

      const createNode = (d: CircleData | RectData) => {
        // type で分岐してそれぞれのノードを作成する
        switch (d.type) {
          case "circle":
            return document.createElementNS(
              "http://www.w3.org/2000/svg",
              "circle"
            );
          case "rect":
            return document.createElementNS(
              "http://www.w3.org/2000/svg",
              "rect"
            );
        }
      };

      // 別の図形を各場合、それぞれで filter をして描画をすることもできるが
      // この方法だと描画する順番が守られるので、順番が大事な場合は条件分岐でノードを作成する方法が選択肢となる
      // また、g を先に作ってその中にそれぞれの図形を描画するという方法もある
      chain
        .enter()
        .append(createNode)
        .merge(chain)
        // すべての追加した図形に class を追加
        .attr("class", (d) => "target " + d.type);

      // それぞれのノードの設定は分けて行う必要があるのでクラスを使って select してそれぞれに値を設定する
      s.selectAll<SVGCircleElement, unknown>(".target.circle")
        .data(
          data.filter((d) => d.type === "circle").map((d) => d as CircleData)
        )
        .attr("cx", (d) => d.cx)
        .attr("cy", (d) => d.cy)
        .attr("r", (d) => d.r)
        .attr("fill", "#f00");

      s.selectAll<SVGCircleElement, unknown>(".target.rect")
        .data(data.filter((d) => d.type === "rect").map((d) => d as RectData))
        .attr("x", (d) => d.x)
        .attr("y", (d) => d.y)
        .attr("width", (d) => d.width)
        .attr("height", (d) => d.height)
        .attr("fill", "#0f0");
    }

    // 以下は別々に作成した場合
    // この場合、rect が上になる
    const offset = 200;
    {
      const chain = s
        .selectAll<SVGCircleElement, unknown>(".separate-circle")
        .data(
          data.filter((d) => d.type === "circle").map((d) => d as CircleData)
        );
      chain.exit().remove();
      chain
        .enter()
        .append("circle")
        .merge(chain)
        .attr("class", "separate-circle")
        .attr("cx", (d) => d.cx + offset)
        .attr("cy", (d) => d.cy)
        .attr("r", (d) => d.r)
        .attr("fill", "#ff0");
    }

    {
      const chain = s
        .selectAll<SVGRectElement, unknown>(".separate-rect")
        .data(data.filter((d) => d.type === "rect").map((d) => d as RectData));
      chain.exit().remove();
      chain
        .enter()
        .append("rect")
        .merge(chain)
        .attr("class", "separate-rect")
        .attr("x", (d) => d.x + offset)
        .attr("y", (d) => d.y)
        .attr("width", (d) => d.width)
        .attr("height", (d) => d.height)
        .attr("fill", "#0ff");
    }
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
