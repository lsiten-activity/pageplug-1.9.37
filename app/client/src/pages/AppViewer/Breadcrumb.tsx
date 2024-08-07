import React, { useMemo } from "react";
import { Breadcrumb } from "antd";
import { getSelectedAppTheme } from "selectors/appThemingSelectors";
import { getCurrentPage, getViewModePageList } from "selectors/editorSelectors";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  getCurrentApplication,
  getAppSidebarPinned,
  getSidebarWidth,
  getAppMode,
} from "@appsmith/selectors/applicationSelectors";
import { builderURL, viewerURL } from "@appsmith/RouteBuilder";
import { useIsMobileDevice } from "utils/hooks/useDeviceDetect";
import { APP_MODE } from "entities/App";
import { useLocation } from "react-router";
import _last from "lodash/last";
import _size from "lodash/size";
import _head from "lodash/head";
import _get from "lodash/get";
import { findParentPaths } from "./utils";

const App: React.FC = () => {
  const currentApplicationDetails = useSelector(getCurrentApplication);
  const currentPage = useSelector(getCurrentPage);
  const appMode = useSelector(getAppMode);
  const selectedTheme = useSelector(getSelectedAppTheme);
  // const location = useLocation();
  const history = useHistory();
  const currentApp = useSelector(getCurrentApplication);
  const pages = useSelector(getViewModePageList);

  const viewerLayout = currentApp?.viewerLayout;
  const primaryColor = _get(
    selectedTheme,
    "properties.colors.primaryColor",
    "inherit",
  );
  const getPath = (it: any, pagesMap: any, title: string) => {
    if (!it.pageId || !pagesMap[title]) return "";
    const pageURL =
      appMode === APP_MODE.PUBLISHED
        ? viewerURL({
            pageId: pagesMap[title].pageId,
          })
        : builderURL({
            pageId: pagesMap[title].pageId,
          });
    return pageURL;
  };

  const goTo = (path: string) => {
    history.push({
      pathname: path,
    });
  };

  const initState = useMemo(() => {
    let menudata: any = [];
    let treeData: any = [];
    if (viewerLayout && pages.length) {
      try {
        const current = JSON.parse(viewerLayout);
        const pagesMap = pages.reduce((a: any, c: any) => {
          a[c.pageName] = { ...c };
          return a;
        }, {});
        menudata = pages.map((p) => {
          const path = getPath(p, pagesMap, p.pageName);
          return {
            title: p.pageName,
            pageId: p.pageId,
            isPage: true,
            key: p.pageId,
            path,
            children: null,
          };
        });
        treeData = current?.treeData;
      } catch (e) {
        console.log(e);
      }
    }
    return {
      menudata,
      treeData,
    };
  }, [viewerLayout, pages, currentApplicationDetails]);

  // const currentPageId: any = currentPage?.pageId;
  const currentPageName: any = currentPage?.pageName;

  const parentPaths = findParentPaths(initState.treeData, currentPageName);
  const parentPath = _last(parentPaths)?.map(
    (item: any, idx: number, self: any) => {
      let _breadItem: any = {};
      if (item?.isPage && idx + 1 !== _size(self)) {
        const cNode = initState.menudata.find((it: any) => {
          return item?.title === it?.title;
        });
        _breadItem = {
          title: <a onClick={() => goTo(cNode?.path)}>{item.title}</a>,
          key: item?.key,
        };
      }
      const firstChild = _head(item.children);
      const firstMenuChild = initState.menudata.find((it: any) => {
        return firstChild?.title === it?.title;
      });

      _breadItem = {
        title: firstChild ? (
          <a onClick={() => goTo(firstMenuChild?.path)}>{item.title}</a>
        ) : (
          item.title
        ),
        key: item?.key,
      };
      if (idx + 1 === self.length) {
        _breadItem.title = (
          <span style={{ color: primaryColor }}>{_breadItem.title}</span>
        );
      }
      return _breadItem;
    },
  );
  if (_size(parentPath) <= 1) return null;

  return (
    <div className="custom-breadcrumb">
      <Breadcrumb
        items={_size(parentPath) > 1 ? parentPath : []}
        separator=">"
      />
    </div>
  );
};

export default App;
