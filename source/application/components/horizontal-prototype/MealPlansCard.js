import React from 'react';
import PropTypes from 'prop-types';

import { Headline6, Subtitle2, Body2 } from './MaterialTypography';
import MaterialCard, { CardPrimaryContent, CardActions, CardActionButtons } from './MaterialCard';
import MaterialButton from './MaterialButton';

const MealPlansCard = (props) => {
  const {
    onClickMain, mainText1, mainText2, bodyText, onClickAction1, actionText1,
  } = props;

  return (
    <MaterialCard className="mdc-card">
      <CardPrimaryContent onClick={onClickMain} style={{ padding: 16 }}>
        <Headline6 style={{ margin: 0 }}>{mainText1}</Headline6>
        <Subtitle2 style={{ margin: 0 }}>{mainText2}</Subtitle2>
        <Body2>{bodyText}</Body2>
      </CardPrimaryContent>
      <CardActions>
        <CardActionButtons>
          <MaterialButton onClick={onClickAction1}>{actionText1}</MaterialButton>
        </CardActionButtons>
      </CardActions>
    </MaterialCard>
  );
};

MealPlansCard.propTypes = {
  onClickMain: PropTypes.func.isRequired,
  mainText1: PropTypes.string.isRequired,
  mainText2: PropTypes.string.isRequired,
  bodyText: PropTypes.string.isRequired,
  onClickAction1: PropTypes.func.isRequired,
  actionText1: PropTypes.string.isRequired,
};

export default MealPlansCard;
