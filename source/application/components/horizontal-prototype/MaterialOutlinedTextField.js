import React, { } from 'react';
import PropTypes from 'prop-types';
import TextField, { HelperText, Input } from '@material/react-text-field';
import MaterialIcon from '@material/react-material-icon';
import '@material/react-text-field/dist/text-field.css';
import '@material/react-material-icon/dist/material-icon.css';

function MaterialOutlinedTextField(props) {
  const {
    label, helperText, onTrailingIconSelect, trailingIcon, inputType, value, onChange,
  } = props;

  return (
    <TextField
      outlined
      label={label}
      helperText={<HelperText>{helperText}</HelperText>}
      onTrailingIconSelect={onTrailingIconSelect}
      trailingIcon={<MaterialIcon role="button" icon={trailingIcon || 'clear'} />}
      style={{ width: '100%' }}
    >
      <Input
        inputType={inputType}
        value={value}
        onChange={onChange}
      />
    </TextField>
  );
}

MaterialOutlinedTextField.propTypes = {
  label: PropTypes.string.isRequired,
  helperText: PropTypes.string.isRequired,
  onTrailingIconSelect: PropTypes.func.isRequired,
  trailingIcon: PropTypes.string,
  inputType: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default MaterialOutlinedTextField;
