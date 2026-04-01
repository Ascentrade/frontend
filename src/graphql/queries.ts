/**
 * @copyright Copyright (C) 2026 Dennis Einloft <dev@greguhn.de>
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

import { gql } from '@apollo/client';

export const GET_AI_RESPONSE = gql`
  query GetAiResponse($date: Date!) {
    getAiResponse(date: $date) {
      timestamp
      response
      confidence
      score
    }
  }
`;

export const GET_AI_RESPONSES_SERIES = gql`
  query GetAiResponsesSeries {
    getAiResponsesSeries {
      date
      confidence
      score
    }
  }
`;

export const GET_HISTORICAL_DATA = gql`
  query GetHistoricalData {
    getHistoricalData {
      date
      open
      high
      low
      close
      volume
      ema20
      sma50
      sma200
      rsi
      bbPc
      adx
      dmip
      dmim
    }
  }
`;
