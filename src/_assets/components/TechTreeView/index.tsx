import React from "react";
import ReactECharts from "echarts-for-react";

import {
    type CoreData,
    //type CivilizationData,
    //type StationTypeData,
    //type DevelopmentData,
} from "../../readCoreData";

//import {
//    type GroupID,
//} from "../../types";

//import {setDifference} from "../../utils";
import {analyzeTechTreeDependencies} from "../../analyzer";

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

    override render() {
        console.log(this.props);

        return <>
            <ReactECharts option={this._getEChartsOption()} />
        </>;
    }

    private _getEChartsOption() {
        console.log(analyzeTechTreeDependencies(this.props.coreData));

        return {
            //title: {
            //    text: "Basic Graph"
            //},
            tooltip: {},
            animationDurationUpdate: 1500,
            animationEasingUpdate: "quinticInOut",
            series: [
                {
                    type: "graph",
                    layout: "none",
                    symbolSize: 50,
                    roam: true,
                    label: {
                        show: true
                    },
                    edgeSymbol: ["circle", "arrow"],
                    edgeSymbolSize: [4, 10],
                    edgeLabel: {
                    fontSize: 20
                    },
                    data: [
                        {
                            name: "Node 1",
                            x: 300,
                            y: 300
                        },
                        {
                            name: "Node 2",
                            x: 800,
                            y: 300
                        },
                        {
                            name: "Node 3",
                            x: 550,
                            y: 100
                        },
                        {
                            name: "Node 4",
                            x: 550,
                            y: 500
                        }
                    ],
                    // links: [],
                    links: [
                        {
                            source: 0,
                            target: 1,
                            symbolSize: [5, 20],
                            label: {
                                show: true
                            },
                            lineStyle: {
                                width: 5,
                                curveness: 0.2
                            }
                        },
                        {
                            source: "Node 2",
                            target: "Node 1",
                            label: {
                                show: true
                            },
                            lineStyle: {
                                curveness: 0.2
                            }
                        },
                        {
                            source: "Node 1",
                            target: "Node 3"
                        },
                        {
                            source: "Node 2",
                            target: "Node 3"
                        },
                        {
                            source: "Node 2",
                            target: "Node 4"
                        },
                        {
                            source: "Node 1",
                            target: "Node 4"
                        }
                    ],
                    lineStyle: {
                        opacity: 0.9,
                        width: 2,
                        curveness: 0
                    }
                }
            ]
        };
    }
}

