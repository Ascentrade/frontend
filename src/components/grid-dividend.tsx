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
import { Link } from 'react-router-dom';

import { Divider, Stack, Typography } from "@mui/material";

import GridItem from "./grid-item";


function GridDividend({divShare, divYield}:{divShare:number, divYield:number}) {
	return (
		<GridItem>
			<Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}><Link to={'/dividends'}>Dividends</Link></Typography>
			<Stack alignItems="center" justifyContent="center" direction="row">
				<Typography variant="h5" component="div">{divShare} $</Typography>
				<Divider orientation="vertical" flexItem sx={{margin:1}} />
				<Typography variant="h5" component="div">{(divYield*100).toFixed(2)} %</Typography>
			</Stack>
		</GridItem>
	)
}

export default GridDividend