/**
 * @copyright Copyright (C) 2025 Dennis Greguhn <dev@greguhn.de>
 * 
 * @author Dennis Greguhn <dev@greguhn.de>
 * 
 * @license AGPL-3.0-or-later
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import * as React from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { IconButton, Tooltip } from "@mui/material";
import TranslateIcon from '@mui/icons-material/Translate';

import { useLocalStorageState } from "@toolpad/core";

import { useTranslation } from 'react-i18next';


function DisclaimerDialog() {
	const { t, i18n } = useTranslation();
	const [disclaimerAck, setDisclaimerAck] = useLocalStorageState('disclaimer-ack', false);

	const handleClose = (_:any, reason: string) => {
		if (reason && reason === "ack"){
			setDisclaimerAck(true);
		}
		return;
	};

	return (
		(disclaimerAck === true ? <></> :
			<React.Fragment>
				<Dialog
					open={(disclaimerAck === false)}
					onClose={handleClose}
					aria-labelledby="alert-dialog-title"
					aria-describedby="alert-dialog-description"
					disableEscapeKeyDown
				>
					<DialogTitle id="alert-dialog-title">{t("disclaimer-header")}</DialogTitle>
					<DialogContent>
						<DialogContentText id="alert-dialog-description">
							{t("disclaimer-body1")}
						</DialogContentText><br/>
						<DialogContentText id="alert-dialog-description">
							{t("disclaimer-body2")}
						</DialogContentText><br/>
						<DialogContentText id="alert-dialog-description">
							{t("disclaimer-body3")}
						</DialogContentText><br/>
						<DialogContentText id="alert-dialog-description">
							{t("disclaimer-body4")}
						</DialogContentText><br/>
					</DialogContent>
					<DialogActions>
						<Tooltip title="Change Language">
							<IconButton
								color="primary"
								aria-label="change language"
								onClick={() => {i18n.changeLanguage((i18n.language === "en" ? "de" : "en"))}}>
								<TranslateIcon />
							</IconButton>
						</Tooltip>
						<Tooltip title="Accept Disclaimer">
							<Button onClick={() => {handleClose(null, "ack")}} autoFocus>{t("disclaimer-ack")}</Button>
						</Tooltip>
					</DialogActions>
				</Dialog>
			</React.Fragment>
		)
	)
}

export default DisclaimerDialog;