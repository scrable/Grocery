import React, { } from 'react';
import PropTypes from 'prop-types';

import { Headline6, Subtitle2, Body2 } from './MaterialTypography';
import MaterialCard, {
  CardPrimaryContent, CardMedia, CardActions, CardActionButtons,
} from './MaterialCard';
import MaterialButton from './MaterialButton';

function CartsCard(props) {
  const {
    mainImage, mainText1, mainText2, bodyText, onClickAction1, actionText1, onClickAction2, actionText2,
  } = props;

  return (
    <MaterialCard className="mdc-card">
      <CardPrimaryContent style={{ padding: 16 }}>
        <CardMedia wide imageUrl={mainImage} />
        <Headline6 style={{ margin: 0 }}>{mainText1}</Headline6>
        <Subtitle2 style={{ margin: 0 }}>{mainText2}</Subtitle2>
        <Body2>{bodyText}</Body2>
      </CardPrimaryContent>
      <CardActions>
        <CardActionButtons>
          <MaterialButton onClick={onClickAction1}>{actionText1}</MaterialButton>
          <MaterialButton onClick={onClickAction2}>{actionText2}</MaterialButton>
        </CardActionButtons>
      </CardActions>
    </MaterialCard>
  );
}

CartsCard.propTypes = {
  mainImage: PropTypes.string.isRequired,
  mainText1: PropTypes.string.isRequired,
  mainText2: PropTypes.string.isRequired,
  bodyText: PropTypes.string.isRequired,
  onClickAction1: PropTypes.func.isRequired,
  actionText1: PropTypes.string.isRequired,
  onClickAction2: PropTypes.func.isRequired,
  actionText2: PropTypes.string.isRequired,
};

export default CartsCard;
