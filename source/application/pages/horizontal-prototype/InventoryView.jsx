import React, { useEffect, useReducer, useState } from 'react';
import { useCookies } from 'react-cookie';
import LocalizedStrings from 'react-localization';
import Moment from 'moment';

import { View, useWindowDimensions } from 'react-native';
import { DrawerAppContent } from '@material/react-drawer';
import { TopAppBarFixedAdjust } from '@material/react-top-app-bar';
import { Cell, Grid, Row } from '@material/react-layout-grid';
import '@material/react-layout-grid/dist/layout-grid.css';

import MaterialTopAppBarDialog from '../../components/horizontal-prototype/MaterialTopAppBarDialog';
import MaterialSnackbar from '../../components/horizontal-prototype/MaterialSnackbar';
import InventoryCardFull from '../../components/horizontal-prototype/InventoryCardFull';
import InventoryConsumeDialog from '../../components/horizontal-prototype/InventoryConsumeDialog';
import InventoryDiscardDialog from '../../components/horizontal-prototype/InventoryDiscardDialog';


import {
  setInventoryID,
  setName,
  setImage,
  setTotalQuantity,
  setUnit,
  setPrice,
  setExpirationDate,
  setHistory,
  setDialogOpen,
  setDialogQuantity,
  setDialogUnit,
} from '../../actions/horizontal-prototype/InventoryView';
import { inventoryViewReducer, initialState } from '../../reducers/horizontal-prototype/InventoryView';
import { apiUrl } from '../../url';

const strings = new LocalizedStrings({
  en: {
    expiring: 'Expiring',
    expired: 'Expired',
    discard: 'Discard',
    added: 'added',
    consumed: 'consumed',
    discarded: 'discarded',
    toast_missing: 'Oops. Information is missing.',
    toast_consumed: 'Item consumed from inventory.',
    toast_discarded: 'Item discarded from inventory.',
  },
});

export default () => {
  const [cookies, setCookie] = useCookies(['session', 'userID']);
  const [state, dispatch] = useReducer(inventoryViewReducer, initialState);
  const [toast, setToast] = useState('');

  const load = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    await fetch(`${apiUrl}/v4/inventory?session=${cookies.session}&inventoryID=${urlParams.get('id')}`, {
      method: 'get',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status !== 406) {
            throw new Error(`${res.status} ${res.statusText}`);
          } else {
            return null;
          }
        }
        return res.json();
      })
      .then(async (data) => {
        if (data !== null) {
          await fetch(`${apiUrl}/v4/ingredients?session=${cookies.session}&ingredientIDs=${data.ingredientID}`, {
            method: 'get',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          })
            .then((res2) => {
              if (!res2.ok) {
                if (res2.status !== 406) {
                  throw new Error(`${res2.status} ${res2.statusText}`);
                } else {
                  return null;
                }
              }
              return res2.json();
            })
            .then(async (data2) => {
              if (data2 !== null) {
                await fetch(`${apiUrl}/v4/users?session=${cookies.session}`, {
                  method: 'get',
                  headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                  },
                })
                  .then((res3) => {
                    if (!res3.ok) {
                      if (res3.status !== 406) {
                        throw new Error(`${res3.status} ${res3.statusText}`);
                      } else {
                        return null;
                      }
                    }
                    return res3.json();
                  })
                  .then((data3) => {
                    dispatch(setInventoryID(data.inventoryID));
                    dispatch(setName(data2[0].name));
                    dispatch(setImage(data2[0].image));
                    dispatch(setTotalQuantity(data.totalQuantity));
                    dispatch(setUnit(data.unit));
                    dispatch(setPrice(data.price));
                    dispatch(setExpirationDate(data.expirationDate));
                    const history = data.history.map((item) => {
                      const user = data3.find((item2) => item.userID === item2.userID);
                      let value = `${user.name} `;
                      switch (item.action) {
                        case 'added':
                          value += strings.added;
                          break;
                        case 'consumed':
                          value += strings.consumed;
                          break;
                        case 'discarded':
                          value += strings.discarded;
                          break;
                      }
                      const actionTS = Moment.utc(item.actionTS);
                      value += ` ${item.quantity} ${item.unit} on ${actionTS.fromNow()}.`;
                      return value;
                    });
                    dispatch(setHistory(history));
                  });
              } else {
                setToast(strings.toast_missing);
              }
            });
        } else {
          setToast(strings.toast_missing);
        }
      })
      .catch((error) => setToast(error.toString()));
  };

  useEffect(() => {
    load();
  }, []);

  const handleGoBack = () => {
    if (history.length > 0) {
      history.back();
    }
  };

  const toggleDialog = (dialogOpen) => {
    dispatch(setDialogOpen(dialogOpen));
  };

  const handleConsume = () => {
    toggleDialog('consume');
  };

  const handleDiscard = () => {
    toggleDialog('discard');
  };

  const handleSubmission = async (value) => {
    const action = state.dialogOpen;
    toggleDialog(initialState.dialogOpen);
    if (value === 'confirm') {
      switch (action) {
        case 'consume':
        case 'discard':
          await fetch(`${apiUrl}/v4/inventory/${action}`, {
            method: 'post',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              session: cookies.session,
              userID: cookies.userID,
              inventoryID: state.inventoryID,
              quantity: state.dialogQuantity,
              unit: state.dialogUnit,
            }),
          })
            .then((res) => {
              if (!res.ok) {
                throw new Error(`${res.status} ${res.statusText}`);
              }
            })
            .catch((error) => setToast(error.toString()));
          switch (action) {
            case 'consume':
              setToast(strings.toast_consumed);
              break;
            case 'discard':
              setToast(strings.toast_discarded);
              break;
          }
          load();
          break;
      }
    }
  };

  return (
    <>
      <View className="drawer-container">
        <MaterialTopAppBarDialog
          onClick1={handleGoBack}
        />
        <TopAppBarFixedAdjust className="top-app-bar-fix-adjust">
          <DrawerAppContent className="drawer-app-content">
            <Grid style={{ height: useWindowDimensions().height - 64 }}>
              <Row>
                <Cell desktopColumns={6} phoneColumns={4} tabletColumns={8}>
                  <InventoryCardFull
                    mainText1={state.name}
                    mainText2={(() => {
                      let value = `${state.totalQuantity} ${state.unit}`;
                      if (state.expirationDate) {
                        value += ' | ';
                        const expirationDate = Moment.utc(state.expirationDate);
                        if (expirationDate.unix() >= Moment.utc()) {
                          value += strings.expiring;
                        } else {
                          value += strings.expired;
                        }
                        value += ` ${expirationDate.fromNow()}`;
                      }
                      if (state.price) {
                        value += ` | $${state.price}`;
                      }
                      return value;
                    })()}
                    actionText1={strings.discard}
                    onClickAction1={handleDiscard}
                    bodyText={state.history}
                    mainImage={state.image}
                  />
                </Cell>
              </Row>
            </Grid>
          </DrawerAppContent>
          {toast && (
            <MaterialSnackbar message={toast} onClose={() => setToast('')} />
          )}
        </TopAppBarFixedAdjust>
      </View>
      <InventoryConsumeDialog
        open={state.dialogOpen === 'consume'}
        quantity={state.dialogQuantity}
        unit={state.dialogUnit}
        onChange1={(e) => dispatch(setDialogQuantity(e.target.value))}
        onChange2={(e) => dispatch(setDialogUnit(e.target.value))}
        onTrailingIconSelect1={() => dispatch(setDialogQuantity(initialState.dialogQuantity))}
        onTrailingIconSelect2={() => dispatch(setDialogUnit(initialState.dialogUnit))}
        onClose={handleSubmission}
      />
      <InventoryDiscardDialog
        open={state.dialogOpen === 'discard'}
        quantity={state.dialogQuantity}
        unit={state.dialogUnit}
        onChange1={(e) => dispatch(setDialogQuantity(e.target.value))}
        onChange2={(e) => dispatch(setDialogUnit(e.target.value))}
        onTrailingIconSelect1={() => dispatch(setDialogQuantity(initialState.dialogQuantity))}
        onTrailingIconSelect2={() => dispatch(setDialogUnit(initialState.dialogUnit))}
        onClose={handleSubmission}
      />
    </>
  );
};
