import { useEffect, useRef, useState, useMemo } from "react";
import * as d3 from "d3";
import Button from "@mui/material/Button";

/** d3.js で操作するためのチェーンを取得する */
function getChain<TTag extends keyof ElementTagNameMap, TData>(
  svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>,
  data: TData[],
  tag: TTag,
  selector: string
): d3.Selection<ElementTagNameMap[TTag], TData, SVGSVGElement, unknown> {
  // 現在のエレメントをセレクトする
  // 1つ目の型 : select するエレメントの型
  // 2つ目の型 : data の型
  const chain = svg
    .selectAll<ElementTagNameMap[TTag], number[]>(selector)
    .data(data);

  // 余分なエレメントを削除する
  chain.exit().remove();

  // まだ追加していないエレメントを追加する
  const chainAdd = chain.enter().append(tag);

  // 指定のエレメントの更新を行うため現在とまだ追加されていないものをマージ
  const chainUpdate = chainAdd.merge(chain);

  return chainUpdate;
}

const svgWidth = 500;
const svgHeight = 500;
const dataCount = 1000;

export function L002() {
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

  // data の生成
  const data = useMemo(() => Array(dataCount).map((_, i) => i), []);

  useEffect(() => {
    const s = svg.current;
    if (!s) return;

    // 指定のエレメントの更新を行うため現在とまだ追加されていないものをマージ
    const circleUpdate = getChain(s, data, "circle", "circle");

    // ランダム関数の作成
    const widthRandom = d3.randomUniform(svgWidth);
    const heightRandom = d3.randomUniform(svgHeight);

    // カラーパレットの作成
    const color = d3
      .scaleLinear<string, number, never>()
      .domain([0, data.length - 1])
      .range(["red", "blue"]);

    // d3.js で操作
    circleUpdate
      .transition()
      .duration(1000)
      .attr("cx", (d) => widthRandom())
      .attr("cy", (d) => heightRandom())
      .attr("r", 5)
      .attr("fill", (d, i) => color(i));
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
