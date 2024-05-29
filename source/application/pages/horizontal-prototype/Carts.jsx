import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import LocalizedStrings from 'react-localization';

import { View, useWindowDimensions } from 'react-native';
import { TopAppBarFixedAdjust } from '@material/react-top-app-bar';
import { DrawerAppContent } from '@material/react-drawer';
import { Cell, Grid, Row } from '@material/react-layout-grid';
import '@material/react-layout-grid/dist/layout-grid.css';

import MaterialTopAppBar from '../../components/horizontal-prototype/MaterialTopAppBar';
import MaterialDrawer from '../../components/horizontal-prototype/MaterialDrawer';
import MaterialSnackbar from '../../components/horizontal-prototype/MaterialSnackbar';
import CartsCard from '../../components/horizontal-prototype/CartsCard';

import { apiUrl } from '../../url';
import CartsUpdateDialog from "../../components/horizontal-prototype/CartsUpdateDialog";
import CartsRemoveDialog from "../../components/horizontal-prototype/CartsRemoveDialog";

const strings = new LocalizedStrings({
  en: {
    carts: 'Carts',
    added_by: 'Added by',
    update: 'Update',
    remove: 'Remove',
    toast_updated: 'Item updated.',
    toast_missing: 'Oops. Information is missing.',
    toast_removed: 'Item removed from cart.',
  },
});

export default () => {
  const [cookies, setCookie] = useCookies(['session', 'userID']);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(null);
  const [dialogQuantity, setDialogQuantity] = useState(0.0);
  const [dialogUnit, setDialogUnit] = useState('');
  const [inventoryID, setInventoryID] = useState(null);
  const [toast, setToast] = useState('');
  const [carts, setCarts] = useState([]);

  const load = async () => {
    await fetch(`${apiUrl}/v4/carts?session=${cookies.session}` + '&userID=' + cookies.userID, {
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
          let ingredientIDs = data.map((item) => item.ingredientID);
          if (ingredientIDs.length > 0) {
            ingredientIDs = [...new Set(ingredientIDs)];
            await fetch(`${apiUrl}/v4/ingredients?session=${cookies.session}&ingredientIDs=${ingredientIDs.join(',')}`, {
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
                      if (data3 !== null) {
                        const carts2 = data.map((item) => {
                          const ingredient = data2.find((item2) => item.ingredientID === item2.ingredientID);
                          const user = data3.find((item2) => item.userID === item2.userID);
                          return {
                            key: item.cartID,
                            title: ingredient.name,
                            subtitle: `${item.quantity} ${item.unit}`,
                            content: `${strings.added_by} ${user.name}`,
                            image: ingredient.image,
                          };
                        });
                        setCarts(carts2);
                      } else {
                        setToast(strings.toast_missing);
                      }
                    });
                } else {
                  setToast(strings.toast_missing);
                }
              });
          } else {
            setToast(strings.toast_missing);
          }
        } else {
          setToast(strings.toast_missing);
        }
      })
      .catch((error) => setToast(error.toString()));
  };

  useEffect(() => {
    load();
  }, []);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const toggleDialog = (dialogOpen) => {
    setDialogOpen(dialogOpen);
  };

  const handleUpdate = (key) => {
    // TODO: fetch
    setInventoryID(key);
    toggleDialog('patch')
  };

  const handleRemove = (key) => {
    // TODO: fetch
    setInventoryID(key);
    toggleDialog('delete')
  };

  const handleUpdateSubmission = async (value) => {
    const action = dialogOpen;
    toggleDialog(null);
    if (value === 'confirm') {
      switch (action) {
        case 'delete':
        case 'patch':
          await fetch(`${apiUrl}/v4/carts/`, {
            method: 'PATCH',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              session: cookies.session,
              quantity: dialogQuantity,
              unit: dialogUnit,
              cartID: inventoryID,
            }),
          })
              .then((res) => {
                if (!res.ok) {
                  throw new Error(`${res.status} ${res.statusText}`);
                }
              })
              .catch((error) => setToast(error.toString()));
          switch (action) {
            case 'patch':
              setToast(strings.toast_updated);
              break;
            case 'delete':
              setToast(strings.toast_removed);
              break;
          }
          load();
          break;
      }
    }
  };

  const handleDeleteSubmission = async (value) => {
    const action = dialogOpen;
    toggleDialog(null);
    if (value === 'confirm') {
      console.log(inventoryID)
      switch (action) {
        case 'patch':
        case 'delete':
          await fetch(`${apiUrl}/v4/carts/?session=${cookies.session}&cartIDs=${inventoryID}`, {
            method: 'DELETE',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              session: cookies.session,
              cartIDs: inventoryID,
            }),
          })
              .then((res) => {
                if (!res.ok) {
                  throw new Error(`${res.status} ${res.statusText}`);
                }
              })
              .catch((error) => setToast(error.toString()));
          switch (action) {
            case 'patch':
              setToast(strings.toast_updated);
              break;
            case 'delete':
              setToast(strings.toast_removed);
              break;
          }
          load();
          break;
      }
    }
  };

  return (
    <View className="drawer-container">
      <MaterialTopAppBar
        title={strings.carts}
        onClick1={toggleDrawer}
      />
      <TopAppBarFixedAdjust className="top-app-bar-fix-adjust">
        <MaterialDrawer
          open={drawerOpen}
          selectedIndex={2}
          onClose={toggleDrawer}
        />
        <DrawerAppContent className="drawer-app-content">
          <Grid style={{ height: useWindowDimensions().height - 64 }}>
            {carts.length > 0 && (
            <Row>
              {carts.map((item) => (
                <Cell desktopColumns={6} phoneColumns={4} tabletColumns={4}>
                  <CartsCard
                    mainText1={item.title}
                    mainText2={item.subtitle}
                    bodyText={item.content}
                    actionText1={strings.update}
                    actionText2={strings.remove}
                    onClickAction1={() => handleUpdate(item.key)}
                    onClickAction2={() => handleRemove(item.key)}
                    mainImage={item.image}
                  />
                </Cell>
              ))}
            </Row>
            )}
          </Grid>
        </DrawerAppContent>
        {toast && (
        <MaterialSnackbar message={toast} onClose={() => setToast('')} />
        )}
      </TopAppBarFixedAdjust>
      <CartsUpdateDialog open={dialogOpen === 'patch'}
                         onClose={handleUpdateSubmission}
                         quantity={dialogQuantity}
                         onChange1={(e) => setDialogQuantity(e.target.value)}
                         onTrailingIconSelect1={() => setDialogQuantity(1.0)}
                         unit={dialogUnit}
                         onChange2={(e) => setDialogUnit(e.target.value)}
                         onTrailingIconSelect2={() => setDialogUnit('')}
      />
      <CartsRemoveDialog open={dialogOpen === 'delete'} onClose={handleDeleteSubmission}/>
    </View>
  );
};
