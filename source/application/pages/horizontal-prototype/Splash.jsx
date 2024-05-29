import React, { useEffect, useReducer } from 'react';
import { useCookies } from 'react-cookie';
import LocalizedStrings from 'react-localization';

import { Cell, Grid, Row } from '@material/react-layout-grid';
import '@material/react-layout-grid/dist/layout-grid.css';

import { Headline1 } from '../../components/horizontal-prototype/MaterialTypography';
import MaterialOutlinedTextField from '../../components/horizontal-prototype/MaterialOutlinedTextField';
import MaterialButton from '../../components/horizontal-prototype/MaterialButton';
import MaterialSimpleDialog from '../../components/horizontal-prototype/MaterialSimpleDialog';

import { splashReducer, initialState } from '../../reducers/horizontal-prototype/Splash';
import {
  setSerialNumber,
  setPIN,
  setDialogOpen,
  setUsers,
} from '../../actions/horizontal-prototype/Splash';
import { apiUrl } from '../../url';

const strings = new LocalizedStrings({
  en: {
    continue: 'Continue',
    serial_number: 'Serial number',
    serial_number_helper: 'This is located in the front of interior or exterior of your fridge.',
    pin: 'PIN',
    pin_helper: 'This is the PIN number to log-in to your fridge.',
    select_user: 'Select an user:',
    new_user: 'I\'m new!',
  },
});

export default () => {
  const [cookies, setCookie] = useCookies(['session', 'userID']);
  const [state, dispatch] = useReducer(splashReducer, initialState);

  const load = async () => {
    // for dummy fridge
    await fetch(`${apiUrl}/v4/register`, {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`${res.status} ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        dispatch(setSerialNumber(data.serialNumber));
        dispatch(setPIN(data.pin));
      })
      .catch(console.log);
  };

  useEffect(() => {
    load();
  }, []);

  const toggleDialog = () => {
    dispatch(setDialogOpen(!state.dialogOpen));
  };

  const handleAuth = async () => {
    await fetch(`${apiUrl}/v4/login`, {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        serialNumber: state.serialNumber,
        pin: state.pin,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`${res.status} ${res.statusText}`);
        }
        return res.json();
      })
      .then(async (data) => {
        setCookie('session', data.session, {
          path: '/horizontal-prototype/',
          // httpOnly: true,
          expires: new Date(data.expires_ts),
        });
        await fetch(`${apiUrl}/v4/users?session=${data.session}`, {
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
          .then((data2) => {
            const users = [];
            if (data2 !== null) {
              data2.foreach((item) => users.push({
                key: item.userID,
                text: item.name,
              }));
            }
            dispatch(setUsers(users));
          })
          .finally(() => {
            const { users } = state;
            users.push({ text: strings.new_user });
            dispatch(setUsers(users));
            toggleDialog();
          });
      })
      .catch(console.log);
    // @todo snackbar
  };

  const handleUserID = (value) => {
    if (value < state.users.length - 1) {
      setCookie('userID', state.users[value], {
        path: '/horizontal-prototype/',
        // httpOnly: true,
        // expires: new Date(data.expires_ts),
      });
      window.location.href = 'inventory/';
    } else {
      window.location.href = 'users/';
    }
  };

  return (
    <>
      <Grid>
        <Row>
          <Cell columns={12}>
            <Headline1 style={{ color: 'rgba(65,117,5,1)' }}>STOCKUP</Headline1>
          </Cell>
        </Row>
        <Row>
          <Cell columns={12}>
            <MaterialOutlinedTextField
              label={strings.serial_number}
              helperText={strings.serial_number_helper}
              value={state.serialNumber}
              onChange={(e) => dispatch(setSerialNumber(e.target.value))}
              onTrailingIconSelect={() => dispatch(setSerialNumber(initialState.serialNumber))}
            />
          </Cell>
          <Cell columns={12}>
            <MaterialOutlinedTextField
              label={strings.pin}
              helperText={strings.pin_helper}
              value={state.pin}
              onChange={(e) => dispatch(setPIN(e.target.value))}
              onTrailingIconSelect={() => dispatch(setPIN(initialState.pin))}
            />
          </Cell>
        </Row>
        <Row>
          <Cell columns={12}>
            <MaterialButton onClick={handleAuth} raised style={{ width: '100%' }}>{strings.continue}</MaterialButton>
          </Cell>
        </Row>
      </Grid>
      <MaterialSimpleDialog
        open={state.dialogOpen}
        title={strings.select_user}
        choices={state.users}
        handleSelect={handleUserID}
        onClose={toggleDialog}
      />
    </>
  );
};
