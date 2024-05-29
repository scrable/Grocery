import React, { } from 'react';
import PropTypes from 'prop-types';
import LocalizedStrings from 'react-localization';
import Dialog, {
  DialogTitle, DialogContent, DialogFooter, DialogButton,
} from '@material/react-dialog';
import MaterialFilledTextField from './MaterialFilledTextField';
import '@material/react-dialog/dist/dialog.css';
import '@material/react-button/dist/button.css';

const strings = new LocalizedStrings({
  en: {
    consume_inventory: 'CONSUME inventory',
    quantity: 'Quantity',
    quantity_helper: 'This is the quantity to be consumed.',
    unit: 'Unit',
    unit_helper: 'This is the unit to be consumed.',
    cancel: 'Cancel',
    consume: 'Consume',
  },
});

function InventoryConsumeDialog(props) {
  const {
    open, onClose,quantity, onChange1, onTrailingIconSelect1, unit, onChange2, onTrailingIconSelect2,
  } = props;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{strings.consume_inventory}</DialogTitle>
      <DialogContent>
        <MaterialFilledTextField
          label={strings.quantity}
          helperText={strings.quantity_helper}
          value={quantity}
          onChange={onChange1}
          onTrailingIconSelect={onTrailingIconSelect1}
        />
        <MaterialFilledTextField
          label={strings.unit}
          helperText={strings.unit_helper}
          value={unit}
          onChange={onChange2}
          onTrailingIconSelect={onTrailingIconSelect2}
        />
      </DialogContent>
      <DialogFooter>
        <DialogButton action="dismiss">{strings.cancel}</DialogButton>
        <DialogButton action="confirm" isDefault>{strings.consume}</DialogButton>
      </DialogFooter>
    </Dialog>
  );
}

InventoryConsumeDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  quantity: PropTypes.string.isRequired,
  onChange1: PropTypes.func.isRequired,
  onTrailingIconSelect1: PropTypes.func.isRequired,
  unit: PropTypes.string.isRequired,
  onChange2: PropTypes.func.isRequired,
  onTrailingIconSelect2: PropTypes.func.isRequired,
};

export default InventoryConsumeDialog;
