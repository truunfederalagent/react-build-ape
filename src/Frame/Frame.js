import React from "react";
import "./Frame.css";
import Picker from "../Picker/Picker";
import {AssetService} from "../AssetService";
import {Chip} from "@mui/material";

class Frame extends React.Component{
    constructor(props) {
        super(props);
        this.state = this.props.start ?
            this.props.start : {
                "background": '',
                "fur": '',
                "skin": '',
                "eyes": '',
                "line": '',
                "chest": '',
                "shirts": '',
                "coats": '',
                "neck": '',
                "face": '',
                "facial": '',
                "mouth": '',
                "hair": '',
                "headwear": '',
                "hand": ''
        }
    }

    saveApe= () => {

        if (this.state.background && this.state.fur && this.state.skin && this.state.line){
            fetch(`https://truape.dev/apes`,
                {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Allow-Origin': '*'
                    },
                    body: JSON.stringify({
                        wallet: this.props.wallet,
                        items: {...this.state}
                    })
                })
                .then(response => {
                    this.clearAssets();

                })
        }

    }

    onAssetAdd = (category, asset) => {
        const newState = {...this.state}
        newState[category] = asset;
        this.setState(newState)
    }

    removeAsset = (key) => {
        const newState = {...this.state}
        newState[key] = '';
        this.setState(newState)
    }

    clearAssets = () => {
        const newState = {...this.state};
        for (let key of Object.keys(newState)){
            newState[key] = '';
        }
        this.setState(newState);
    }
    render() {
        console.log('rendering');
        const keys = Object.keys(this.state).filter(key => this.state[key] !== '').sort(key => AssetService.assets.indexOf(key));
        return (
            <div>
                <div className="frame">
                    {keys.map((key) => {

                        return <img
                            key={this.state[key]}
                            className={"picked"}
                            src={`https://apes.algorillas.builders/new_${this.state[key]}`}
                            style={{zIndex: AssetService.assets.indexOf(key)}}
                            alt={""}
                            />;

                    })}
                </div>


                <div className={"chipContainer"}>
                    {keys.map(key => {
                        return <Chip
                            color={"primary"}
                            key={key}
                            label = {AssetService.getDisplayName(this.state[key])}
                            variant="outlined"
                            onDelete={() => this.removeAsset(key)}
                        />
                    })}
                </div>
                <Picker
                    assets={this.state}
                    onAssetAdd={this.onAssetAdd}
                    saveApe={this.saveApe}
                />
            </div>
        )
    }
}

export default Frame;
