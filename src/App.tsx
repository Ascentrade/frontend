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

// MUI & Toolpad
import { Alert } from '@mui/material';
import RadarIcon from '@mui/icons-material/Radar';
import SearchIcon from '@mui/icons-material/Search';
import DashboardIcon from '@mui/icons-material/Dashboard';
//import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import SavingsIcon from '@mui/icons-material/Savings';
//import QueryStatsIcon from '@mui/icons-material/QueryStats';
import { AppProvider } from '@toolpad/core/react-router-dom';
import { type Navigation } from '@toolpad/core';

import { Outlet } from 'react-router-dom';
import { useTranslation } from "react-i18next";

import './App.css'
import DisclaimerDialog from './components/disclaimer-dialog';

import theme from './theme';


function App(props:any) {
	const { t } = useTranslation();

	const NAVIGATION: Navigation = [
		{
			kind: 'header',
			title: 'Security Details',
		},
		{
			title: t('overview'),
			segment: '',
			icon: <DashboardIcon />,
		},
		/*{
			title: t('fundamentals'),
			segment: 'fundamentals',
			icon: <AccountBalanceIcon />,
		},*/
		{
			title: t('dividends'),
			segment: 'dividends',
			icon: <SavingsIcon />,
		},
		/*{
			title: t('indicators'),
			segment: 'indicators',
			icon: <QueryStatsIcon />,
		},*/
		{
			kind: 'divider',
		},
		{
			kind: 'header',
			title: 'Tools',
		},
		{
			title: t('search-stocks'),
			segment: 'search',
			icon: <SearchIcon />,
		},
		{
			title: 'Screener',
			segment: 'screener',
			icon: <RadarIcon />,
		},
	];
	
	const BRANDING = {
		title: 'Ascentrade',
		logo: <img src="/icon.svg" alt="Ascentrade Logo" />,
	};

	return (
		<AppProvider navigation={NAVIGATION} branding={BRANDING} theme={theme}>
			<DisclaimerDialog />
			<Alert severity="info">{t("demo-text")}</Alert>
			<Outlet {...props}/>
		</AppProvider>
	)
}

export default App