import React, { } from 'react';
import PropTypes from 'prop-types';
import Select, { Option } from '@material/react-select';
import '@material/react-list/dist/menu.css';
import '@material/react-menu-surface/dist/menu.css';
import '@material/react-menu/dist/menu.css';
import '@material/react-select/dist/select.css';

function MaterialEnhancedSelect(props) {
  const {
    label, value, onEnhancedChange, options,
  } = props;

  return (
    <Select enhanced label={label} value={value} onEnhancedChange={onEnhancedChange}>
      {options.map((option) => (
        <Option value={option.value}>{option.text}</Option>
      ))}
    </Select>
  );
}

MaterialEnhancedSelect.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onEnhancedChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
};

export default MaterialEnhancedSelect;
