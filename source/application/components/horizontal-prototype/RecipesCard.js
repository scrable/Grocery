import React, { } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import MaterialIcon from '@material/react-material-icon';
import { Headline6, Subtitle2 } from './MaterialTypography';
import MaterialCard, {
  CardPrimaryContent, CardMedia, CardActions, CardActionButtons, CardActionIcons,
} from './MaterialCard';
import MaterialButton from './MaterialButton';
import '@material/react-material-icon/dist/material-icon.css';

function RecipesCard(props) {
  const {
    onClickMain, mainImage, mainText1, mainText2, onClickAction1, actionText1, onClickAction2, actionText2, onClickAction3,
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
        {actionText1 && (
        <CardActionButtons>
          <MaterialButton onClick={onClickAction1}>{actionText1}</MaterialButton>
        </CardActionButtons>
        )}
        {!actionText1 && (
        <CardActionIcons>
          <MaterialIcon
            aria-label="favorite"
            hasRipple
            icon="favorite"
            onClick={onClickAction1}
          />
          <MaterialIcon
            aria-label="history"
            hasRipple
            icon="history"
            onClick={onClickAction2}
          />
          <MaterialIcon
            aria-label="add_shopping_cart"
            hasRipple
            icon="add_shopping_cart"
            onClick={onClickAction3}
          />
        </CardActionIcons>
        )}
      </CardActions>
    </MaterialCard>
  );
}

RecipesCard.propTypes = {
  onClickMain: PropTypes.func,
  mainImage: PropTypes.string.isRequired,
  mainText1: PropTypes.string.isRequired,
  mainText2: PropTypes.string.isRequired,
  onClickAction1: PropTypes.func.isRequired,
  actionText1: PropTypes.string,
  onClickAction2: PropTypes.func,
  onClickAction3: PropTypes.func,
};

export default RecipesCard;
