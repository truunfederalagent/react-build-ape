import React from "react";
import "./Selector.css"
import {AssetService} from "../AssetService";


class Selector extends React.Component{
    static baseUrl = 'https://apes.algorillas.builders';

    render() {
        const assets = this.props.assets ? this.props.assets : [];

        return (
            <div className="container">
                {assets.map((asset, index) => {
                    return (
                        <div className={"asset"}
                             key={asset}
                        >
                        <img onClick={() => this.props.onAssetSelected(this.props.category, asset) }

                         src={`${Selector.baseUrl}/${asset}`}
                         alt={""}
                        />
                        <p className={"assetLabel"}>{AssetService.getDisplayName(asset)}</p>
                        </div>)})}
            </div>
        )
    }
}

export default Selector;
