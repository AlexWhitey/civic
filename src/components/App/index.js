/* eslint-disable import/no-extraneous-dependencies */
// This should probably be the core component, containing, nav etc

import React from 'react';
import { connect } from 'react-redux';

import Slider from '@hackoregon/component-library/lib/Slider/Slider';
import StoryCard from '@hackoregon/component-library/lib/StoryCard/StoryCard';

import { fetchAffordabilityData } from '../../state/affordability/actions';
import { fetchRentData } from '../../state/rent/actions';
import { fetchNeighborhoods } from '../../state/neighborhoods/actions';
import { isAnyCallPending, getCombinedNeighborhoodsData } from '../../state/globalSelectors';
import Map from '../Map';

import {
  updateOtherUnitSize,
  updateOtherDemographic,
  updateUserIncome,
  updateUserUnitSize,
} from '../../state/parameters/actions';
import {
  getUserIncome,
  getUserUnitSize,
  getOtherDemographic,
  getOtherUnitSize,
} from '../../state/parameters/selectors';
import {
  DEMOGRAPHICS,
  UNIT_SIZES_AFFORDABILITY,
  UNIT_SIZES_RENT,
  DEFAULT_INCOME,
  MIN_INCOME,
  MAX_INCOME,
} from '../../utils/data-constants';

export class App extends React.Component {
  componentDidMount() {
    this.props.fetchAllData();
  }

  render() {
    const {
      neighborhoodData,
      userIncome,
      userUnitSize,
      setUserIncome,
      setUserUnitSize,
      otherDemographic,
      otherUnitSize,
      setOtherUnitSize,
      setOtherDemographic,
    } = this.props;

    return (
      <div>
        <StoryCard title="Portland Neighborhood Affordability" collectionId="housing" cardId="affordability-map">
          <p className="description">Compare your income to the average income of common demographics.</p>
          <strong>Your income: ${userIncome.toFixed(2)}/hr</strong>
          <Slider
            min={MIN_INCOME}
            max={MAX_INCOME}
            value={userIncome}
            onChange={setUserIncome}
          />
          <p className="description">
            <strong>Your Housing Type: </strong>
            <select value={userUnitSize} onChange={event => setUserUnitSize(event.target.value)}>
              {UNIT_SIZES_RENT.map(size => (
                <option value={size} key={size}>{size}</option>
              ))}
            </select>
          </p>
          <p className="description">
            <strong>Others Housing Type: </strong>
            <select value={otherUnitSize} onChange={event => setOtherUnitSize(event.target.value)}>
              {UNIT_SIZES_AFFORDABILITY.map(size => (
                <option value={size} key={size}>{size}</option>
              ))}
            </select>
          </p>
          <p className="description">
            <strong>Others Demographic: </strong>
            <select
              value={otherDemographic}
              onChange={event => setOtherDemographic(event.target.value)}
            >
              {DEMOGRAPHICS.map(demo => (
                <option value={demo} key={demo}>{demo}</option>
              ))}
            </select>
          </p>
          <Map neighborhoods={neighborhoodData} />
        </StoryCard>
      </div>
    );
  }
}

App.displayName = 'App';
App.defaultProps = {
  children: <div />,
  neighborhoodData: {},
  userIncome: DEFAULT_INCOME,
  userUnitSize: UNIT_SIZES_AFFORDABILITY[0],
  setUserIncome: () => {},
  setUserUnitSize: () => {},
  otherDemographic: DEMOGRAPHICS[0],
  otherUnitSize: UNIT_SIZES_AFFORDABILITY[0],
  setOtherDemographic: () => {},
  setOtherUnitSize: () => {},
  isLoading: false,
  fetchAllData: () => {},
};

App.propTypes = {
  neighborhoodData: React.PropTypes.object,
  setOtherDemographic: React.PropTypes.func,
  setOtherUnitSize: React.PropTypes.func,
  otherDemographic: React.PropTypes.string,
  otherUnitSize: React.PropTypes.string,
  userIncome: React.PropTypes.number,
  userUnitSize: React.PropTypes.string,
  setUserIncome: React.PropTypes.func,
  setUserUnitSize: React.PropTypes.func,
  fetchAllData: React.PropTypes.func,
};

const mapDispatch = (dispatch) => {
  const fetchAllData = () => {
    dispatch(fetchAffordabilityData());
    dispatch(fetchRentData());
    dispatch(fetchNeighborhoods());
  };

  return {
    fetchAllData,
    setOtherUnitSize: (size) => {
      dispatch(updateOtherUnitSize(size));
      dispatch(fetchAffordabilityData());
    },

    setOtherDemographic: (demographic) => {
      dispatch(updateOtherDemographic(demographic));
      dispatch(fetchAffordabilityData());
    },

    setUserIncome: (income) => {
      dispatch(updateUserIncome(income));
      // no call here, will filter
    },

    setUserUnitSize: (size) => {
      dispatch(updateUserUnitSize(size));
      dispatch(fetchRentData());
    },
  };
};

const mapProps = state => ({
  neighborhoodData: getCombinedNeighborhoodsData(state),
  isLoading: isAnyCallPending(state),
  userIncome: getUserIncome(state),
  userUnitSize: getUserUnitSize(state),
  otherDemographic: getOtherDemographic(state),
  otherUnitSize: getOtherUnitSize(state),
});

export default connect(mapProps, mapDispatch)(App);
