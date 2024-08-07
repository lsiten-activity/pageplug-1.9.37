import React, { useMemo } from "react";
import type { WidgetProps } from "widgets/BaseWidget";
import { FixedLayoutEditorWidgetOnion } from "./FixedLayoutEditorWidgetOnion";
import { FixedLayoutEditorModalOnion } from "./FixedLayoutEditorModalOnion";
import { FixedLayoutEditorTaroOnion } from "./FixedLayoutEditorTaroOnion";

/**
 * FixedLayoutEditorWrapper
 *
 * Component that wraps a BaseWidget implementation of a widget with editor specific layers of Fixed Layout System.
 * check out FixedLayoutEditorWidgetOnion and FixedLayoutEditorModalOnion to further understand what they implement under the hood.
 *
 * @param props
 * @returns Enhanced BaseWidget with Editor specific Layers.
 */

export const FixedLayoutEditorWrapper = (props: WidgetProps) => {
  /**
   * @constant WidgetOnion
   *
   * Widget Onion here refers to the Layers surrounding a widget just like layers in an onion.
   */
  const IS_TARO_WIDGET = ["TARO_LOADING_WIDGET", "TARO_BOTTOM_BAR_WIDGET", "TARO_POPUP_WIDGET"].includes(props?.type);
  const WidgetOnion = useMemo(() => {
    return IS_TARO_WIDGET ? FixedLayoutEditorTaroOnion : props.type === "MODAL_WIDGET"
      ? FixedLayoutEditorModalOnion
      : FixedLayoutEditorWidgetOnion;
  }, [props.type]);

  return <WidgetOnion {...props}>{props.children}</WidgetOnion>;
};
