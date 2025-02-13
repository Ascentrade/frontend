/**
 * @copyright Copyright (C) 2024 Dennis Greguhn <dev@greguhn.de>
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
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.	See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.	If not, see <http://www.gnu.org/licenses/>.
 */

import { createTheme } from '@mui/material/styles';

// A custom theme for this app
const theme = createTheme({
	cssVariables: {
		colorSchemeSelector: 'data-toolpad-color-scheme',
	},
	colorSchemes: {
		light: {
			palette: {
				background: {
				default: '#F9F9FE',
				paper: '#EEEEF9',
				},
			},
		},
		dark: {
			palette: {
				background: {
				default: '#2A4364',
				paper: '#112E4D',
				},
			},
		},
	},
	breakpoints: {
		values: {
			xs: 0,
			sm: 600,
			md: 600,
			lg: 1200,
			xl: 1536,
		},
	},
});

export default theme;