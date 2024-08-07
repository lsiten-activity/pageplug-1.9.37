import type { MouseEventHandler } from "react";
import React from "react";
import type { DerivedPropertiesMap } from "WidgetProvider/factory";
import { EventType } from "constants/AppsmithActionConstants/ActionConstants";
import ContainerComponent from "../component";
import type { WidgetProps, WidgetState } from "widgets/BaseWidget";
import BaseWidget from "widgets/BaseWidget";
import { ValidationTypes } from "constants/WidgetValidation";
import { compact, get, map, sortBy } from "lodash";
import WidgetsMultiSelectBox from "layoutSystems/fixedlayout/common/widgetGrouping/WidgetsMultiSelectBox";
import type { SetterConfig, Stylesheet } from "entities/AppTheming";
import { getSnappedGrid } from "sagas/WidgetOperationUtils";
import { SelectionRequestType } from "sagas/WidgetSelectUtils";
import {
  DefaultAutocompleteDefinitions,
} from "widgets/WidgetUtils";
import {
  BlueprintOperationTypes,
  type AnvilConfig,
  type AutocompletionDefinitions,
  type AutoLayoutConfig,
  type WidgetBaseConfiguration,
  type WidgetDefaultProps,
  type FlattenedWidgetProps,
} from "WidgetProvider/constants";
import { WIDGET_TAGS } from "constants/WidgetConstants";
import IconSVG from "../icon.svg";
import { ButtonBoxShadowTypes } from "components/constants";
import { connect } from "react-redux";
import { ReduxActionTypes } from "@appsmith/constants/ReduxActionConstants";
import { FILL_WIDGET_MIN_WIDTH } from "constants/minWidthConstants";
import { GridDefaults, WidgetHeightLimits } from "constants/WidgetConstants";
import {
  FlexVerticalAlignment,
  Positioning,
  ResponsiveBehavior,
} from "layoutSystems/common/utils/constants";
import { renderAppsmithCanvas } from "layoutSystems/CanvasFactory";
import type { RenderMode } from "constants/WidgetConstants";
import type { AppState } from "@appsmith/reducers";
import { getCanvasWidth } from "selectors/editorSelectors";


export class MPopupWidget extends BaseWidget<
  ContainerWidgetProps<WidgetProps>,
  WidgetState
> {
  static type = "TARO_POPUP_WIDGET"

  constructor(props: ContainerWidgetProps<WidgetProps>) {
    super(props);
    this.renderChildWidget = this.renderChildWidget.bind(this);
  }

  static getConfig(): WidgetBaseConfiguration {
    return {
      name: "底部弹窗",
      searchTags: ["popup", "dialog", "modal"],
      iconSVG: IconSVG,
      needsMeta: true,
      isCanvas: false,
      isMobile: true,
    };
  }

  static getFeatures() {
    return {};
  }

  static getMethods() {
    return {
      getCanvasHeightOffset: (props: WidgetProps): number => {
        const offset =
          props.borderWidth && props.borderWidth > 1
            ? Math.ceil(
              (2 * parseInt(props.borderWidth, 10) || 0) /
              GridDefaults.DEFAULT_GRID_ROW_HEIGHT,
            )
            : 0;

        return offset;
      },
    };
  }

  static getDefaults(): WidgetDefaultProps {
    return {
      rows: 40,
      columns: 64,
      widgetName: "popup",
      containerStyle: "card",
      animateLoading: false,
      canOutsideClickClose: true,
      height: 400,
      children: [],
      blueprint: {
        view: [
          {
            type: "CANVAS_WIDGET",
            position: { top: 0, left: 0 },
            props: {
              height: 400,
              containerStyle: "none",
              canExtend: false,
              detachFromLayout: true,
              shouldScrollContents: true,
              children: [],
            },
          },
        ],
      },
      version: 1,
      flexVerticalAlignment: FlexVerticalAlignment.Stretch,
      responsiveBehavior: ResponsiveBehavior.Fill,
      minWidth: FILL_WIDGET_MIN_WIDTH,
    };
  }

  static getAutoLayoutConfig(): AutoLayoutConfig {
    return {
      widgetSize: [
        {
          viewportMinWidth: 0,
          configuration: () => {
            return {
              minWidth: "280px",
              minHeight: "80px",
            };
          },
        },
      ],
      disableResizeHandles: (props: ContainerWidgetProps<WidgetProps>) => ({
        // Disables vertical resize handles for all container widgets except for the List item container
        vertical: !props.isListItemContainer,
      }),
    };
  }

  static getAnvilConfig(): AnvilConfig | null {
    return {
      widgetSize: {
        maxHeight: {},
        maxWidth: {},
        minHeight: { base: "80px" },
        minWidth: { base: "280px" },
      },
    };
  }

  static getAutocompleteDefinitions(): AutocompletionDefinitions {
    return {
      "!doc":
        "taro popup.Backdrop",
      "!url": "",
      height: "number",
      isVisible: DefaultAutocompleteDefinitions.isVisible,
    };
  }

  static getSetterConfig(): SetterConfig | null {
    return {
      __setters: {
        setVisibility: {
          path: "isVisible",
          type: "boolean",
        },
      },
    };
  }

  static getPropertyPaneConfig() {
    return [
      {
        sectionName: "属性",
        children: [
          {
            propertyName: "height",
            label: "弹窗高度（不带单位的数字）",
            controlType: "INPUT_TEXT",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.NUMBER,
              params: { min: 200, max: 800 },
            },
          },
          {
            propertyName: "canOutsideClickClose",
            label: "点击背景关闭",
            controlType: "SWITCH",
            isBindProperty: false,
            isTriggerProperty: false,
          },
          {
            propertyName: "rounded",
            label: "圆角风格",
            controlType: "SWITCH",
            isBindProperty: false,
            isTriggerProperty: false,
          },
        ],
      },
      {
        sectionName: "动作",
        children: [
          {
            helpText: "弹窗关闭后触发",
            propertyName: "onClose",
            label: "onClose",
            controlType: "ACTION_SELECTOR",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: true,
          },
        ],
      },
    ];
  }

  static getPropertyPaneStyleConfig() {
    return [];
  }

  static getDerivedPropertiesMap(): DerivedPropertiesMap {
    return {};
  }
  static getDefaultPropertiesMap(): Record<string, string> {
    return {};
  }
  static getMetaPropertiesMap(): Record<string, any> {
    return {};
  }

  static getStylesheetConfig(): Stylesheet {
    return {
      borderRadius: "{{appsmith.theme.borderRadius.appBorderRadius}}",
      boxShadow: "{{appsmith.theme.boxShadow.appBoxShadow}}",
    };
  }

  onModalClose = () => {
    if (this.props.onClose) {
      super.executeAction({
        triggerPropertyName: "onClose",
        dynamicString: this.props.onClose,
        event: {
          type: EventType.ON_MODAL_CLOSE,
        },
      });
    }
  };

  closeModal = (e: any) => {
    this.props.updateWidgetMetaProperty("isVisible", false);
    this.selectWidgetRequest(SelectionRequestType.Empty);
    // TODO(abhinav): Create a static property with is a map of widget properties
    // Populate the map on widget load
  };

  getSnapSpaces = () => {
    // const { componentWidth } = this.props;
    const componentWidth = 450
    const { snapGrid } = getSnappedGrid(this.props, componentWidth);

    return snapGrid;
  };

  renderChildWidget(childWidgetData: WidgetProps): React.ReactNode {
    const childWidget = { ...childWidgetData };
    // const { componentWidth, componentHeight } = this.props;
    const componentWidth = 450;
    const componentHeight = this.props.height;

    childWidget.rightColumn = componentWidth;
    childWidget.bottomRow = this.props.shouldScrollContents
      ? childWidget.bottomRow
      : componentHeight;
    childWidget.minHeight = componentHeight;
    childWidget.shouldScrollContents = false;
    childWidget.canExtend = this.props.shouldScrollContents;

    childWidget.parentId = this.props.widgetId;
    // Pass layout controls to children
    childWidget.positioning =
      childWidget?.positioning || this.props.positioning;
    childWidget.useAutoLayout = this.props.positioning
      ? this.props.positioning === Positioning.Vertical
      : false;

    return renderAppsmithCanvas(childWidget as WidgetProps);
  }

  renderChildren = () => {
    return map(
      // sort by row so stacking context is correct
      // TODO(abhinav): This is hacky. The stacking context should increase for widgets rendered top to bottom, always.
      // Figure out a way in which the stacking context is consistent.
      this.props.positioning !== Positioning.Fixed
        ? this.props.children
        : sortBy(compact(this.props.children), (child) => {
          const ifshouldSkipContainerReflow: boolean =
            child.type === "MAPBACKDROP_WIDGET";
          if (ifshouldSkipContainerReflow) {
            return -1;
          } else {
            return child.topRow;
          }
        }),
      this.renderChildWidget,
    );
  };

  renderAsContainerComponent(props: ContainerWidgetProps<WidgetProps>) {
    return (
      <ContainerComponent
        {...props}
        isOpen={!!this.props.isVisible}
        onModalClose={this.onModalClose}
        onClose={this.closeModal}
        canOutsideClickClose={!!props.canOutsideClickClose}
      // noScroll={false}
      >
        <WidgetsMultiSelectBox
          {...this.getSnapSpaces()}
          noContainerOffset={!!props.noContainerOffset}
          widgetId={this.props.widgetId}
          widgetType={this.props.type}
        />
        {/* without the wrapping div onClick events are triggered twice */}
        <>{this.renderChildren()}</>
      </ContainerComponent>
    );
  }

  getWidgetView() {
    return this.renderAsContainerComponent(this.props);
  }
}

export interface ContainerWidgetProps<T extends WidgetProps>
  extends WidgetProps {
  renderMode: RenderMode;
  children?: WidgetProps[];
  canOutsideClickClose?: boolean;
  rounded?: boolean;
  height: number;
  showPropertyPane: (widgetId?: string) => void;
  onClose: string;
  mainCanvasWidth: number;
}

const mapDispatchToProps = (dispatch: any) => ({
  showPropertyPane: (
    widgetId?: string,
    callForDragOrResize?: boolean,
    force = false,
  ) => {
    dispatch({
      type:
        widgetId || callForDragOrResize
          ? ReduxActionTypes.SHOW_PROPERTY_PANE
          : ReduxActionTypes.HIDE_PROPERTY_PANE,
      payload: { widgetId, callForDragOrResize, force },
    });
  },
});

const mapStateToProps = (state: AppState) => {
  const props = {
    mainCanvasWidth: getCanvasWidth(state),
  };
  return props;
};
export default connect(mapStateToProps, mapDispatchToProps)(MPopupWidget);
