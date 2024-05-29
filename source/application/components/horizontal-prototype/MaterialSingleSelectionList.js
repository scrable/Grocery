import React, { } from 'react';
import PropTypes from 'prop-types';

import List, { ListItem, ListItemText } from '@material/react-list';
import '@material/react-list/dist/list.css';

function MaterialSingleSelectionList(props) {
  const {
    selectedIndex, handleSelect, items,
  } = props;

  return (
    <List
      singleSelection
      twoLine
      selectedIndex={selectedIndex}
      handleSelect={handleSelect}
    >
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

MaterialSingleSelectionList.propTypes = {
  selectedIndex: PropTypes.number.isRequired,
  handleSelect: PropTypes.func.isRequired,
  items: PropTypes.array.isRequired,
};

export default MaterialSingleSelectionList;
