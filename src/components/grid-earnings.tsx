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

import { Divider, Stack, Typography } from "@mui/material";

import GridItem from "./grid-item";

function EpsYoYDifference({thisYear, nextYear}:{thisYear:string, nextYear:string}){
	try{
		var ty = Number(thisYear);
		var ny = Number(nextYear);
		var diff = ((ny/ty)-1)*100;
		return (
			<Typography sx={{marginLeft:1}} color={(diff > 0 ? "success" : "error")} component="div">{`${(diff > 0 ? "+" : "-")}${diff.toFixed(1)} %`}</Typography>
		);
	}catch{
		return (
			<></>
		);
	}
}


function GridEarnings({per, eps, epsCurrentYear, epsNextYear}:{per:string, eps:string, epsCurrentYear:string, epsNextYear:string}) {
	return (
		<GridItem>
			<Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>Earnings Per Share / $</Typography>
			<Stack alignItems="center" justifyContent="center" direction="row">
				<Typography variant="h5" component="div">{eps}</Typography>
				<Divider orientation="vertical" flexItem sx={{margin:1}} />
				<Typography variant="h5" component="div">{Number(per).toFixed(1)} P/E</Typography>
				<Divider orientation="vertical" flexItem sx={{margin:1}} />

				<Stack direction="column">
					<Typography variant="h5" component="div">{(epsCurrentYear ? epsCurrentYear : "-")}</Typography>
					<Typography variant="caption">{new Date().getFullYear()}</Typography>
				</Stack>

				<Divider orientation="vertical" flexItem sx={{margin:1}} />

				<Stack direction="column">
					<Stack direction="row">
					<Typography variant="h5" component="div">{(epsNextYear ? epsNextYear : "-")}</Typography>
					<EpsYoYDifference thisYear={epsCurrentYear} nextYear={epsNextYear} />
					</Stack>
					<Typography variant="caption">{new Date().getFullYear()+1}</Typography>
				</Stack>
				
			</Stack>
		</GridItem>
	)
}

export default GridEarnings