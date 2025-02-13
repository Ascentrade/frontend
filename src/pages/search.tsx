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

import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// MUI
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import { ListItemButton } from '@mui/material';

import { useLocalStorageState } from '@toolpad/core/useLocalStorageState';

import { useLazyQuery, gql } from '@apollo/client';

import CustomAlert from '../components/custom-alert';
import { PageContainer } from '@toolpad/core';

const SEARCH_STOCKS_QUERY = gql`
	query searchSecurity($searchText: String!) {
		searchSecurity(searchText: $searchText, limit:8) {
			id
			code
			name
			type
			exchange_code
		}
	}
`;

function SearchPage() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [searchString, setSearchString] = useState("");
	const [, setSelectedSecurityId] = useLocalStorageState('selected-security-id', 0);

	const [searchStocks, { loading, error, data }] = useLazyQuery(SEARCH_STOCKS_QUERY);

	function handleChange(text:string){
		setSearchString(text);
		if(text && text.length > 0){
			searchStocks({variables:{searchText:text}});
		}
	}

	return (
		<PageContainer>
			<Typography>{t('search')}</Typography>
			<TextField value={searchString} onChange={e => handleChange(e.target.value)} />
			{(
				loading ? <CircularProgress /> : (error ? <CustomAlert text="Error while fetching data!"/> : 

				searchString.length > 0 ? <List>
					{data?.searchSecurity?.map((e: { id: number; code: string; exchange_code: string; name: string; type: string; }) => {
						return(
							// Set selected security ID and change to dashboard
							<ListItemButton key={e.id} onClick={() => {setSelectedSecurityId(e.id); navigate("/")}}>
								<ListItem>
									<ListItemText primary={e.code + "." + e.exchange_code} secondary={e.name + " (" + e.type + ")"} />
								</ListItem>
							</ListItemButton>
						)
					})}
				</List> : <></>
			)
			)}
		</PageContainer>
	)
}

export default SearchPage