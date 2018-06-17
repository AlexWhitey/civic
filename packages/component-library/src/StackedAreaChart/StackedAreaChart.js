import React, { PropTypes } from 'react';
import { css } from 'emotion';
import { groupBy } from 'lodash';
import {
  VictoryAxis,
  VictoryChart,
  VictoryLabel,
  VictoryPortal,
  VictoryScatter,
  VictoryTooltip,
  VictoryStack,
  VictoryArea
} from 'victory';

import ChartContainer from '../ChartContainer';
import SimpleLegend from '../SimpleLegend';
import { numeric } from '../utils/formatters';
import { chartEvents, getDefaultStackedDomain, getDefaultDataSeriesLabels, getDefaultFillStyle, getDefaultLineStyle } from '../utils/chartHelpers';
import CivicVictoryTheme from '../VictoryTheme/VictoryThemeIndex';

const StackedAreaChart = ({
  data,
  dataKey,
  dataKeyLabel,
  dataValue,
  dataValueLabel,
  dataSeries,
  dataSeriesLabel,
  domain,
  size,
  style,
  subtitle,
  title,
  xLabel,
  yLabel,
  xNumberFormatter,
  yNumberFormatter,
}) => {
  const chartDomain = domain ? domain : null;

  // Right now we're letting VictoryCharts determine the default domain if none is passed in.
  // To use custom default domain function (not currently finished), use this instead:
  // const chartDomain = domain || getDefaultStackedDomain(data, dataKey, dataValue);

  const dataSeriesLabels = dataSeries
    ? dataSeriesLabel || getDefaultDataSeriesLabels(data, dataSeries)
    : null;

  const scatterPlotStyle = style || getDefaultFillStyle(dataSeriesLabels);

  const legendData =
    dataSeriesLabels && dataSeriesLabels.length
      ? dataSeriesLabels.map(series => ({ name: series.label }))
      : null;

  const categoryData =
    dataSeriesLabels && dataSeriesLabels.length
      ? dataSeriesLabels.map(series => ({ name: series.category }))
      : null;

  const lineData = dataSeries
    ? groupBy(data, dataSeries)
    : { category: data };

  const lines = lineData
    ? Object.keys(lineData).map((category, index) =>
      <VictoryArea
        data={lineData[category].map(d => ({
          dataKey: d[dataKey],
          dataValue: d[dataValue],
          series: d[dataSeries],
        }))}
        x="dataKey"
        y="dataValue"
        style={getDefaultLineStyle(index)}
        standalone={false}
      />
      )
    : null;

    const dots = lineData
    ? Object.keys(lineData).map((category, index) =>
      <VictoryScatter
        data={lineData[category].map(d => ({
          dataKey: d[dataKey],
          dataValue: d[dataValue],
          series: d[dataSeries],
          label: `${dataKeyLabel ? dataKeyLabel : xLabel}: ${xNumberFormatter(d[dataKey])} • ${dataValueLabel ? dataValueLabel : yLabel}: ${yNumberFormatter(d[dataValue])}`,
          size: size ? d[size.key] || size.value : 3,
        }))}
        animate={{ onEnter: { duration: 500 } }}
        x="dataKey"
        y="dataValue"
        standalone={false}
        size={d => d.size}
        style={scatterPlotStyle}
        title="Scatter Plot"
        events={chartEvents}
        labelComponent={
          <VictoryTooltip
            x={325}
            y={0}
            orientation="bottom"
            pointerLength={0}
            cornerRadius={0}
            theme={CivicVictoryTheme.civic}
          />
        }
      />
      )
    : null;

  return (
    <ChartContainer title={title} subtitle={subtitle}>
      {legendData && (
        <SimpleLegend className="legend" legendData={legendData} />
      )}

      <VictoryChart
        domain={chartDomain}
        padding={{ left: 75, right: 50, bottom: 50, top: 50 }}
        theme={CivicVictoryTheme.civic}
      >
        <VictoryAxis
          animate={{ onEnter: { duration: 500 } }}
          style={{ grid: { stroke: 'none' } }}
          tickFormat={x => xNumberFormatter(x)}
          title="X Axis"
        />
        <VictoryAxis
          dependentAxis
          animate={{ onEnter: { duration: 500 } }}
          style={{
            // Don't render the top y-axis grid line
            // TODO: Possibly move this to theme
            grid: {
              ...CivicVictoryTheme.civic.axis.style.grid,

              // I don't know why we're omitting the top grid line. It doesn't make sense to me from a data viz perspective.
              // If we do want to go back to omitting the top line, use this code.
              // Keep in mind it relies on chartDomain, for which the helper function is not done yet.
              // stroke: t =>
              //   t < chartDomain.y[1]
              //     ? CivicVictoryTheme.civic.axis.style.grid.stroke
              //     : 'none',
              stroke: CivicVictoryTheme.civic.axis.style.grid.stroke,
            },
          }}
          tickFormat={y => yNumberFormatter(y)}
          title="Y Axis"
        />
        <VictoryPortal>
          <VictoryLabel
            style={{ ...CivicVictoryTheme.civic.axisLabel.style }}
            text={yLabel}
            textAnchor="middle"
            title="Y Axis Label"
            verticalAnchor="end"
            x={75}
            y={45}
          />
        </VictoryPortal>
        <VictoryPortal>
          <VictoryLabel
            style={{ ...CivicVictoryTheme.civic.axisLabel.style }}
            text={xLabel}
            textAnchor="end"
            title="X Axis Label"
            verticalAnchor="end"
            x={600}
            y={295}
          />
        </VictoryPortal>
        <VictoryStack>
          { lines }
        </VictoryStack>
        <VictoryStack>
          { dots }
        </VictoryStack>
      </VictoryChart>
    </ChartContainer>
  );
};

StackedAreaChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({ x: PropTypes.number, y: PropTypes.number }),
  ),
  dataKey: PropTypes.string,
  dataKeyLabel: PropTypes.arrayOf(PropTypes.string),
  dataValue: PropTypes.string,
  dataValueLabel: PropTypes.arrayOf(PropTypes.string),
  dataSeries: PropTypes.string,
  dataSeriesLabel: PropTypes.arrayOf(
    PropTypes.shape({ category: PropTypes.string, label: PropTypes.string }),
  ),
  domain: PropTypes.objectOf(PropTypes.array),
  size: PropTypes.shape({ key: PropTypes.string, value: PropTypes.string }),
  style: PropTypes.objectOf(PropTypes.object),
  subtitle: PropTypes.string,
  title: PropTypes.string,
  xLabel: PropTypes.string,
  yLabel: PropTypes.string,
  xNumberFormatter: PropTypes.func,
  yNumberFormatter: PropTypes.func,
};

StackedAreaChart.defaultProps = {
  data: null,
  dataKey: 'x',
  dataKeyLabel: null,
  dataValue: 'y',
  dataValueLabel: null,
  dataSeries: null,
  dataSeriesLabel: null,
  domain: null,
  size: null,
  style: null,
  subtitle: null,
  title: null,
  xLabel: "X",
  yLabel: "Y",
  xNumberFormatter: numeric,
  yNumberFormatter: numeric,
};

export default StackedAreaChart;
