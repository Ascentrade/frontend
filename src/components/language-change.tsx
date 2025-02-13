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

import { useTranslation } from "react-i18next";

// MUI
import { IconButton, Tooltip } from "@mui/material";
import TranslateIcon from '@mui/icons-material/Translate';

function LanguageChange() {
	const { i18n } = useTranslation();

	return (
		<Tooltip title="Change Language">
			<IconButton
				color="primary"
				aria-label="change language"
				onClick={() => {i18n.changeLanguage((i18n.language === "en" ? "de" : "en"))}}>
				<TranslateIcon />
			</IconButton>
		</Tooltip>
	)
}

export default LanguageChange