import React, { useReducer } from 'react';
import { useCookies } from 'react-cookie';
import LocalizedStrings from 'react-localization';

import { View, useWindowDimensions } from 'react-native';
import { DrawerAppContent } from '@material/react-drawer';
import { TopAppBarFixedAdjust } from '@material/react-top-app-bar';
import { Cell, Grid, Row } from '@material/react-layout-grid';
import MaterialIcon from '@material/react-material-icon';
import '@material/react-layout-grid/dist/layout-grid.css';
import '@material/react-material-icon/dist/material-icon.css';

import MaterialTopAppBarDialog from '../../components/horizontal-prototype/MaterialTopAppBarDialog';
import MaterialFab from '../../components/horizontal-prototype/MaterialFab';
import MaterialOutlinedTextField from '../../components/horizontal-prototype/MaterialOutlinedTextField';

import { setName, setServings, setCookingTime } from '../../actions/horizontal-prototype/RecipesCreate';
import { recipesCreateReducer, initialState } from '../../reducers/horizontal-prototype/RecipesCreate';
import { apiUrl } from '../../url';

const strings = new LocalizedStrings({
  en: {
    name: 'Name',
    name_helper: 'This is the name of the recipe.',
    servings: 'Servings',
    servings_helper: 'This is the servings of this recipe.',
    cooking_time: 'Cooking time',
    cooking_time_helper: 'This is the cooking time of this recipe in minutes.',
  },
});

export default () => {
  const [cookies, setCookie] = useCookies(['session', 'userID']);
  const [state, dispatch] = useReducer(recipesCreateReducer, initialState);

  const handleGoBack = () => {
    if (history.length > 0) {
      history.back();
    }
  };

  const handleSave = async () => {
    // TODO: fetch to post
    if (history.length > 0) {
      history.back();
    }
  };

  return (
    <View className="drawer-container">
      <MaterialTopAppBarDialog
        onClick1={handleGoBack}
      />
      <TopAppBarFixedAdjust className="top-app-bar-fix-adjust">
        <DrawerAppContent className="drawer-app-content">
          <Grid style={{ height: useWindowDimensions().height - 64 }}>
            <Row>
              <Cell columns={12}>
                <MaterialOutlinedTextField
                  label={strings.name}
                  helperText={strings.name_helper}
                  value={state.name}
                  onChange={(e) => dispatch(setName(e.target.value))}
                  onTrailingIconSelect={() => dispatch(setName(initialState.name))}
                />
              </Cell>
              <Cell desktopColumns={6} phoneColumns={4} tabletColumns={4}>
                <MaterialOutlinedTextField
                  label={strings.servings}
                  helperText={strings.servings_helper}
                  value={state.servings}
                  onChange={(e) => dispatch(setServings(e.target.value))}
                  onTrailingIconSelect={() => dispatch(setServings(initialState.servings))}
                />
              </Cell>
              <Cell desktopColumns={6} phoneColumns={4} tabletColumns={4}>
                <MaterialOutlinedTextField
                  label={strings.cooking_time}
                  helperText={strings.cooking_time_helper}
                  value={state.cooking_time}
                  onChange={(e) => dispatch(setCookingTime(e.target.value))}
                  onTrailingIconSelect={() => dispatch(setCookingTime(initialState.cookingTime))}
                />
              </Cell>
            </Row>
          </Grid>
        </DrawerAppContent>
        <MaterialFab
          icon={<MaterialIcon icon="check" />}
          style={{ position: 'absolute', right: 16, bottom: 16 }}
          onClick={handleSave}
        />
      </TopAppBarFixedAdjust>
    </View>
  );
};
