import React from "react";
import ReactECharts from 'echarts-for-react';

import {
    type CoreData,
    //type CivilizationData,
    //type StationTypeData,
    //type DevelopmentData,
} from "../../readCoreData";

//import {
//    type GroupID,
//} from "../../types";

import {setDifference} from "../../utils";

import "./index.css";

/*** ***/

interface Props {
    coreData: CoreData;
}

interface State {
}

export class TechTreeView extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    render() {
        console.log(this.props);

        return <>
            <ReactECharts option={this._getEChartsOption()} />
        </>;
    }

    private _getEChartsOption() {
        return {
            title: {
                text: 'ECharts Getting Started Example'
            },
            tooltip: {},
            legend: {
                data: ['sales']
            },
            xAxis: {
                data: ['Shirts', 'Cardigans', 'Chiffons', 'Pants', 'Heels', 'Socks']
            },
            yAxis: {},
            series: [
                {
                    name: 'sales',
                    type: 'bar',
                    data: [5, 20, 36, 10, 10, 20]
                }
            ]
        };
    }
}

