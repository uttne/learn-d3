import { useEffect, useRef, useState, useMemo } from "react";
import * as d3 from "d3";
import Typography from "@mui/material/Typography";

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
const dataCount = 5000;

export function Home() {
  return (
    <div className="page-root">
      <Typography>Home</Typography>
    </div>
  );
}
