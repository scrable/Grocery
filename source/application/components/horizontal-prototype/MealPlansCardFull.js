import React, { } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import LocalizedStrings from 'react-localization';

import {
  Headline6, Subtitle1, Subtitle2, Body2,
} from './MaterialTypography';
import MaterialCard from './MaterialCard';
import '@material/react-material-icon/dist/material-icon.css';

const strings = new LocalizedStrings({
  en: {
    info: 'Information',
  },
});

function MealPlansCardFull(props) {
  const {
    mainText1, mainText2, bodyText,
  } = props;

  return (
    <MaterialCard className="mdc-card">
      <View style={{ padding: 16 }}>
        <Headline6 style={{ margin: 0 }}>{mainText1}</Headline6>
        <Subtitle2 style={{ margin: 0 }}>{mainText2}</Subtitle2>
      </View>
      <View style={{ padding: 16 }}>
        <Subtitle1 style={{ margin: 0 }}>{strings.info}</Subtitle1>
        <Body2 style={{ marginBottom: 0 }}>{bodyText}</Body2>
      </View>
    </MaterialCard>
  );
}

MealPlansCardFull.propTypes = {
  mainText1: PropTypes.string.isRequired,
  mainText2: PropTypes.string.isRequired,
  bodyText: PropTypes.string.isRequired,
};

export default MealPlansCardFull;
