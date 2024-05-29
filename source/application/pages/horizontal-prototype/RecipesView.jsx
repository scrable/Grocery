import React, { useEffect, useReducer, useState } from 'react';
import { useCookies } from 'react-cookie';
import LocalizedStrings from 'react-localization';

import { View, useWindowDimensions } from 'react-native';
import { DrawerAppContent } from '@material/react-drawer';
import { TopAppBarFixedAdjust } from '@material/react-top-app-bar';
import { Cell, Grid, Row } from '@material/react-layout-grid';
import '@material/react-layout-grid/dist/layout-grid.css';

import MaterialTopAppBarDialog from '../../components/horizontal-prototype/MaterialTopAppBarDialog';
import MaterialSnackbar from '../../components/horizontal-prototype/MaterialSnackbar';
import RecipesCardFull from '../../components/horizontal-prototype/RecipesCardFull';
import IngredientsListCard from '../../components/horizontal-prototype/IngredientsListCard';

import {
  setRecipeID,
  setTitle,
  setImage,
  setServings,
  setCookingTime,
  setInstructions,
  setIngredients,
} from '../../actions/horizontal-prototype/RecipesView';
import { recipesViewReducer, initialState } from '../../reducers/horizontal-prototype/RecipesView';
import { apiUrl } from '../../url';

const strings = new LocalizedStrings({
  en: {
    servings: 'servings',
    minutes: 'minutes',
    toast_missing: 'Oops. Information is missing.',
    toast_favorited: 'Recipe favorited.',
    toast_added_to_cart: 'Recipe added to cart.',
  },
});

export default () => {
  const [cookies, setCookie] = useCookies(['session', 'userID']);
  const [state, dispatch] = useReducer(recipesViewReducer, initialState);
  const [toast, setToast] = useState('');

  const load = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    await fetch(`${apiUrl}/v4/recipes?session=${cookies.session}&recipeIDs=${urlParams.get('id')}`, {
      method: 'get',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status !== 406) {
            throw new Error(`${res.status} ${res.statusText}`);
          } else {
            return null;
          }
        }
        return res.json();
      })
      .then(async (data) => {
        if (data !== null) {
          const ingredientIDs = data[0].ingredients.map((item) => item.ingredientID);
          await fetch(`${apiUrl}/v4/ingredients?session=${cookies.session}&ingredientIDs=${ingredientIDs.join(',')}`, {
            method: 'get',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          })
            .then((res2) => {
              if (!res2.ok) {
                if (res2.status !== 406) {
                  throw new Error(`${res2.status} ${res2.statusText}`);
                } else {
                  return null;
                }
              }
              return res2.json();
            })
            .then((data2) => {
              if (data2 !== null) {
                dispatch(setRecipeID(data[0].recipeID));
                dispatch(setTitle(data[0].title));
                dispatch(setImage(data[0].image));
                dispatch(setServings(data[0].servings));
                dispatch(setCookingTime(data[0].cookingTime));
                dispatch(setInstructions(data[0].instructions));
                const ingredients = data[0].ingredients.map((item) => {
                  const ingredient = data2.find((item2) => item.ingredientID === item2.ingredientID);
                  return {
                    primaryText: ingredient.name,
                    secondaryText: `${item.quantity} ${item.unit}`,
                  };
                });
                dispatch(setIngredients(ingredients));
              } else {
                setToast(strings.toast_missing);
              }
            });
        } else {
          setToast(strings.toast_missing);
        }
      })
      .catch((error) => setToast(error.toString()));
  };

  useEffect(() => {
    load();
  }, []);

  const handleGoBack = () => {
    if (history.length > 0) {
      history.back();
    }
  };

  const handleFavorite = async (value) => {
    await fetch(`${apiUrl}/v4/recipes/favorite`, {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session: cookies.session,
        userID: cookies.userID,
        recipeID: value,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`${res.status} ${res.statusText}`);
        }
      })
      .catch((error) => setToast(error.toString()));
    setToast(strings.toast_favorited);
  };

  const handleHistory = async () => {
    // TODO: fetch
  };

  const handleAddToCart = async (value) => {
    // TODO: fetch
    await fetch(`${apiUrl}/v4/carts/recipe`, {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session: cookies.session,
        userID: cookies.userID,
        recipeID: value,
      }),
    })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`${res.status} ${res.statusText}`);
          }
        })
        .catch((error) => setToast(error.toString()));
    setToast(strings.toast_added_to_cart);
    load();
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
              <Cell desktopColumns={6} phoneColumns={4} tabletColumns={8}>
                <RecipesCardFull
                  mainText1={state.title}
                  mainText2={`${state.servings} ${strings.servings} | ${state.cookingTime} ${strings.minutes}`}
                  bodyText={state.instructions}
                  onClickAction1={() => handleFavorite(state.recipeID)}
                  onClickAction2={handleHistory}
                  onClickAction3={() => handleAddToCart(state.recipeID)}
                  mainImage={state.image}
                />
              </Cell>
              <Cell desktopColumns={6} phoneColumns={4} tabletColumns={8}>
                <IngredientsListCard
                  list1={state.ingredients}
                  list2={[]}
                />
              </Cell>
            </Row>
          </Grid>
        </DrawerAppContent>
        {toast && (
          <MaterialSnackbar message={toast} onClose={() => setToast('')} />
        )}
      </TopAppBarFixedAdjust>
    </View>
  );
};
