import React, { } from 'react';
import PropTypes from 'prop-types';

import { Headline6, Subtitle2, Body2 } from './MaterialTypography';
import MaterialCard, {
  CardPrimaryContent, CardMedia, CardActions, CardActionButtons,
} from './MaterialCard';
import MaterialButton from './MaterialButton';

function ConsumptionCard(props) {
  const {
    onClickUser, userText1, userText2, onClickMain, mainImage, mainText, onClickAction1, onClickAction2, actionText1, actionText2,
  } = props;

  return (
    <MaterialCard className="mdc-card">
      <CardPrimaryContent onClick={onClickUser} style={{ padding: 16 }}>
        {/*
        <CardMedia square imageUrl={props.userImage} style={{width: 40, height: 40, borderRadius: 20, marginRight: 20}}></CardMedia>
        */}
        <Headline6 style={{ margin: 0 }}>{userText1}</Headline6>
        <Subtitle2 style={{ margin: 0 }}>{userText2}</Subtitle2>
      </CardPrimaryContent>
      <CardPrimaryContent onClick={onClickMain}>
        <CardMedia wide imageUrl={mainImage} />
        <Body2 style={{
          paddingTop: 16, paddingLeft: 16, paddingRight: 16, paddingBottom: 8,
        }}
        >
          {mainText}
        </Body2>
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

ConsumptionCard.propTypes = {
  onClickUser: PropTypes.func.isRequired,
  userText1: PropTypes.string.isRequired,
  userText2: PropTypes.string.isRequired,
  onClickMain: PropTypes.func.isRequired,
  mainImage: PropTypes.string.isRequired,
  mainText: PropTypes.string.isRequired,
  onClickAction1: PropTypes.func.isRequired,
  onClickAction2: PropTypes.func.isRequired,
  actionText1: PropTypes.string.isRequired,
  actionText2: PropTypes.string.isRequired,
};

export default ConsumptionCard;
