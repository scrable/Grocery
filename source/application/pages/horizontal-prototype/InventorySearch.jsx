import React, { useReducer } from 'react';
import { useCookies } from 'react-cookie';
import LocalizedStrings from 'react-localization';

import { View, useWindowDimensions } from 'react-native';
import { Cell, Grid, Row } from '@material/react-layout-grid';
import { DrawerAppContent } from '@material/react-drawer';
import { TopAppBarFixedAdjust } from '@material/react-top-app-bar';
import '@material/react-layout-grid/dist/layout-grid.css';

import MaterialTopAppBarDialog from '../../components/horizontal-prototype/MaterialTopAppBarDialog';
import MaterialTopAppBarSearchDialog from '../../components/horizontal-prototype/MaterialTopAppBarSearchDialog';
import MaterialSingleSelectionList from '../../components/horizontal-prototype/MaterialSingleSelectionList';

import {
  setSearchOpen,
  setKeywords,
  setAutoComplete,
} from '../../actions/horizontal-prototype/InventorySearch';
import { inventorySearchReducer, initialState } from '../../reducers/horizontal-prototype/InventorySearch';
import { apiUrl } from '../../url';

const strings = new LocalizedStrings({
  en: {
  },
});

export default () => {
  const [cookies, setCookie] = useCookies(['session', 'userID']);
  const [state, dispatch] = useReducer(inventorySearchReducer, initialState);

  const toggleSearch = () => {
    dispatch(setSearchOpen(!state.searchOpen));
  };

  const handleGoBack = () => {
    if (history.length > 0) {
      history.back();
    }
  };

  const handleSearch = async (keywords) => {
    dispatch(setKeywords(keywords));
    if (keywords.length > 0) {
      await fetch(`${apiUrl}/v4/ingredients/search?session=${cookies.session}&userID=${cookies.userID}&query=${keywords}`, {
        method: 'get',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`${res.status} ${res.statusText}`);
          }
          return res.json();
        })
        .then(async (data) => {
          const ingredients = data.map((item) => ({
            key: item.ingredientID,
            primaryText: item.name,
            ingredient: item,
          }));
          dispatch(setAutoComplete(ingredients));
        });
    } else {
      dispatch(setAutoComplete(initialState.autoComplete));
    }
  };

  const handleAutoComplete = async (value) => {
    window.location.href = `../view/?id=${state.autoComplete[value].key}`;
  };

  return (
    <View className="drawer-container">
      {!state.searchOpen && (
      <MaterialTopAppBarDialog
        icon1="arrow_back"
        onClick1={handleGoBack}
        onClick2={toggleSearch}
      />
      )}
      {state.searchOpen && (
      <MaterialTopAppBarSearchDialog
        value={state.keywords}
        onClick1={toggleSearch}
        onChange={(e) => handleSearch(e.target.value)}
        onTrailingIconSelect={() => dispatch(setKeywords(initialState.keywords))}
      />
      )}
      <TopAppBarFixedAdjust className="top-app-bar-fix-adjust">
        <DrawerAppContent className="drawer-app-content">
          <Grid style={{ height: useWindowDimensions().height - 64 }}>
            <Row>
              <Cell columns={12}>
                <MaterialSingleSelectionList
                  items={state.autoComplete}
                  handleSelect={handleAutoComplete}
                />
              </Cell>
            </Row>
          </Grid>
        </DrawerAppContent>
      </TopAppBarFixedAdjust>
    </View>
  );
};
