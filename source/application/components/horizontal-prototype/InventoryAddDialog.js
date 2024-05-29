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
    add_inventory: 'ADD inventory',
    quantity: 'Quantity',
    quantity_helper: 'This is the quantity of the storable.',
    unit: 'Unit',
    unit_helper: 'This is the unit of the storable.',
    price: 'Price',
    price_helper: 'This is the price of the storable.',
    expiration_date: 'Expiration date',
    expiration_date_helper: 'This is the expiration date of the storable.',
    cancel: 'Cancel',
    add: 'Add',
  },
});

function InventoryAddDialog(props) {
  const {
    open, onClose, quantity, onChange1, onTrailingIconSelect1, unit, onChange2, onTrailingIconSelect2, price, onChange3,
    onTrailingIconSelect3, expirationDate, onChange4, onTrailingIconSelect4,
  } = props;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{strings.add_inventory}</DialogTitle>
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
        <MaterialFilledTextField
          label={strings.price}
          helperText={strings.price_helper}
          value={price}
          onChange={onChange3}
          onTrailingIconSelect={onTrailingIconSelect3}
        />
        <MaterialFilledTextField
          label={strings.expiration_date}
          helperText={strings.expiration_date_helper}
          value={expirationDate}
          onChange={onChange4}
          onTrailingIconSelect={onTrailingIconSelect4}
        />
      </DialogContent>
      <DialogFooter>
        <DialogButton action="dismiss">{strings.cancel}</DialogButton>
        <DialogButton action="confirm" isDefault>{strings.add}</DialogButton>
      </DialogFooter>
    </Dialog>
  );
}

InventoryAddDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  quantity: PropTypes.string.isRequired,
  onChange1: PropTypes.func.isRequired,
  onTrailingIconSelect1: PropTypes.func.isRequired,
  unit: PropTypes.string.isRequired,
  onChange2: PropTypes.func.isRequired,
  onTrailingIconSelect2: PropTypes.func.isRequired,
  price: PropTypes.string.isRequired,
  onChange3: PropTypes.func.isRequired,
  onTrailingIconSelect3: PropTypes.func.isRequired,
  expirationDate: PropTypes.string.isRequired,
  onChange4: PropTypes.func.isRequired,
  onTrailingIconSelect4: PropTypes.func.isRequired,
};

export default InventoryAddDialog;
