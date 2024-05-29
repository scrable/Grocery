import React, { } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import { Headline6, Subtitle2 } from './MaterialTypography';
import MaterialCard, {
  CardPrimaryContent, CardMedia, CardActions, CardActionButtons,
} from './MaterialCard';
import MaterialButton from './MaterialButton';

function InventoryCard(props) {
  const {
    onClickMain, mainImage, mainText1, mainText2, onClickAction1, onClickAction2, actionText1, actionText2,
  } = props;

  return (
    <MaterialCard className="mdc-card">
      <CardPrimaryContent onClick={onClickMain}>
        <CardMedia wide imageUrl={mainImage} />
        <View style={{ padding: 16 }}>
          <Headline6 style={{ margin: 0 }}>{mainText1}</Headline6>
          <Subtitle2 style={{ margin: 0 }}>{mainText2}</Subtitle2>
        </View>
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

InventoryCard.propTypes = {
  onClickMain: PropTypes.func.isRequired,
  mainImage: PropTypes.string.isRequired,
  mainText1: PropTypes.string.isRequired,
  mainText2: PropTypes.string.isRequired,
  onClickAction1: PropTypes.func.isRequired,
  onClickAction2: PropTypes.func.isRequired,
  actionText1: PropTypes.string.isRequired,
  actionText2: PropTypes.string.isRequired,
};

export default InventoryCard;
