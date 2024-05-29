import React, { useEffect, useReducer } from 'react';
import { useCookies } from 'react-cookie';
import LocalizedStrings from 'react-localization';

import { View, useWindowDimensions } from 'react-native';
import { Cell, Grid, Row } from '@material/react-layout-grid';
import { DrawerAppContent } from '@material/react-drawer';
import { TopAppBarFixedAdjust } from '@material/react-top-app-bar';
import '@material/react-layout-grid/dist/layout-grid.css';

import MaterialTopAppBarDialog from '../../components/horizontal-prototype/MaterialTopAppBarDialog';
import MaterialTopAppBarSearchDialog from '../../components/horizontal-prototype/MaterialTopAppBarSearchDialog';
import { Body1 } from '../../components/horizontal-prototype/MaterialTypography';
import MaterialChoiceChips from '../../components/horizontal-prototype/MaterialChoiceChips';
import MaterialFilterChips from '../../components/horizontal-prototype/MaterialFilterChips';
import MaterialSingleSelectionList from '../../components/horizontal-prototype/MaterialSingleSelectionList';

import {
  setSearchOpen,
  setMealPlanID,
  setKeywords,
  setCaloriesFilter,
  setServingsFilter,
  setFatFilter,
  setProteinFilter,
  setCarbonhydratesFilter,
  setAutoComplete,
} from '../../actions/horizontal-prototype/MealPlansSearch';
import { mealPlansSearchReducer, initialState } from '../../reducers/horizontal-prototype/MealPlansSearch';
import { apiUrl } from '../../url';

const strings = new LocalizedStrings({
  en: {
    choose_calories: 'Choose calories per serving',
    choose_servings: 'Choose servings',
    choose_fat: 'Choose fat per serving',
    choose_protein: 'Choose protein per serving',
    choose_carbonhydrates: 'Choose carbonhydrates per serving',
    calories_500_less: '500 calories or less',
    calories_500_1000: '500-1000 calories',
    servings_1_2: '1-2 servings',
    servings_3_4: '3-4 servings',
    grams_10_less: '10 grams or less',
    grams_10_20: '10-20 grams',
  },
});

export default () => {
  const [cookies, setCookie] = useCookies(['session', 'userID']);
  const [state, dispatch] = useReducer(mealPlansSearchReducer, initialState);

  const caloriesFilterChoices = [
    { id: '500_less', label: strings.calories_500_less },
    { id: '500_1000', label: strings.calories_500_1000 },
  ];
  const servingsFilterChoices = [
    { id: '1_2', label: strings.servings_1_2 },
    { id: '3_4', label: strings.servings_3_4 },
  ];
  const fatFilterChoices = [
    { id: '10_less', label: strings.grams_10_less },
    { id: '10_20', label: strings.grams_10_20 },
  ];
  const proteinFilterChoices = [
    { id: '10_less', label: strings.grams_10_less },
    { id: '10_20', label: strings.grams_10_20 },
  ];
  const carbonhydratesFilterChoices = [
    { id: '10_less', label: strings.grams_10_less },
    { id: '10_20', label: strings.grams_10_20 },
  ];

  const load = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const mealPlanID = urlParams.get('id');
    dispatch(setMealPlanID(mealPlanID));
  };

  useEffect(() => {
    load();
  }, []);

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
      await fetch(`${apiUrl}/v4/recipes/search?session=${cookies.session}&query=${keywords}`, {
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
        .then((data) => {
          const recipes = data.map((item) => ({
            key: item.recipeID,
            primaryText: item.title,
            recipe: item,
          }));
          dispatch(setAutoComplete(recipes));
        });
    } else {
      dispatch(setAutoComplete(initialState.autoComplete));
    }
  };

  const handleAutoComplete = async (value) => {
    await fetch(`${apiUrl}/v4/meal-plans`, {
      method: 'patch',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session: cookies.session,
        mealPlanID: state.mealPlanID,
        recipeID: state.autoComplete[value].key,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`${res.status} ${res.statusText}`);
        };
      })
      .catch(console.log);
    if (history.length > 0) {
      history.back();
    }
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
            {/*
            <Row>
              <Cell columns={12}>
                <Body1>{strings.choose_calories}</Body1>
                <MaterialFilterChips
                  selectedChipIds={state.caloriesFilter}
                  handleSelect={(value) => dispatch(setCaloriesFilter(value))}
                  choices={caloriesFilterChoices}
                />
              </Cell>
              <Cell columns={12}>
                <Body1>{strings.choose_servings}</Body1>
                <MaterialFilterChips
                  selectedChipIds={state.servingsFilter}
                  handleSelect={(value) => dispatch(setServingsFilter(value))}
                  choices={servingsFilterChoices}
                />
              </Cell>
              <Cell columns={12}>
                <Body1>{strings.choose_fat}</Body1>
                <MaterialFilterChips
                  selectedChipIds={state.fatFilter}
                  handleSelect={(value) => dispatch(setFatFilter(value))}
                  choices={fatFilterChoices}
                />
              </Cell>
              <Cell columns={12}>
                <Body1>{strings.choose_protein}</Body1>
                <MaterialFilterChips
                  selectedChipIds={state.proteinFilter}
                  handleSelect={(value) => dispatch(setProteinFilter(value))}
                  choices={proteinFilterChoices}
                />
              </Cell>
              <Cell columns={12}>
                <Body1>{strings.choose_carbonhydrates}</Body1>
                <MaterialFilterChips
                  selectedChipIds={state.carbonhydratesFilter}
                  handleSelect={(value) => dispatch(setCarbonhydratesFilter(value))}
                  choices={carbonhydratesFilterChoices}
                />
              </Cell>
            </Row>
            */}
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
