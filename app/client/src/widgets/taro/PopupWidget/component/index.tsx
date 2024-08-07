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
import { Popup } from "@taroify/core";
import { Cross } from "@taroify/icons";
import type { PopupProps } from "@taroify/core/popup/popup";

const PopupContainer = styled(Popup) <
  {
    height?: number;
    shouldScrollContents?: boolean;
    $noScroll?: boolean;
  } & PopupProps
>`
  height: ${(props) => props.height}px;
  overflow: visible;
  width: 450px;
  left: unset;
  background: #fff;
  ${(props) =>
    props.shouldScrollContents && !props.$noScroll ? scrollCSS : ``}
  
`;

const Content = styled.div`
  width: 100%;
  height: 100%;
`;

interface ContainerWrapperProps {
  shouldScrollContents?: boolean;
  widgetId: string;
  type: WidgetType;
  dropDisabled?: boolean;
  noScroll: boolean;
  height?: number;
  canOutsideClickClose?: boolean;
  className?: string;
  onClose: (e: any) => void;
  onModalClose?: () => void;
  isOpen: boolean;
  children: ReactNode;
  rounded?: boolean;
}
function ContainerComponentWrapper(
  props: PropsWithChildren<ContainerWrapperProps>,
) {
  const containerRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const layoutSystemType = useSelector(getLayoutSystemType);
  useEffect(() => {
    return () => {
      if (props.onModalClose) props.onModalClose();
    };
  }, [props.isOpen]);
  return (
    <PopupContainer
      height={props.height}
      onClose={props.onClose}
      open={props.isOpen}
      placement="bottom"
      rounded={props.rounded}
      $noScroll={!!props.noScroll}
      shouldScrollContents={!!props.shouldScrollContents}
    >
      <Popup.Backdrop
        closeable={props.canOutsideClickClose}
        style={{ left: "unset", right: "unset", top: "0", width: "450px" }}
      />
      <Popup.Close>
        <Cross size="24px" style={{ zIndex: 2 }} />
      </Popup.Close>
      <Content className={`${getCanvasClassName()} ${props.className}`}>
        {props.children}
      </Content>
    </PopupContainer>
  );
}

function PopModalComponent(props: ContainerComponentProps) {
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
        noScroll={false}
        dropDisabled={false}
        shouldScrollContents={true}
        type={props.type}
        widgetId={props.widgetId}
        height={props.height}
        canOutsideClickClose={props.canOutsideClickClose}
        className={props.className}
        onClose={props.onClose}
        onModalClose={props.onModalClose}
        isOpen={props.isOpen}
      >
        {props.children}
      </ContainerComponentWrapper>
    </WidgetStyleContainer>
  );
}

export interface ContainerComponentProps extends WidgetStyleContainerProps {
  height: number;
  isOpen: boolean;
  onClose: (e: any) => void;
  onModalClose?: () => void;
  children: ReactNode;
  className?: string;
  canOutsideClickClose: boolean;
  rounded?: boolean;
  type: WidgetType;
}

export default PopModalComponent;
