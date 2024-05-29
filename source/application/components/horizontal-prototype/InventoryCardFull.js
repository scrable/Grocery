import React, { useState } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import LocalizedStrings from 'react-localization';

import MaterialIcon from '@material/react-material-icon';
import {
  Headline6, Subtitle1, Subtitle2, Body2,
} from './MaterialTypography';
import MaterialCard, {
  CardMedia, CardActions, CardActionButtons, CardActionIcons,
} from './MaterialCard';
import MaterialButton from './MaterialButton';
import '@material/react-material-icon/dist/material-icon.css';

function InventoryCardFull(props) {
  const [cardOpen, setCardOpen] = useState(false);

  const toggleCard = () => {
    setCardOpen(!cardOpen);
  };

  const {
    mainImage, mainText1, mainText2, onClickAction1, actionText1, bodyText,
  } = props;

  return (
    <MaterialCard className="mdc-card">
      <CardMedia wide imageUrl={mainImage} />
      <View style={{ padding: 16 }}>
        <Headline6 style={{ margin: 0 }}>{mainText1}</Headline6>
        <Subtitle2 style={{ margin: 0 }}>{mainText2}</Subtitle2>
      </View>
      <CardActions>
        <CardActionButtons>
          <MaterialButton onClick={onClickAction1}>{actionText1}</MaterialButton>
        </CardActionButtons>
        <CardActionIcons>
          <MaterialIcon
            aria-label={cardOpen && 'expand_less' || 'expand_more'}
            hasRipple
            icon={cardOpen && 'expand_less' || 'expand_more'}
            onClick={toggleCard}
          />
        </CardActionIcons>
      </CardActions>
      <View style={{ padding: 16 }}>
        <Subtitle1 style={{ margin: 0 }}>{strings.log}</Subtitle1>
        <Body2 style={{ marginBottom: 0 }}>{bodyText}</Body2>
      </View>
    </MaterialCard>
  );
}

let strings = new LocalizedStrings({
  en: {
    log: 'Log',
  },
});

InventoryCardFull.propTypes = {
  mainImage: PropTypes.string.isRequired,
  mainText1: PropTypes.string.isRequired,
  mainText2: PropTypes.string.isRequired,
  onClickAction1: PropTypes.func.isRequired,
  actionText1: PropTypes.string.isRequired,
  bodyText: PropTypes.string.isRequired,
};

export default InventoryCardFull;
