import React, { } from 'react';
import PropTypes from 'prop-types';
import Dialog, { DialogTitle, DialogContent } from '@material/react-dialog';
import List, { ListItem, ListItemGraphic, ListItemText } from '@material/react-list';
import MaterialIcon from '@material/react-material-icon';
import '@material/react-dialog/dist/dialog.css';
import '@material/react-button/dist/button.css';
import '@material/react-list/dist/list.css';
import '@material/react-material-icon/dist/material-icon.css';

function MaterialSimpleDialog(props) {
  const {
    open, onClose, handleSelect, choices, title,
  } = props;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <List avatarList handleSelect={handleSelect}>
          {choices.map((choice, i) => (
            <ListItem key={i} data-mdc-dialog-action={choice.text}>
              <ListItemGraphic graphic={<MaterialIcon icon={choice.text.match(/@/) ? 'person' : 'add'} />} />
              <ListItemText primaryText={choice.text} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
}

MaterialSimpleDialog.propTypes = {
  open: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  handleSelect: PropTypes.func.isRequired,
  choices: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
};

export default MaterialSimpleDialog;
