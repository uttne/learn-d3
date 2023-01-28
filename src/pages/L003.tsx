import { useEffect, useRef, useState, useMemo } from "react";
import * as d3 from "d3";
import Button from "@mui/material/Button";

/*
L002 で canvas を使ったシミュレーションをしたので svg を使ったシミュレーションに書き換えてみる
*/

const svgWidth = 500;
const svgHeight = 500;

export function L003() {
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

    const radius = 20;

    // d3.js で使用するデータをここで作成する
    const circleCenterDatas = d3
      .range((svgWidth / radius) * (svgHeight / radius))
      .map((i) => ({
        x: (i % 25) * (radius + 1) * 2,
        y: Math.floor(i / 25) * (radius + 1) * 2,
      }));

    const drawCircles = () => {
      // ほぼ描画部分だけ SVG に変更することで SVG のシミュレーションを実装できた
      const chain = s
        .selectAll<SVGCircleElement, unknown>("circle")
        .data(circleCenterDatas);

      chain.exit().remove();

      const chainAdd = chain.enter().append("circle");

      const chainUpdate = chainAdd.merge(chain);

      chainUpdate
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y)
        .attr("r", radius)
        .attr("fill", (d: any) => (d.fx != null ? "#f00" : "#000"));
    };
    const simulation = d3
      .forceSimulation(circleCenterDatas)
      // 力を設定する
      .force("collide", d3.forceCollide(radius + 1).iterations(4))
      // tick でシミュレーションを開始する
      // 設定した関数をアニメーションする速度で呼び出す
      .on("tick", drawCircles);

    const dragsubject = (e: any) => {
      // simulation.find で指定した場所にあるノードを見つけ返すことができる
      // 見つけたノードは drag などのイベントの e.subject に代入される
      return simulation.find(e.x, e.y, radius);
    };
    const dragstarted = (e: any) => {
      if (!e.active) simulation.alphaTarget(0.3).restart();

      e.subject.fx = e.subject.x;
      e.subject.fy = e.subject.y;
    };
    const dragged = (e: any) => {
      // https://github.com/d3/d3-force#simulation_nodes
      // fx, fy は d3.js で追加されるプロパティ
      // f は fixed の略なので固定という意味になる
      // x や y を変更してしまうとシミュレーションが動かした物体にも作用してしまい、挙動がおかしくなるので
      // fx, fy で位置を固定しながら動かす
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
