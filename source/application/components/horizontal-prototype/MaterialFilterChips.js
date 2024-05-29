import React, { } from 'react';
import PropTypes from 'prop-types';
import { ChipSet, Chip } from '@material/react-chips';
import '@material/react-chips/dist/chips.css';

function MaterialFilterChips(props) {
  const {
    selectedChipIds, handleSelect, choices,
  } = props;

  return (
    <ChipSet filter selectedChipIds={selectedChipIds} handleSelect={handleSelect}>
      {choices.map((choice) => (
        <Chip id={choice.id} label={choice.label} />
      ))}
    </ChipSet>
  );
}

MaterialFilterChips.propTypes = {
  selectedChipIds: PropTypes.string.isRequired,
  handleSelect: PropTypes.func.isRequired,
  choices: PropTypes.array.isRequired,
};

export default MaterialFilterChips;
