import React from "react";
import ReactECharts from "echarts-for-react";

import {parseJSON} from "@msagl/parser";
import {Renderer} from "@msagl/renderer";

import {
    type CoreData,
    //type CivilizationData,
    //type StationTypeData,
    //type DevelopmentData,
} from "../../readCoreData";

import {
    getReachableBuyables,
    analyzeTechTreeDependencies,
} from "../../analyzer";

import {CivilizationSelector} from "../common/CivilizationSelector";

import "./index.css";

/*** ***/

interface Props {
    coreData: CoreData;
}

interface State {
    civID: number;
}

export class TechTreeView extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        const civData = Array.from(this.props.coreData.civilizations.values())[0];
        if (!civData) throw new Error("Unexpected undefined value.");
        this.state = {
            civID: civData.civID,
        };
    }

    override async componentDidMount() {
        const graph = parseJSON({
            nodes: [{id: 'kspacey'}, {id: 'swilliams'}, {id: 'kbacon'}, {id: 'bpitt'}, {id: 'hford'}, {id: 'lwilson'}],
            edges: [
                {source: 'kspacey', target: 'swilliams'},
                {source: 'swilliams', target: 'kbacon'},
                {source: 'bpitt', target: 'kbacon'},
                {source: 'hford', target: 'lwilson'},
                {source: 'lwilson', target: 'kbacon'},
            ],
        })
        console.log(graph);

        const elem = document.querySelector("#tech-tree-view--msagl-container");
        if (!elem) throw new Error("Expected an element.");
        const renderer = new Renderer(elem as HTMLElement);
        console.log(renderer);
    }

    override render() {
        console.log(this.props);

        return <>
            <p>
                <CivilizationSelector
                    currentCivID={this.state.civID}
                    civilizationsMap={this.props.coreData.civilizations}
                    onChange={(e) => this._onFactionChange(e)}
                />
            </p>
            <div id="tech-tree-view--msagl-container"></div>
            <ReactECharts option={this._getEChartsOption()} />
        </>;
    }

    private _onFactionChange(newCivID: number): void {
        this.setState({
            civID: newCivID,
        });
    }

    private _getEChartsOption() {
        const civData = this.props.coreData.civilizations.get(this.state.civID);
        if (!civData) throw new Error("Unexpected undefined value.");
        const reachables = getReachableBuyables(this.props.coreData, civData);
        console.log(analyzeTechTreeDependencies(reachables));

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

