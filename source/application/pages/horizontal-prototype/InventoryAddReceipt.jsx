import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import LocalizedStrings from 'react-localization';

import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { DrawerAppContent } from '@material/react-drawer';
import { TopAppBarFixedAdjust } from '@material/react-top-app-bar';
import { Cell, Grid, Row } from '@material/react-layout-grid';
import '@material/react-layout-grid/dist/layout-grid.css';

import MaterialTopAppBarDialog from '../../components/horizontal-prototype/MaterialTopAppBarDialog';
import MaterialSnackbar from '../../components/horizontal-prototype/MaterialSnackbar';

// import Icon from 'react-icons/md';
// import Svg { Ellipse } from 'react-native-svg';

import { apiUrl } from '../../url';

const strings = new LocalizedStrings({
  en: {
    center_receipt: 'Center front of receipt inside box area',
  },
});
const styles = StyleSheet.create({
  rect1: {
    minWidth: 360,
    width: '100%',
    minHeight: 684,
    maxHeight: '100%',
    backgroundColor: 'rgba(10,9,9,1)',
    alignSelf: 'center',
  },
  rect2: {
    width: 330,
    height: 550,
    backgroundColor: 'rgba(0,0,0,1)',
    borderColor: 'rgba(74,74,74,1)',
    borderWidth: 5,
  },
  icon1: {
    color: 'rgba(255,255,255,1)',
    fontSize: 21,
    height: 21,
    width: 18,
    marginTop: 24,
    marginLeft: 269,
  },
  rect2Stack: {
    width: 330,
    height: 550,
    margin: 'auto',
  },
  ellipse2: {
    top: 0,
    width: 62,
    height: 62,
    position: 'absolute',
    left: 0,
  },
  ellipse3: {
    top: 6,
    width: 47,
    height: 47,
    position: 'absolute',
    left: 7,
  },
  ellipse2Stack: {
    width: 62,
    height: 62,
    marginTop: 27,
    marginLeft: 149,
  },
});

export default () => {
  const [cookies, setCookie] = useCookies(['session', 'userID']);
  const [toast, setToast] = useState(strings.center_receipt);

  const handleGoBack = () => {
    if (history.length > 0) {
      history.back();
    }
  };

  return (
    <View className="drawer-container">
      <MaterialTopAppBarDialog
        icon2="add"
        onClick1={handleGoBack}
        onClick2={() => window.location.href = '..'}
      />
      <TopAppBarFixedAdjust className="top-app-bar-fix-adjust">
        <DrawerAppContent className="drawer-app-content">
          <Grid style={{ height: useWindowDimensions().height - 64 }}>
            <Row>
              <Cell columns={12}>
                <View style={styles.rect1}>
                  <View style={styles.rect2Stack}>
                    <View style={styles.rect2}>
                      {/* <Icon name='info-circle' style={styles.icon1}></Icon> */}
                    </View>
                  </View>
                  {/*
                  <View style={styles.ellipse2Stack}>
                    <Svg viewBox='0 0 61.57 62.24' style={styles.ellipse2}>
                      <Ellipse
                        strokeWidth={1}
                        fill='rgba(0,0,0,1)'
                        stroke='rgba(230, 230, 230,1)'
                        cx={31}
                        cy={31}
                        rx={30}
                        ry={31}
                      ></Ellipse>
                    </Svg>
                    <Svg viewBox='0 0 47.49 46.85' style={styles.ellipse3}>
                      <Ellipse
                        strokeWidth={1}
                        fill='rgba(255,255,255,1)'
                        stroke='rgba(230, 230, 230,1)'
                        cx={24}
                        cy={23}
                        rx={23}
                        ry={23}
                      ></Ellipse>
                    </Svg>
                  </View>
                  */}
                </View>
              </Cell>
            </Row>
          </Grid>
        </DrawerAppContent>
        {toast && (
        <MaterialSnackbar message={toast} onClose={() => setToast('')} />
        )}
      </TopAppBarFixedAdjust>
    </View>
  );
};
