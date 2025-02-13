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

import { useEffect, useState } from 'react'

// MUI
import { DataGrid, GridColDef, GridColumnGroupingModel, GridRenderCellParams } from '@mui/x-data-grid';
import Typography from '@mui/material/Typography';
import { Box, Chip, Stack } from '@mui/material';

// Icons
import NorthEastIcon from '@mui/icons-material/NorthEast';
import SouthEastIcon from '@mui/icons-material/SouthEast';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

// GraphQL
import { useLazyQuery, gql } from '@apollo/client';

// Custom Components
import CustomAlert from '../components/custom-alert';
import { PageContainer } from '@toolpad/core';
import EmptyHeader from '../components/empty-header';


const QUERY = gql`
	query screenerSecurities($name: String) {
		screenerSecurities(name:$name) {
			id
			code
			name
			type
			last_quote {
				adjusted_close
			}
			marketcap
			beta
			indicators
		}
	}
`;

function daysSince(dateString: string): number|null {
	const pastDate = new Date(dateString);
	if (isNaN(pastDate.getTime())) {
		return null;
	}
	const today = new Date();
	const differenceInMilliseconds = today.getTime() - pastDate.getTime();
	const millisecondsPerDay = 1000 * 60 * 60 * 24;
	return Math.floor(differenceInMilliseconds / millisecondsPerDay);
}


function ScreenerPage() {
	const columns: GridColDef[] = [
		{ field:'code', headerName:'Ticker', width:130, sortable:true, type:'string', pinnable: true,
			renderCell: (params: GridRenderCellParams<any, string>) => (<div><Stack direction="column">
				<Typography variant="body1">{params.row.code}</Typography>
				<Typography color="textSecondary" variant="caption">  {params.row.name}</Typography>
			</Stack></div>)
		},
		{ field: 'type', headerName: 'Type', width: 70 },
		{ field: 'marketcap', headerName: 'MCap [B$]', type:'number', width: 115,
			valueFormatter:(value) => {return (value ? `${(value/1000000000).toFixed(3)}` : null)},
		},
		{ field: 'last', headerName: 'Last [$]', type:'number', width: 100,
			valueGetter:(_, row) => {return row?.last_quote?.adjusted_close},
			valueFormatter:(value) => {return (value ? Number(value).toFixed(2) : null)},
		},
		{ field: 'beta', headerName: 'Beta', type:'number', width: 50,
			valueFormatter:(value) => {return (value ? Number(value).toFixed(2) : null)},
		},
		// Daily
		{ field: 'adx_crossing_date_d', headerName: 'ADX Crossing', type:'string', width: 140,
			valueGetter:(_, row) => {return row?.indicators?.adx_crossing_date_d},
			valueFormatter:(value) => {return (value ? `${value} (${daysSince(value)})` : null)},
		},
		{ field: 'bb_pc_d', headerName: 'BB%', type:'number', width: 60,
			valueGetter:(_, row) => {return row?.indicators?.bb_pc_d},
			valueFormatter:(value) => {return Number(value).toFixed(1)},
		},
		{ field: 'adx_d', headerName: 'ADX', type:'number', width: 60,
			valueGetter:(_, row) => {return row?.indicators?.adx_d},
			valueFormatter:(value) => {return Number(value).toFixed(1)},
		},
		{ field: 'adx_slope_d', headerName: 'ADX', type:'boolean', width: 50,
			renderCell: (params: GridRenderCellParams<any, number>) => ((params.row?.indicators?.adx_slope_d ? <NorthEastIcon/> : <SouthEastIcon/>))
		},
		{ field: 'dmi_bull_d', headerName: 'DMI', type:'boolean', width: 50,
			renderCell: (params: GridRenderCellParams<any, number>) => ((params.row?.indicators?.dmi_bull_d ? <TrendingUpIcon color="success"/> : <TrendingDownIcon color="error"/>))
		},
		{ field: 'psar_bull_d', headerName: 'PSAR', type:'boolean', width: 60,
			renderCell: (params: GridRenderCellParams<any, number>) => ((params.row?.indicators?.psar_bull_d ? <TrendingUpIcon color="success"/> : <TrendingDownIcon color="error"/>))
		},
		// Weekly
		{ field: 'adx_crossing_date_w', headerName: 'ADX Crossing', type:'string', width: 140,
			valueGetter:(_, row) => {return row?.indicators?.adx_crossing_date_w},
			valueFormatter:(value) => {return (value ? `${value} (${daysSince(value)})` : null)},
		},
		{ field: 'bb_pc_w', headerName: 'BB%', type:'number', width: 60,
			valueGetter:(_, row) => {return row?.indicators?.bb_pc_w},
			valueFormatter:(value) => {return Number(value).toFixed(1)},
		},
		{ field: 'adx_w', headerName: 'ADX', type:'number', width: 60,
			valueGetter:(_, row) => {return row?.indicators?.adx_w},
			valueFormatter:(value) => {return Number(value).toFixed(1)},
		},
		{ field: 'adx_slope_w', headerName: 'ADX', type:'boolean', width: 50,
			renderCell: (params: GridRenderCellParams<any, number>) => ((params.row?.indicators?.adx_slope_w ? <NorthEastIcon/> : <SouthEastIcon/>))
		},
		{ field: 'dmi_bull_w', headerName: 'DMI', type:'boolean', width: 50,
			renderCell: (params: GridRenderCellParams<any, number>) => ((params.row?.indicators?.dmi_bull_w ? <TrendingUpIcon color="success"/> : <TrendingDownIcon color="error"/>))
		},
		{ field: 'psar_bull_w', headerName: 'PSAR', type:'boolean', width: 60,
			renderCell: (params: GridRenderCellParams<any, number>) => ((params.row?.indicators?.psar_bull_w ? <TrendingUpIcon color="success"/> : <TrendingDownIcon color="error"/>))
		},
		// Monthly
		{ field: 'adx_crossing_date_m', headerName: 'ADX Crossing', type:'string', width: 140,
			valueGetter:(_, row) => {return row?.indicators?.adx_crossing_date_m},
			valueFormatter:(value) => {return (value ? `${value} (${daysSince(value)})` : null)},
		},
		{ field: 'bb_pc_m', headerName: 'BB%', type:'number', width: 60,
			valueGetter:(_, row) => {return row?.indicators?.bb_pc_m},
			valueFormatter:(value) => {return Number(value).toFixed(1)},
		},
		{ field: 'adx_m', headerName: 'ADX', type:'number', width: 60,
			valueGetter:(_, row) => {return row?.indicators?.adx_m},
			valueFormatter:(value) => {return Number(value).toFixed(1)},
		},
		{ field: 'adx_slope_m', headerName: 'ADX', type:'boolean', width: 50,
			renderCell: (params: GridRenderCellParams<any, number>) => ((params.row?.indicators?.adx_slope_m ? <NorthEastIcon/> : <SouthEastIcon/>))
		},
		{ field: 'dmi_bull_m', headerName: 'DMI', type:'boolean', width: 50,
			renderCell: (params: GridRenderCellParams<any, number>) => ((params.row?.indicators?.dmi_bull_m ? <TrendingUpIcon color="success"/> : <TrendingDownIcon color="error"/>))
		},
		{ field: 'psar_bull_m', headerName: 'PSAR', type:'boolean', width: 60,
			renderCell: (params: GridRenderCellParams<any, number>) => ((params.row?.indicators?.psar_bull_m ? <TrendingUpIcon color="success"/> : <TrendingDownIcon color="error"/>))
		},
	];

	const columnGroupingModel: GridColumnGroupingModel = [
		{
		  groupId: 'Daily',
		  children: [
				{ field: 'adx_crossing_date_d' },
				{ field: 'bb_pc_d' },
				{ field: 'adx_d' },
				{ field: 'adx_slope_d' },
				{ field: 'dmi_bull_d' },
				{ field: 'psar_bull_d' },
			]
		},
		{
			groupId: 'Weekly',
			children: [
				{ field: 'adx_crossing_date_w' },
				{ field: 'bb_pc_w' },
				{ field: 'adx_w' },
				{ field: 'adx_slope_w' },
				{ field: 'dmi_bull_w' },
				{ field: 'psar_bull_w' },
			]
		},
		{
			groupId: 'Monthly',
			children: [
				{ field: 'adx_crossing_date_m' },
				{ field: 'bb_pc_m' },
				{ field: 'adx_m' },
				{ field: 'adx_slope_m' },
				{ field: 'dmi_bull_m' },
				{ field: 'psar_bull_m' },
			]
		},
	];

	const [filterName, setFilterName] = useState("sector-etfs");
	const [getSecurities, { loading, error, data }] = useLazyQuery(QUERY, {
		fetchPolicy: 'network-only', // Doesn't check cache before making a network request
	});

	useEffect(() => {
		getSecurities({variables:{name:filterName}});
	}, [filterName]);

	return (
		<PageContainer sx={{ minWidth: "100%" }} slots={{header:EmptyHeader}}>
			<Box visibility={(loading ? "hidden" : "visible")}>
				<Stack sx={{marginBottom:1}} direction="row" spacing={1}>
					<Chip label="Sector ETFs" onClick={() => {setFilterName("sector-etfs")}}/>
					<Chip color="success" label="ADX Golden Crossing" onClick={() => {setFilterName("adx-long-crossing")}}/>
					<Chip color="success" label="ADX Super Bull" onClick={() => {setFilterName("adx-bull")}}/>
					<Chip color="error" label="ADX Golden Crossing" onClick={() => {setFilterName("adx-short-crossing")}}/>
					<Chip color="error" label="ADX Super Bear" onClick={() => {setFilterName("adx-bear")}}/>
				</Stack>
			</Box>
			{(error ? <CustomAlert text="Error while fetching data!"/> : 
				<DataGrid
					autoPageSize
					loading={loading}
					rowHeight={48}
					rows={data?.screenerSecurities}
					columns={columns}
					columnGroupingModel={columnGroupingModel}
				/>
			)}
		</PageContainer>
	)
}

export default ScreenerPage