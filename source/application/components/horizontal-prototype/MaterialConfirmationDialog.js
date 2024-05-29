import React, { } from 'react';
import PropTypes from 'prop-types';
import LocalizedStrings from 'react-localization';
import Dialog, {
  DialogTitle, DialogContent, DialogFooter, DialogButton,
} from '@material/react-dialog';
import List, { ListItem, ListItemText } from '@material/react-list';
import MaterialCheckbox from './MaterialCheckbox';
import '@material/react-dialog/dist/dialog.css';
import '@material/react-button/dist/button.css';
import '@material/react-list/dist/list.css';

const strings = new LocalizedStrings({
  en: {
    cancel: 'Cancel',
    okay: 'OK',
  },
});

function MaterialConfirmationDialog(props) {
  const {
    open, onClose, title, handleSelect, choices,
  } = props;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <List checkboxList handleSelect={handleSelect}>
          {choices.map((choice, i) => (
            <ListItem key={i} data-mdc-dialog-action={choice.text}>
              <MaterialCheckbox />
              <ListItemText primaryText={choice.text} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogFooter>
        <DialogButton action="dismiss">{strings.cancel}</DialogButton>
        <DialogButton action="confirm" isDefault>{strings.okay}</DialogButton>
      </DialogFooter>
    </Dialog>
  );
}

MaterialConfirmationDialog.propsTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  handleSelect: PropTypes.func.isRequired,
  choices: PropTypes.array.isRequired,
};

export default MaterialConfirmationDialog;
