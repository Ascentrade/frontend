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
import { useLazyQuery, gql } from '@apollo/client';
import { useTranslation } from 'react-i18next';

// MUI
import Typography from '@mui/material/Typography';
import {  PageContainer, useLocalStorageState } from '@toolpad/core';
import { axisClasses, BarChart } from '@mui/x-charts';

import CustomAlert from '../components/custom-alert';


const QUERY = gql`
	query security($id: Int!) {
		security(id: $id) {
			name
			dividends {
				date
				declaration_date
				record_date
				payment_date
				period
				adjusted_value
				value
			}
		}
	}
`;


function DividendsPage() {
	const { t } = useTranslation();
	const [selectedSecurityId, _] = useLocalStorageState('selected-security-id', 0);
	const [getDividends, { loading, error, data }] = useLazyQuery(QUERY);

	useEffect(() => {
		if(selectedSecurityId !== 0){
			getDividends({variables:{id:Number(selectedSecurityId)}});
		}
	}, [selectedSecurityId]);

	const chartSetting = {
		yAxis: [
			{label: t("dividends")},
		],
		sx: {
			[`.${axisClasses.left} .${axisClasses.label}`]: {
				transform: 'translate(-10px, 0)',
			},
		},
	};

	return (
		<PageContainer maxWidth="xl" title={data?.security?.name ? data?.security?.name : "Dashboard"}>
			<Typography>{t("dividends")}</Typography>
			{(error ? <CustomAlert text="Error while fetching security data!"/> : 
				<BarChart
					loading={loading}
					dataset={(data?.security?.dividends ? data?.security?.dividends : [])}
					xAxis={[{ scaleType: 'band', dataKey: 'date' }]}
					series={[
						{ dataKey: 'value', label: 'Dividend/Share', valueFormatter: (_, {dataIndex}) => {
							if(dataIndex >= 0){
								return `${data?.security?.dividends[dataIndex].value} $`;
							}
							return "";
						} },
					]}
					{...chartSetting}
				/>
			)}
		</PageContainer>
	)
}

export default DividendsPage