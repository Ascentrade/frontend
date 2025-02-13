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

import { Box, Chip, Stack, Typography } from "@mui/material";

function CustomAppTitle() {
	// https://vite.dev/guide/env-and-mode
	return (
		<Stack direction="row" alignItems="center" spacing={2}>
			<Box component="img" sx={{ height: "40px", width: "auto" }} alt="Ascentrade.app Icon" src="icon.svg"/>
			<Typography variant="h6">Ascentrade</Typography>
			{(import.meta.env.DEV === true ? <Chip size="small" label="DEV" color="info"/> : <></>)}
		</Stack>
	);
}

export default CustomAppTitle;