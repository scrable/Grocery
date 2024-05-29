import React, { } from 'react';
import PropTypes from 'prop-types';

import TopAppBar, {
  TopAppBarIcon, TopAppBarRow, TopAppBarSection, TopAppBarTitle,
} from '@material/react-top-app-bar';
import MaterialIcon from '@material/react-material-icon';
import '@material/react-top-app-bar/dist/top-app-bar.css';
import '@material/react-material-icon/dist/material-icon.css';

function MaterialTopAppBar(props) {
  const {
    icon1, onClick1, title, icon2, onClick2,
  } = props;

  return (
    <TopAppBar style={{ background: 'rgba(65,117,5,1)' }}>
      <TopAppBarRow>
        <TopAppBarSection align="start">
          <TopAppBarIcon navIcon tabIndex={0}>
            <MaterialIcon
              aria-label={icon1 || 'menu'}
              hasRipple
              icon={icon1 || 'menu'}
              onClick={onClick1}
            />
          </TopAppBarIcon>
          <TopAppBarTitle>{title}</TopAppBarTitle>
        </TopAppBarSection>
        {(icon2 || onClick2) && (
        <TopAppBarSection align="end" role="toolbar">
          <TopAppBarIcon actionItem tabIndex={0}>
            <MaterialIcon
              aria-label={icon2}
              hasRipple
              icon={icon2 || 'search'}
              onClick={onClick2}
            />
          </TopAppBarIcon>
        </TopAppBarSection>
        )}
      </TopAppBarRow>
    </TopAppBar>
  );
}

MaterialTopAppBar.propTypes = {
  icon1: PropTypes.string,
  onClick1: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  icon2: PropTypes.string,
  onClick2: PropTypes.func,
};

export default MaterialTopAppBar;
