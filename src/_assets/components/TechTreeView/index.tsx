import React from "react";
import ReactECharts from "echarts-for-react";

import {
    type CoreData,
    //type CivilizationData,
    //type StationTypeData,
    //type DevelopmentData,
} from "../../readCoreData";

//import {
//    getReachableBuyables,
//    //analyzeTechTreeDependencies,
//} from "../../analyzer";

import {CivilizationSelector} from "../common/CivilizationSelector";

import {
    type GraphNode,
    compileGraphPrerender,
} from "./compileGraphPrerender";

import "./index.css";

/*** ***/

interface DataElem {
    name: string;
    x: number;
    y: number;
    id: string;
}

//function getGraphData(coreData: CoreData, civData: CivilizationData): GraphDataElem[] {
//    const reachables = getReachableBuyables(coreData, civData);
//    console.log(analyzeTechTreeDependencies(reachables));
//
//    const arr: GraphDataElem[] = [];
//    let currY = 0;
//    for (const devData of reachables.developments.values()) {
//        devData;
//        arr.push({
//            id: String(currY),
//            name: devData.name,
//            x: currY,
//            y: currY,
//        });
//        currY += 2000;
//    }
//
//    return arr;
//    //return [
//    //    {
//    //        name: "Node 1",
//    //        x: 300,
//    //        y: 300
//    //    },
//    //    {
//    //        name: "Node 2",
//    //        x: 800,
//    //        y: 300
//    //    },
//    //    {
//    //        name: "Node 3",
//    //        x: 550,
//    //        y: 100
//    //    },
//    //    {
//    //        name: "Node 4",
//    //        x: 550,
//    //        y: 500
//    //    }
//    //];
//}

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

    override render() {
        //console.log(this.props);

        return <>
            <p>
                <CivilizationSelector
                    currentCivID={this.state.civID}
                    civilizationsMap={this.props.coreData.civilizations}
                    onChange={(e) => this._onFactionChange(e)}
                />
            </p>
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

        const graphPrerenderData = compileGraphPrerender(this.props.coreData, civData);
        console.log(graphPrerenderData);

        const data: DataElem[] = [];
        function addData(node: GraphNode, x: number, y: number): {nextLowY: number;} {
            data.push({
                id: node.id,
                name: node.name,
                x: x * 120,
                y: y * 10,
            });
            if (node.children.length === 0) {
                ++y;
            } else {
                for (const child of node.children) {
                    const result = addData(child, x + 1, y);
                    y = result.nextLowY;
                }
            }
            return {nextLowY: y};
        }
        const addDataFinalResult = addData(graphPrerenderData.tree, 0, 0);

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
                    symbol: "rect",
                    symbolSize: [80, 10],
                    height: addDataFinalResult.nextLowY * 10,
                    width: graphPrerenderData.hints.treeDepth * 150,
                    zoom: 5,
                    center: [0, 0],
                    roam: true,
                    label: {
                        show: true
                    },
                    edgeSymbol: ["circle", "arrow"],
                    edgeSymbolSize: [4, 20],
                    edgeLabel: {
                        fontSize: 20
                    },
                    data: data,
                    links: graphPrerenderData.links,
                    // links: [],
                    //links: [
                    //    {
                    //        source: 0,
                    //        target: 1,
                    //        symbolSize: [5, 20],
                    //        label: {
                    //            show: true
                    //        },
                    //        lineStyle: {
                    //            width: 5,
                    //            curveness: 0.2
                    //        }
                    //    },
                    //    {
                    //        source: "Node 2",
                    //        target: "Node 1",
                    //        label: {
                    //            show: true
                    //        },
                    //        lineStyle: {
                    //            curveness: 0.2
                    //        }
                    //    },
                    //    {
                    //        source: "Node 1",
                    //        target: "Node 3"
                    //    },
                    //    {
                    //        source: "Node 2",
                    //        target: "Node 3"
                    //    },
                    //    {
                    //        source: "Node 2",
                    //        target: "Node 4"
                    //    },
                    //    {
                    //        source: "Node 1",
                    //        target: "Node 4"
                    //    }
                    //],
                    lineStyle: {
                        opacity: 1,
                        width: 5,
                        curveness: 0
                    }
                }
            ]
        };
    }
}

