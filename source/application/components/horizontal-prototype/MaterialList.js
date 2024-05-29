import React, { } from 'react';
import PropTypes from 'prop-types';

import List, { ListItem, ListItemText } from '@material/react-list';
import '@material/react-list/dist/list.css';

function MaterialList(props) {
  const {
    items,
  } = props;

  return (
    <List twoLine>
      {items.map((item) => (
        <ListItem>
          <ListItemText
            primaryText={item.primaryText}
            secondaryText={item.secondaryText}
          />
        </ListItem>
      ))}
    </List>
  );
}

MaterialList.propTypes = {
  items: PropTypes.array.isRequired,
};

export default MaterialList;
