import React from "react";

import {
    type CivilizationData,
} from "../../readCoreData";

interface Props {
    currentCivID: number;
    civilizationsMap: Map<number, CivilizationData>;
    onChange: (newCivID: number) => void;
}

export function CivilizationSelector(props: Props) {
    const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        props.onChange(parseInt(e.target.value));
    };

    return <select value={props.currentCivID} onChange={onChange}>
        {
            Array.from(props.civilizationsMap)
                .sort(([_, a], [__, b]) => a.name.localeCompare(b.name))
                .map(([k, v]) =>
                    <option key={k} value={k}>{v.name}</option>
                )
        }
    </select>;
}

