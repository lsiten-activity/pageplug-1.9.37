import type { BaseWidgetProps } from "widgets/BaseWidgetHOC/withBaseWidgetHOC";
import React from "react";
import { WidgetNameLayer } from "../../common/widgetName/WidgetNameLayer";
import { get } from "lodash";
import { EVAL_ERROR_PATH } from "utils/DynamicBindingUtils";
import styled, { css } from "styled-components";
import SnipeableComponent from "../../common/snipeable/SnipeableComponent";

const HiddenDetachWidgetWrapper = styled.div<{
  isVisible: boolean;
}>`
  ${(props) =>
    !props.isVisible
      ? css`
          && div[type="CANVAS_WIDGET"] > * {
            opacity: 0.6;
          }
        `
      : ""};
`;

/**
 * FixedLayoutEditorTaroOnion
 *
 * Component that wraps the BaseWidget implementation of a Widget with Editor specific wrappers
 * needed in Fixed Layout.
 *
 * Editor specific wrappers are wrappers added to perform actions in the editor.
 * - FixedLayoutWidgetComponent: provides layer to auto update height based on content/ add skeleton widget on loading state
 * - ModalOverlayLayer: provides blueprint library overlay for the modal widget to be rendered.
 * - ModalResizableLayer: provides the resize handles required to set dimension for a modal widget.
 * - WidgetNameLayer: provides the widget name in editing mode and also show error state if there are any.
 * - ClickContentToOpenPropPane: provides a way to open property pane on clicking on a modal widget content.
 *
 * @returns Enhanced Widget
 */

const TaroFixedContainer = styled.div`
  width: 450px;
  position: fixed;
  bottom: 0px;
`;

const TaroFixedContainerWrapper = styled.div`
  position: absolute;
  transition: transform 100ms ease 0s, width 100ms ease 0s, height 100ms ease 0s;
  height: 0px;
  z-index: 1009;
  background-color: inherit;
`;

export const FixedLayoutEditorTaroOnion = (props: BaseWidgetProps) => {
  return (
    <TaroFixedContainerWrapper {...props}>
      <TaroFixedContainer className="fixed-taro">
        <SnipeableComponent type={props.type} widgetId={props.widgetId}>
          <WidgetNameLayer
            componentWidth={props.componentWidth}
            detachFromLayout={props.detachFromLayout}
            disablePropertyPane={props.disablePropertyPane}
            evalErrorsObj={get(props, EVAL_ERROR_PATH, {})}
            parentId={props.parentId}
            topRow={props.topRow}
            type={props.type}
            widgetId={props.widgetId}
            widgetName={props.widgetName}
            showControls
          >
            {props.children}
          </WidgetNameLayer>
        </SnipeableComponent>
      </TaroFixedContainer>
    </TaroFixedContainerWrapper>
  );
};
