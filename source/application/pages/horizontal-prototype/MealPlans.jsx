import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import LocalizedStrings from 'react-localization';

import { View, useWindowDimensions } from 'react-native';
import { TopAppBarFixedAdjust } from '@material/react-top-app-bar';
import { DrawerAppContent } from '@material/react-drawer';
import { Cell, Grid, Row } from '@material/react-layout-grid';
import '@material/react-layout-grid/dist/layout-grid.css';

import MaterialIcon from '@material/react-material-icon';
import MaterialTopAppBar from '../../components/horizontal-prototype/MaterialTopAppBar';
import MaterialDrawer from '../../components/horizontal-prototype/MaterialDrawer';
import MaterialFab from '../../components/horizontal-prototype/MaterialFab';
import MealPlansCard from '../../components/horizontal-prototype/MealPlansCard';
import MaterialSnackbar from '../../components/horizontal-prototype/MaterialSnackbar';
import MealPlanDialog from '../../components/horizontal-prototype/MealPlanDialog';

import { apiUrl } from '../../url';

const strings = new LocalizedStrings({
  en: {
    meal_plans: 'Meal Plans',
    calories: ' calories',
    view: 'View',
    toast_edited: 'Meal plan edited.',
  },
});

export default () => {
  const [cookies, setCookie] = useCookies(['session', 'userID']);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [mealPlans, setMealPlans] = useState([]);
  const [information, setInformation] = useState('');
  const [mealPlanName, setMealPlanName] = useState('');
  const [date, setDate] = useState('');
  const [calories, setCalories] = useState('');

  const dummySetup = () => {
    // TODO: hard code mealPlans array
    setMealPlans([
      {
        date: '2020-04-20',
        cal_per_day: 2000,
        description: 'Per day weight loss meal plan structured towards a healthy balanced diet. All Meals are designed to serve 1. Recipes create delicious meals with half the amount of calories you would expect. Shopping List included. 3 Meals per day.',
      },
      {
        date: '2020-04-21',
        cal_per_day: 1900,
        description: 'Per day meal plan created for children as per their needs. All Meals are designed to serve 1. Recipes create delicious meals with children\'s favourite meal options. 3 Meals per day.',
      },
      {
        date: '2020-04-22',
        cal_per_day: 2000,
        description: 'Meal plan designed for students structured towards healthy and nutritious meals. All Meals are designed to serve 1. This plan provides for breakfast, lunch, and dinner.',
      },
      {
        date: '2020-04-23',
        cal_per_day: 2200,
        description: 'Meal plan structured for a family towards healthy and nutritious meal. Considering the needs and dietary habits of all the family members Recipes create delicious meals with the required amount of calories. 3 Meals for a day.',
      },
      {
        date: '2020-04-24',
        cal_per_day: 2300,
        description: 'Meal plan E',
      },
      {
        date: '2020-04-25',
        cal_per_day: 1500,
        description: 'Meal plan F',
      },
      {
        date: '2020-04-26',
        cal_per_day: 2000,
        description: 'Meal plan G',
      },
    ]);
  };

  const load = async () => {
    // TODO: fetch
  };

  useEffect(() => {
    dummySetup();
    load();
  }, []);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const toggleDialog = () => {
    setDialogOpen(!dialogOpen);
  };

  const handleSubmission = async (value) => {
    toggleDialog();
    if (value === 'confirm') {
      /*
      await fetch(`${apiUrl}/v3/users`, {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session: cookies.session,
          name,
          role,
          intolerances,
        }),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`${res.status} ${res.statusText}`);
          }
          return res.json();
        })
        .then((data) => {
          setCookie('userID', data.userID, {
            path: '/horizontal-prototype/',
            // httpOnly: true,
            // expires: new Date(data.expires_ts),
          });
        })
        .catch((error) => setToast(error.toString()));
      setToast(strings.toast_created);
      */
      load();
    }
  };

  return (
    <>
      <View className="drawer-container">
        <MaterialTopAppBar
          title={strings.meal_plans}
          onClick1={toggleDrawer}
        />
        <TopAppBarFixedAdjust className="top-app-bar-fix-adjust">
          <MaterialDrawer
            open={drawerOpen}
            selectedIndex={4}
            onClose={toggleDrawer}
          />
          <DrawerAppContent className="drawer-app-content">
            <Grid style={{ height: useWindowDimensions().height - 64 }}>
              {mealPlans.length > 0 && (
              <Row>
                {mealPlans.map((item) => (
                  <Cell desktopColumns={6} phoneColumns={4} tabletColumns={4}>
                    <MealPlansCard
                      mainText1={item.date}
                      mainText2={item.cal_per_day + strings.calories}
                      bodyText={item.description}
                      actionText1={strings.view}
                      onClickMain={() => { window.location.href = 'view/?plannedTS='; }}
                      onClickAction1={() => { window.location.href = 'view/?plannedTS='; }}
                    />
                  </Cell>
                ))}
              </Row>
              )}
            </Grid>
          </DrawerAppContent>
          {toast && (
          <MaterialSnackbar message={toast} onClose={() => setToast('')} />
          )}
          <MaterialFab
            icon={<MaterialIcon icon="library_add" />}
            style={{ position: 'absolute', right: 16, bottom: 16 }}
            onClick={toggleDialog}
          />
        </TopAppBarFixedAdjust>
      </View>
      <MealPlanDialog
        open={dialogOpen}
        mealPlanName={mealPlanName}
        information={information}
        calories={calories}
        date={date}
        onChange1={(e) => setMealPlanName(e.target.value)}
        onChange2={(e) => setInformation(e.target.value)}
        onChange3={(e) => setCalories(e.target.value)}
        onChange4={(e) => setDate(e.target.value)}
        onTrailingIconSelect1={() => setMealPlanName('')}
        onTrailingIconSelect2={() => setInformation('')}
        onTrailingIconSelect3={() => setCalories('')}
        onTrailingIconSelect4={() => setDate('')}
        onClose={handleSubmission}
      />
    </>
  );
};
