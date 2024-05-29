import React, { } from 'react';
import PropTypes from 'prop-types';
import { ChipSet, Chip } from '@material/react-chips';
import '@material/react-chips/dist/chips.css';

function MaterialChoiceChips(props) {
  const {
    selectedChipIds, handleSelect, choices,
  } = props;

  return (
    <ChipSet choice selectedChipIds={selectedChipIds} handleSelect={handleSelect}>
      {choices.map((choice) => (
        <Chip id={choice.id} label={choice.label} />
      ))}
    </ChipSet>
  );
}

MaterialChoiceChips.propTypes = {
  selectedChipIds: PropTypes.string.isRequired,
  handleSelect: PropTypes.func.isRequired,
  choices: PropTypes.array.isRequired,
};

export default MaterialChoiceChips;
