import React, { } from 'react';
import PropTypes from 'prop-types';
import TopAppBar, { TopAppBarIcon, TopAppBarRow, TopAppBarSection } from '@material/react-top-app-bar';
import TextField, { Input } from '@material/react-text-field';
import MaterialIcon from '@material/react-material-icon';
import '@material/react-top-app-bar/dist/top-app-bar.css';
import '@material/react-text-field/dist/text-field.css';
import '@material/react-material-icon/dist/material-icon.css';
import LocalizedStrings from 'react-localization';

const strings = new LocalizedStrings({
  en: {
    search: 'Search',
  },
});

function MaterialTopAppBarSearchDialog(props) {
  const {
    icon1, onClick1, onTrailingIconSelect, value, onChange,
  } = props;

  return (
    <TopAppBar style={{ background: 'rgba(65,117,5,1)' }}>
      <TopAppBarRow>
        <TopAppBarSection align="start">
          <TopAppBarIcon navIcon tabIndex={0}>
            <MaterialIcon
              aria-label={icon1 || 'arrow_back'}
              hasRipple
              icon={icon1 || 'arrow_back'}
              onClick={onClick1}
            />
          </TopAppBarIcon>
        </TopAppBarSection>
        <TopAppBarSection align="end" role="toolbar">
          <TextField
            label={strings.search}
            onTrailingIconSelect={onTrailingIconSelect}
            trailingIcon={<MaterialIcon role="button" icon="clear" style={{ color: '#fff' }} />}
            fullWidth
          >
            <Input
              value={value}
              onChange={onChange}
              style={{ color: '#fff', borderBottomColor: '#fff' }}
            />
          </TextField>
        </TopAppBarSection>
      </TopAppBarRow>
    </TopAppBar>
  );
}

MaterialTopAppBarSearchDialog.propTypes = {
  icon1: PropTypes.string,
  onClick1: PropTypes.func.isRequired,
  onTrailingIconSelect: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default MaterialTopAppBarSearchDialog;
