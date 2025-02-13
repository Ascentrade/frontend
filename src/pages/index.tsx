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
import { useEffect } from 'react'

// MUI
import Typography from '@mui/material/Typography';
import { Box, CircularProgress } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { PageContainer, useLocalStorageState } from '@toolpad/core';

import { useLazyQuery, gql } from '@apollo/client';
import CustomAlert from '../components/custom-alert';
import GridItem from '../components/grid-item';
import WelcomePage from './welcome';
import GridDividend from '../components/grid-dividend';
import GridMarketcap from '../components/grid-marketcap';
import GridEarnings from '../components/grid-earnings';


const QUERY = gql`
	query security($id: Int!) {
		security(id: $id) {
			id
			code
			type
			name
			description
			marketcap
			beta
			sector
			industry
			logo_url
			
			dividend_share
			dividend_yield

			pe_ratio
			earnings_share
			eps_estimate_current_year
			eps_estimate_next_year

			profit_margin

			indicators

			wallstreet_target_price
			analyst_ratings{
				date_added
				rating
				target_price
				strong_buy
				buy
				hold
				sell
				strong_sell
			}
		}
	}
`;


function OverviewPage() {
	const [selectedSecurityId, _] = useLocalStorageState('selected-security-id', 0);
	const [getStock, { loading, error, data }] = useLazyQuery(QUERY);

	useEffect(() => {
		if(selectedSecurityId !== 0){
			getStock({variables:{id:Number(selectedSecurityId)}});
		}
	}, [selectedSecurityId]);

	if(selectedSecurityId === undefined || selectedSecurityId === null || selectedSecurityId === 0){
		return (
			<WelcomePage />
		);
	}

	return (
		<PageContainer maxWidth="xl" title={data?.security?.name ? data?.security?.name : "Dashboard"}>
			{(loading ? <CircularProgress /> : (error ? 
				<CustomAlert text="Error while fetching security data!"/> :
				
				<Grid container spacing={2}>
					<Grid size={3}>
						<GridMarketcap marketcap={data?.security?.marketcap}/>
					</Grid>
					<Grid size={3}>
						<GridDividend divShare={data?.security?.dividend_share} divYield={data?.security?.dividend_yield}/>
					</Grid>
					<Grid size={6}>
						<GridEarnings 
							per={data?.security?.pe_ratio}
							eps={data?.security?.earnings_share}
							epsCurrentYear={data?.security?.eps_estimate_current_year}
							epsNextYear={data?.security?.eps_estimate_next_year}
						/>
					</Grid>
					<Grid size={4}>
						<GridItem>
							<Box 
								component="img"
								alt={data?.security?.name}
								src={import.meta.env.VITE_ASSET_URL + data?.security?.logo_url}
							/>
						</GridItem>
					</Grid>
					<Grid size={8}>
						<GridItem>
							<Typography textAlign="left">{data?.security?.description}</Typography>
						</GridItem>
					</Grid>
				</Grid>
			
			))}
		</PageContainer>
	);
}

export default OverviewPage