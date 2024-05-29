import React, { useState } from 'react';
import { View } from 'react-native';
import LocalizedStrings from 'react-localization';
import PropTypes from 'prop-types';

import MaterialIcon from '@material/react-material-icon';
import {
  Headline6, Subtitle1, Subtitle2, Body2,
} from './MaterialTypography';
import MaterialCard, { CardMedia, CardActions, CardActionIcons } from './MaterialCard';
import '@material/react-material-icon/dist/material-icon.css';

function RecipesCardFull(props) {
  const [cardOpen, setCardOpen] = useState(false);

  const toggleCard = () => {
    setCardOpen(!cardOpen);
  };

  const {
    mainImage, mainText1, mainText2, onClickAction1, onClickAction2, onClickAction3, bodyText,
  } = props;

  return (
    <MaterialCard className="mdc-card">
      <CardMedia wide imageUrl={mainImage} />
      <View style={{ padding: 16 }}>
        <Headline6 style={{ margin: 0 }}>{mainText1}</Headline6>
        <Subtitle2 style={{ margin: 0 }}>{mainText2}</Subtitle2>
      </View>
      <CardActions>
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
          <MaterialIcon
            aria-label={cardOpen && 'expand_less' || 'expand_more'}
            hasRipple
            icon={cardOpen && 'expand_less' || 'expand_more'}
            onClick={toggleCard}
          />
        </CardActionIcons>
      </CardActions>
      <View style={{ padding: 16 }}>
        <Subtitle1 style={{ margin: 0 }}>{strings.instructions}</Subtitle1>
        <Body2 style={{ marginBottom: 0 }}>{bodyText}</Body2>
      </View>
    </MaterialCard>
  );
}

let strings = new LocalizedStrings({
  en: {
    instructions: 'Instructions',
  },
});

RecipesCardFull.propTypes = {
  mainImage: PropTypes.string.isRequired,
  mainText1: PropTypes.string.isRequired,
  mainText2: PropTypes.string.isRequired,
  bodyText: PropTypes.string.isRequired,
  onClickAction1: PropTypes.func.isRequired,
  onClickAction2: PropTypes.func.isRequired,
  onClickAction3: PropTypes.func.isRequired,
};

export default RecipesCardFull;
