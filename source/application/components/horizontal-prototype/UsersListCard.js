import React, { } from 'react';
import PropTypes from 'prop-types';

import MaterialCard from './MaterialCard';
import MaterialSingleSelectionList from './MaterialSingleSelectionList';

function UsersListCard(props) {
  const { items, handleSelect } = props;

  return (
    <MaterialCard className="mdc-card">
      <MaterialSingleSelectionList items={items} handleSelect={handleSelect} />
    </MaterialCard>
  );
}

UsersListCard.propTypes = {
  items: PropTypes.array.isRequired,
  handleSelect: PropTypes.func.isRequired,
};

export default UsersListCard;
