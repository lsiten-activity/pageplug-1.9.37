import type {
  MouseEventHandler,
  PropsWithChildren,
  ReactNode,
  RefObject,
} from "react";
import React, { useCallback, useEffect, useRef } from "react";
import styled from "styled-components";
import tinycolor from "tinycolor2";
import fastdom from "fastdom";
import { generateClassName, getCanvasClassName } from "utils/generators";
import type { WidgetStyleContainerProps } from "components/designSystems/appsmith/WidgetStyleContainer";
import WidgetStyleContainer, { BoxShadowTypes } from "components/designSystems/appsmith/WidgetStyleContainer";
import { scrollCSS } from "widgets/WidgetUtils";
import { useSelector } from "react-redux";
import { LayoutSystemTypes } from "layoutSystems/types";
import { MAIN_CONTAINER_WIDGET_ID } from "constants/WidgetConstants";
import type { WidgetType } from "WidgetProvider/factory";
import { getLayoutSystemType } from "selectors/layoutSystemSelectors";
import { boxShadowOptions, boxShadowPropertyName } from 'constants/ThemeConstants';
import { Popup } from "@taroify/core";
import type { PopupProps } from "@taroify/core/popup/popup";

const Container = styled(Popup) <
  {
    height?: number;
  } & PopupProps
>`
  height: ${(props) => props.height}px;
  max-height: 200px;
  min-height: 80px;
  overflow: visible;
  width: 450px;
  left: unset;
  background: #fff;
  z-index: 1009;
`;

// const StyledContainerPopupComponent = styled(Popup) <
//   Omit<ContainerWrapperProps, "widgetId"> & PopupProps
// >`
//   height: ${(props) => props.height}px;
//   max-height: 200px;
//   min-height: 80px;
//   width: 450px;
//   overflow: visible;
//   outline: none;
//   ${(props) => (!!props.dropDisabled ? `position: relative;` : ``)}
// `;

interface ContainerWrapperProps {
  shouldScrollContents?: boolean;
  backgroundColor?: string;
  backgroundImage?: string;
  widgetId: string;
  type: WidgetType;
  dropDisabled?: boolean;
  $noScroll: boolean;
  height?: number;
}
function ContainerComponentWrapper(
  props: PropsWithChildren<ContainerWrapperProps>,
) {
  const containerRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const layoutSystemType = useSelector(getLayoutSystemType);
  return (
    <Container
      defaultOpen
      duration={0}
      height={props.height}
      placement="bottom"
      className={`${props.shouldScrollContents ? getCanvasClassName() : ""
        } ${generateClassName(props.widgetId)} container-with-scrollbar ${layoutSystemType === LayoutSystemTypes.AUTO &&
          props.widgetId === MAIN_CONTAINER_WIDGET_ID
          ? "auto-layout"
          : ""
        }`}
      ref={containerRef}
    >
      <Popup.Backdrop
        closeable={false}
        open={false}
        style={{ left: "unset", right: "unset", width: "450px" }}
      />
      {props.children}
    </Container>
  );
}

function BottomBarComponent(props: ContainerComponentProps) {
  return (
    <WidgetStyleContainer
      backgroundColor={props.backgroundColor}
      borderColor={props.borderColor}
      borderRadius={0}
      borderWidth={0}
      boxShadow={BoxShadowTypes.NONE}
      className="style-container"
      containerStyle={props.containerStyle}
      selected={props.selected}
      widgetId={props.widgetId}
    >
      <ContainerComponentWrapper
        $noScroll={!!props.noScroll}
        backgroundColor={props.backgroundColor}
        backgroundImage={props.backgroundImage}
        dropDisabled={props.dropDisabled}
        shouldScrollContents={false}
        type={props.type}
        widgetId={props.widgetId}
        height={props.height}
      >
        {props.children}
      </ContainerComponentWrapper>
    </WidgetStyleContainer>
  );
}

export type ContainerStyle = "border" | "card" | "rounded-border" | "none";

export interface ContainerComponentProps extends WidgetStyleContainerProps {
  height: number;
  children?: ReactNode;
  shouldScrollContents?: boolean;
  selected?: boolean;
  focused?: boolean;
  detachFromLayout?: boolean;
  type: WidgetType;
  noScroll?: boolean;
  minHeight?: number;
  dropDisabled?: boolean;
  layoutSystemType?: LayoutSystemTypes;
}

export default BottomBarComponent;
