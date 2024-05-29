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
        remove_from_cart: 'REMOVE from cart?',
        cancel: 'No',
        update: 'Yes',
    },
});

function CartsUpdateDialog(props) {
    const {
        open, onClose, quantity, onChange1, onTrailingIconSelect1, unit, onChange2, onTrailingIconSelect2
    } = props;

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{strings.remove_from_cart}</DialogTitle>
            <DialogFooter>
                <DialogButton action="dismiss">{strings.cancel}</DialogButton>
                <DialogButton action="confirm" isDefault>{strings.update}</DialogButton>
            </DialogFooter>
        </Dialog>
    );
}

CartsUpdateDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default CartsUpdateDialog;
