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
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './i18n.ts'

// MUI Toolpad
import { CssBaseline } from '@mui/material';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
// Pages & Layout
import Layout from './layouts/dashboard';
import OverviewPage from './pages/index.tsx'
import DividendsPage from './pages/dividends.tsx'
import SearchPage from './pages/search.tsx'
import ScreenerPage from './pages/screener.tsx'

import { ApolloProvider } from '@apollo/client';
import graphQlClient from './graphql-client'


const router = createBrowserRouter([
	{
		Component: App,
		children: [
			{
				path: '/',
				Component: Layout,
				children: [
					{
						path: '',
						Component: OverviewPage,
					},
					/*{
						path: 'fundamentals',
						Component: OverviewPage,
					},*/
					{
						path: 'dividends',
						Component: DividendsPage,
					},
					/*{
						path: 'indicators',
						Component: OverviewPage,
					},*/
					{
						path: 'search',
						Component: SearchPage,
					},
					{
						path: 'screener',
						Component: ScreenerPage,
					},
				],
			},
		],
	},
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<CssBaseline />
		<ApolloProvider client={graphQlClient}>
			<RouterProvider router={router} />
		</ApolloProvider>
	</React.StrictMode>,
)