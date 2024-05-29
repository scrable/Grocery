import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import LocalizedStrings from 'react-localization';

import { View, useWindowDimensions } from 'react-native';
import { TopAppBarFixedAdjust } from '@material/react-top-app-bar';
import { DrawerAppContent } from '@material/react-drawer';
import { Cell, Grid, Row } from '@material/react-layout-grid';
import MaterialIcon from '@material/react-material-icon';
import '@material/react-layout-grid/dist/layout-grid.css';
import '@material/react-material-icon/dist/material-icon.css';

import MaterialTopAppBar from '../../components/horizontal-prototype/MaterialTopAppBar';
import MaterialDrawer from '../../components/horizontal-prototype/MaterialDrawer';
import MaterialFab from '../../components/horizontal-prototype/MaterialFab';
import MaterialSnackbar from '../../components/horizontal-prototype/MaterialSnackbar';
import UsersDialog from '../../components/horizontal-prototype/UsersDialog';
import UsersListCard from '../../components/horizontal-prototype/UsersListCard';

import { apiUrl } from '../../url';

const strings = new LocalizedStrings({
  en: {
    toast_missing: 'Oops. Information is missing.',
  },
});

export default () => {
  const [cookies, setCookie] = useCookies(['session', 'userID']);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [intolerances, setIntolerances] = useState([]);
  const [toast, setToast] = useState('');
  const [users, setUsers] = useState([]);

  const dummySetup = () => {
    // TODO: hard code users array
    setUsers([
      {
        key: 1,
        primaryText: 'User 1 ',
        secondaryText: 'role',
      },
      {
        key: 2,
        primaryText: 'User 2 ',
        secondaryText: 'role 2',
      },
    ]);
  };

  const load = async () => {
    await fetch(`${apiUrl}/v4/users?session=${cookies.session}`, {
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
      .then((data) => {
        if (data !== null) {
          const users2 = data.map((item) => ({
            key: item.userID,
            primaryText: item.name,
            secondaryText: item.role,
          }));
          setUsers(users2);
        } else {
          setToast(strings.toast_missing);
        }
      })
      .catch((error) => setToast(error.toString()));
  };

  useEffect(() => {
    // dummySetup();
    load();
  }, []);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const toggleDialog = () => {
    setDialogOpen(!dialogOpen);
  };

  const handleDelete = () => {
    // @todo
  };

  const handleSubmission = async (value) => {
    toggleDialog();
    if (value === 'confirm') {
      await fetch(`${apiUrl}/v4/users`, {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session: cookies.session,
          name,
          role,
          intolerances,
        }),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`${res.status} ${res.statusText}`);
          }
          return res.json();
        })
        .then((data) => {
          setCookie('userID', data.userID, {
            path: '/horizontal-prototype/',
            // httpOnly: true,
            // expires: new Date(data.expires_ts),
          });
        })
        .catch((error) => setToast(error.toString()));
      setToast(strings.toast_created);
      load();
    }
  };

  return (
    <>
      <View className="drawer-container">
        <MaterialTopAppBar
          title={strings.users}
          onClick1={toggleDrawer}
        />
        <TopAppBarFixedAdjust className="top-app-bar-fix-adjust">
          <MaterialDrawer
            open={drawerOpen}
            selectedIndex={5}
            onClose={toggleDrawer}
          />
          <DrawerAppContent className="drawer-app-content">
            <Grid style={{ height: useWindowDimensions().height - 64 }}>
              {users.length > 0 && (
              <Row>
                <Cell columns={12}>
                  <UsersListCard
                    items={users}
                  />
                </Cell>
              </Row>
              )}
            </Grid>
          </DrawerAppContent>
          {toast && (
          <MaterialSnackbar message={toast} onClose={() => setToast('')} />
          )}
          <MaterialFab
            icon={<MaterialIcon icon="person_add" />}
            style={{ position: 'absolute', right: 16, bottom: 16 }}
            onClick={toggleDialog}
          />
        </TopAppBarFixedAdjust>
      </View>
      <UsersDialog
        open={dialogOpen}
        name={name}
        role={role}
        intolerances={intolerances}
        onChange1={(e) => setName(e.target.value)}
        onChange2={(e) => setRole(e.target.value)}
        onChange3={(e) => setIntolerances(e.target.value)}
        onTrailingIconSelect1={() => setName(initialState.name)}
        onTrailingIconSelect2={() => setRole(initialState.role)}
        onTrailingIconSelect3={() => setIntolerances(initialState.intolerances)}
        onClose={handleSubmission}
      />
    </>
  );
};
