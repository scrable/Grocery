import React, { } from 'react';
import LocalizedStrings from 'react-localization';
import PropTypes from 'prop-types';

import Dialog, {
  DialogTitle, DialogContent, DialogFooter, DialogButton,
} from '@material/react-dialog';
import MaterialFilledTextField from './MaterialFilledTextField';
import '@material/react-dialog/dist/dialog.css';
import '@material/react-button/dist/button.css';

const strings = new LocalizedStrings({
  en: {
    create_edit_user: 'CREATE / EDIT user',
    name: 'Name',
    name_helper: 'This is the name of the user.',
    role: 'Role',
    role_helper: 'This is the role of the user.',
    intolerances: 'Intolerances',
    intolerances_helper: 'This is the intolerances of the user.',
    cancel: 'Cancel',
    okay: 'OK',
  },
});

function UsersDialog(props) {
  const {
    open, onClose, name, onChange1, onTrailingIconSelect1, role, onChange2, onTrailingIconSelect2,
  } = props;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{strings.create_edit_user}</DialogTitle>
      <DialogContent>
        <MaterialFilledTextField
          label={strings.name}
          helperText={strings.name_helper}
          value={name}
          onChange={onChange1}
          onTrailingIconSelect={onTrailingIconSelect1}
        />
        <MaterialFilledTextField
          label={strings.role}
          helperText={strings.role_helper}
          value={role}
          onChange={onChange2}
          onTrailingIconSelect={onTrailingIconSelect2}
        />
        // intolerances
      </DialogContent>
      <DialogFooter>
        <DialogButton action="dismiss">{strings.cancel}</DialogButton>
        <DialogButton action="confirm" isDefault>{strings.okay}</DialogButton>
      </DialogFooter>
    </Dialog>
  );
}

UsersDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  onChange1: PropTypes.func.isRequired,
  onTrailingIconSelect1: PropTypes.func.isRequired,
  role: PropTypes.string.isRequired,
  onChange2: PropTypes.func.isRequired,
  onTrailingIconSelect2: PropTypes.func.isRequired,
};

export default UsersDialog;
