import React, { Component } from 'react';
import Dialog, { DialogTitle, DialogContent, DialogFooter, DialogButton } from '@material/react-dialog';
import MaterialFilledTextField from './MaterialFilledTextField';
import '@material/react-dialog/dist/dialog.css';
import LocalizedStrings from 'react-localization';

let strings = new LocalizedStrings({
  en: {
    create_meal_plan: 'CREATE MEAL PLAN',
    meal_plan_name: 'Name',
    meal_plan_name_helper: 'This is the name of your meal plan',
    information: 'Information',
    information_helper: 'This is the description of your meal plan.',
    calories: 'Calories',
    calories_helper: 'This is how many calories in your meal plan.',
    date: 'Date',
    date_helper:'Date for this meal plan.',
    cancel: 'Cancel',
    okay: 'OK',
  },
});

function MealPlanDialog(props) {
  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <DialogTitle>{strings.create_meal_plan}</DialogTitle>
      <DialogContent>
        <MaterialFilledTextField
          label={strings.meal_plan_name}
          helperText={strings.meal_plan_name_helper}
          value={props.meal_plan_name}
          onChange={props.onChange1}
          onTrailingIconSelect={props.onTrailingIconSelect1}
        ></MaterialFilledTextField>
        <MaterialFilledTextField
          label={strings.information}
          helperText={strings.information_helper}
          value={props.information}
          onChange={props.onChange2}
          onTrailingIconSelect={props.onTrailingIconSelect2}
        ></MaterialFilledTextField>
        <MaterialFilledTextField
          label={strings.calories}
          helperText={strings.calories_helper}
          value={props.calories}
          onChange={props.onChange3}
          onTrailingIconSelect={props.onTrailingIconSelect3}
        ></MaterialFilledTextField>
        <MaterialFilledTextField
          label={strings.date}
          helperText={strings.date_helper}
          value={props.date}
          onChange={props.onChange4}
          onTrailingIconSelect={props.onTrailingIconSelect4}
        ></MaterialFilledTextField>
      </DialogContent>
      <DialogFooter>
        <DialogButton action='dismiss'>{strings.cancel}</DialogButton>
        <DialogButton action='confirm' isDefault>{strings.okay}</DialogButton>
      </DialogFooter>
    </Dialog>
  );
}

export default MealPlanDialog;
