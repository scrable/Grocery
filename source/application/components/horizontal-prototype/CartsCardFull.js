import React, { useState } from 'react';
import { View } from 'react-native';
import LocalizedStrings from 'react-localization';
import PropTypes from 'prop-types';

import MaterialIcon from '@material/react-material-icon';
import {
  Headline6, Subtitle2,
} from './MaterialTypography';
import MaterialCard, {
  CardActions, CardActionButtons, CardActionIcons,
} from './MaterialCard';
import MaterialButton from './MaterialButton';
import '@material/react-material-icon/dist/material-icon.css';

function CartsCardFull(props) {
  const [cardOpen, setCardOpen] = useState(false);

  const toggleCard = () => {
    setCardOpen(!cardOpen);
  };

  const {
    mainText1, mainText2, onClickAction1, actionText1,
  } = props;

  return (
    <MaterialCard className="mdc-card">
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
    </MaterialCard>
  );
}

const strings = new LocalizedStrings({
  en: {
    log: 'Log',
  },
});

CartsCardFull.propTypes = {
  mainText1: PropTypes.string.isRequired,
  mainText2: PropTypes.string.isRequired,
  onClickAction1: PropTypes.func.isRequired,
  actionText1: PropTypes.string.isRequired,
};

export default CartsCardFull;
