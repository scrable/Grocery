import React, { } from 'react';
import PropTypes from 'prop-types';

import { ListGroup, ListGroupSubheader, ListDivider } from '@material/react-list';
import LocalizedStrings from 'react-localization';
import MaterialCard from './MaterialCard';
import MaterialList from './MaterialList';

const strings = new LocalizedStrings({
  en: {
    required_ingredients: 'Ingredients (required)',
    optional_ingredients: 'Ingredients (optional)',
  },
});

function IngredientsListCard(props) {
  const {
    list1, list2,
  } = props;

  return (
    <MaterialCard className="mdc-card">
      <ListGroup>
        {list1 && (
        <>
          <ListGroupSubheader tag="h2">{strings.required_ingredients}</ListGroupSubheader>
          <MaterialList items={list1} />
        </>
        )}
        {list1 && list2 && (
        <ListDivider tag="div" />
        )}
        {list2 && (
        <>
          <ListGroupSubheader tag="h2">{strings.optional_ingredients}</ListGroupSubheader>
          <MaterialList items={list2} />
        </>
        )}
      </ListGroup>
    </MaterialCard>
  );
}

IngredientsListCard.propTypes = {
  list1: PropTypes.array,
  list2: PropTypes.array,
};

export default IngredientsListCard;
