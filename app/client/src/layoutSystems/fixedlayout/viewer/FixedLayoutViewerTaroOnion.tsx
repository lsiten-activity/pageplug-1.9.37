import React from "react";
import type { BaseWidgetProps } from "widgets/BaseWidgetHOC/withBaseWidgetHOC";
import styled, { css } from "styled-components";

/**
 * FixedLayoutViewerModalOnion
 *
 * Component that wraps the BaseWidget implementation of a Modal Widget with Viewer specific wrappers
 * needed in Fixed Layout.
 *
 * Viewer specific wrappers are wrappers added to perform actions in the viewer.
 * - FixedLayoutWidgetComponent: provides layer to auto update height based on content/ add skeleton widget on loading state.
 * - ModalOverlayLayer: provides blueprint library overlay for the modal widget to be rendered.
 *
 * @returns Enhanced Modal Widget
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

export const FixedLayoutViewerTaroOnion = (props: BaseWidgetProps) => {
  return (
    <TaroFixedContainerWrapper {...props}>
      <TaroFixedContainer {...props}>
        {props.children}
      </TaroFixedContainer>
    </TaroFixedContainerWrapper>
  );
};
