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
