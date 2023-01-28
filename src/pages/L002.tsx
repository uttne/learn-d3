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

  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const canvasNode = c.node();
    if (!canvasNode) return;
    const context = canvasNode.getContext("2d");
    if (!context) return;

    const radius = 20;

    // d3.js で使用するデータをここで作成する
    const circleCenterDatas = d3
      .range((svgWidth / radius) * (svgHeight / radius))
      .map((i) => ({
        x: (i % 25) * (radius + 1) * 2,
        y: Math.floor(i / 25) * (radius + 1) * 2,
      }));

    const drawCircle = (d: { x: number; y: number }) => {
      // 1つ1つへの円の色を変えるためにここで beginPath を実行する
      context.beginPath();

      // 特に色を変える必要がないサンプルではパスの開始位置を移動する moveTo をつかっていた
      // パスの開始時点を移動する
      // これをしないと円のパスが全てつながってしまう
      // context.moveTo(d.x + radius, d.y);

      // x軸を起点に円を描画する
      // context.arc(中心のx, 中心のy, 半径, 開始角度, 終了角度, [回転方向: true は反時計回り])
      context.arc(d.x, d.y, radius, 0, 2 * Math.PI);
      context.arc(d.x, d.y, radius, 0, 2 * Math.PI);

      // fx が指定されいている = ドラッグしているものの色を変える
      if ((d as any).fx != null) {
        context.fillStyle = "#f00";
      } else {
        context.fillStyle = "#000";
      }
      // 色を塗る
      context.fill();

      // ストロークを塗る
      context.stroke();
    };
    const drawCircles = () => {
      // キャンパスを白紙に戻す
      context.clearRect(0, 0, svgWidth, svgHeight);
      context.save();
      context.beginPath();

      // 円を描画する
      circleCenterDatas.forEach(drawCircle);
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
      .drag<HTMLCanvasElement, unknown>()
      .container(canvasNode)
      .subject(dragsubject)
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);

    c.call(callhandler);
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
