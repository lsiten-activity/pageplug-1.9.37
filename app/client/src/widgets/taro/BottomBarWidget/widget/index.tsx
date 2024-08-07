import type { MouseEventHandler } from "react";
import React from "react";
import type { DerivedPropertiesMap } from "WidgetProvider/factory";
import type { ContainerStyle } from "../component";
import ContainerComponent from "../component";
import type { WidgetProps, WidgetState } from "widgets/BaseWidget";
import BaseWidget from "widgets/BaseWidget";
import { ValidationTypes } from "constants/WidgetValidation";
import { compact, get, map, sortBy } from "lodash";
import WidgetsMultiSelectBox from "layoutSystems/fixedlayout/common/widgetGrouping/WidgetsMultiSelectBox";
import type { SetterConfig, Stylesheet } from "entities/AppTheming";
import { getSnappedGrid } from "sagas/WidgetOperationUtils";
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
import { Colors } from "constants/Colors";
import { FILL_WIDGET_MIN_WIDTH } from "constants/minWidthConstants";
import { GridDefaults, WidgetHeightLimits } from "constants/WidgetConstants";
import {
  FlexVerticalAlignment,
  Positioning,
  ResponsiveBehavior,
} from "layoutSystems/common/utils/constants";
import { renderAppsmithCanvas } from "layoutSystems/CanvasFactory";


export class MBottomBarWidget extends BaseWidget<
  ContainerWidgetProps<WidgetProps>,
  WidgetState
> {
  static type = "TARO_BOTTOM_BAR_WIDGET";

  constructor(props: ContainerWidgetProps<WidgetProps>) {
    super(props);
    this.renderChildWidget = this.renderChildWidget.bind(this);
  }

  static getConfig(): WidgetBaseConfiguration {
    return {
      name: "底部面板",
      searchTags: ["bottom bar"],
      iconSVG: IconSVG,
      isCanvas: true,
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
      backgroundColor: "#FFFFFF",
      rows: WidgetHeightLimits.MIN_CANVAS_HEIGHT_IN_ROWS,
      columns: 24,
      widgetName: "bottom_bar",
      containerStyle: "card",
      borderColor: Colors.GREY_5,
      borderWidth: "0",
      boxShadow: ButtonBoxShadowTypes.NONE,
      animateLoading: false,
      shouldScrollContents: false,
      height: 100,
      children: [],
      blueprint: {
        view: [
          {
            type: "CANVAS_WIDGET",
            position: { top: 0, left: 0 },
            props: {
              height: 100,
              containerStyle: "none",
              canExtend: false,
              detachFromLayout: true,
              shouldScrollContents: false,
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

  static getPropertyPaneContentConfig() {
    return [
      {
        sectionName: "属性",
        children: [
          {
            propertyName: "height",
            label: "面板高度（不带单位的数字）",
            controlType: "INPUT_TEXT",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.NUMBER,
              params: { min: 80, max: 200 },
            },
          },
          {
            propertyName: "isVisible",
            label: "是否可见",
            helpText: "控制显示/隐藏",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
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
      <ContainerComponent {...props} noScroll={false}>
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

interface ScreenProps {
  isScreen?: boolean;
}

export interface ContainerWidgetProps<T extends WidgetProps>
  extends ScreenProps,
  WidgetProps {
  children?: T[];
  containerStyle?: ContainerStyle;
  shouldScrollContents?: boolean;
  height: number
}

export default MBottomBarWidget;
