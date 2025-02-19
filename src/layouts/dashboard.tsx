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

import { Outlet } from 'react-router-dom';

import { DashboardLayout } from '@toolpad/core/DashboardLayout';

import SidebarFooter from '../components/sidebar-footer';
import ToolbarActions from '../components/toolbar-actions';
import CustomAppTitle from '../components/custom-app-title';
import { Alert } from '@mui/material';

import { useTranslation } from 'react-i18next';

export default function Layout() {
	const { t } = useTranslation();

	return (
		<DashboardLayout slots={{
			appTitle: CustomAppTitle,
			toolbarActions: ToolbarActions,
			sidebarFooter: SidebarFooter
		}}>
			<Alert severity="info">{t("demo-text")}</Alert>
			<Outlet />
		</DashboardLayout>
	);
}
