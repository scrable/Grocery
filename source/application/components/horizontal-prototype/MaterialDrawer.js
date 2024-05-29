import React, { } from 'react';
import PropTypes from 'prop-types';
import Drawer, { DrawerContent, DrawerHeader, DrawerTitle } from '@material/react-drawer';
import List, {
  ListDivider, ListItem, ListItemGraphic, ListItemText,
} from '@material/react-list';
import MaterialIcon from '@material/react-material-icon';
import '@material/react-drawer/dist/drawer.css';
import '@material/react-list/dist/list.css';
import '@material/react-material-icon/dist/material-icon.css';
import LocalizedStrings from 'react-localization';

const strings = new LocalizedStrings({
  en: {
    inventory: 'Inventory',
    recipes: 'Recipes',
    carts: 'Carts',
    consumption: 'Consumption',
    meal_plans: 'Meal Plans',
    users: 'Users',
    logout: 'Logout',
  },
});

function MaterialDrawer(props) {
  const {
    open, onClose, title, selectedIndex,
  } = props;

  return (
    <Drawer modal open={open} onClose={onClose}>
      <DrawerHeader>
        <DrawerTitle tag="h2">
          {title}
        </DrawerTitle>
      </DrawerHeader>
      <DrawerContent>
        <List singleSelection selectedIndex={selectedIndex}>
          <ListItem onClick={() => window.location.href = '../inventory/'}>
            <ListItemGraphic graphic={<MaterialIcon icon="kitchen" />} />
            <ListItemText primaryText={strings.inventory} />
          </ListItem>
          <ListItem onClick={() => window.location.href = '../recipes/'}>
            <ListItemGraphic graphic={<MaterialIcon icon="list_alt" />} />
            <ListItemText primaryText={strings.recipes} />
          </ListItem>
          <ListItem onClick={() => window.location.href = '../carts/'}>
            <ListItemGraphic graphic={<MaterialIcon icon="shopping_cart" />} />
            <ListItemText primaryText={strings.carts} />
          </ListItem>
          <ListItem onClick={() => window.location.href = '../consumption/'}>
            <ListItemGraphic graphic={<MaterialIcon icon="bar_chart" />} />
            <ListItemText primaryText={strings.consumption} />
          </ListItem>
          <ListItem onClick={() => window.location.href = '../meal-plans/'}>
            <ListItemGraphic graphic={<MaterialIcon icon="menu_book" />} />
            <ListItemText primaryText={strings.meal_plans} />
          </ListItem>
          <ListDivider tag="div" />
          <ListItem onClick={() => window.location.href = '../users/'}>
            <ListItemGraphic graphic={<MaterialIcon icon="people" />} />
            <ListItemText primaryText={strings.users} />
          </ListItem>
          <ListDivider tag="div" />
          <ListItem onClick={() => window.location.href = '../'}>
            <ListItemGraphic graphic={<MaterialIcon icon="exit_to_app" />} />
            <ListItemText primaryText={strings.logout} />
          </ListItem>
        </List>
      </DrawerContent>
    </Drawer>
  );
}

MaterialDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  selectedIndex: PropTypes.number.isRequired,
};

export default MaterialDrawer;
