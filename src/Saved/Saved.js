import React from "react";
import "./Saved.css"
import Button from "@mui/material/Button";
import {IconButton} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete'
import {AssetService} from "../AssetService";

function SavedApe(props) {
    return (

        <div className={props.chosen ? "chosenFrame" : "savedFrame"}>
            {
                props.saved.slice(2, props.saved.length)
                    .map(asset =>
                        asset ?
                            (<div>
                                <img
                                    src={`https://apes.algorillas.builders/${asset}`}
                                    key={asset}
                                    className={"picked"}
                                />

                            </div>) : "")
            }
        </div>

    )
}


class Saved extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            savedApes: [],
            requested: []
        }
    }

    componentDidMount() {
        this.getApes();
    }

    editSaved = (index) => {
        let selected = this.state.savedApes[index];
        selected = selected.slice(2, selected.length);
        const assets = {};
        AssetService.assets.map((asset, index) => {
            assets[asset] = selected[index];
        })
        this.props.editSaved(assets)
    }

    getApes = () => {
        const url = `https://truape.dev/apes/${this.props.wallet}`
        fetch(url, {
            headers: {
                'Authorization': `Bearer ${this.props.token}`
            }
        })
            .then(response => response.json())
            .then(result => {
                this.setState({savedApes: result.saved, requested: result.requested})
            })
    }

    requestRebirth = (apeId) => {
        const url = `https://truape.dev/apes/rebirth/${this.props.wallet}/${apeId}`
        fetch(url,{
            method: 'POST',
            mode: 'cors',
            headers: {
            'Content-Type': 'application/json',
                'Access-Allow-Origin': '*',
                'Authorization': `Bearer ${this.props.token}`
            }})
            .then(response => {
                const requested = [...this.state.requested, apeId]
                this.setState({savedApes: this.state.savedApes, requested: requested})

            })
    }

    cancelRebirth = (index) => {
        const apeId = this.state.savedApes[index][0];
        const requestIndex = this.state.requested.indexOf(apeId);
        fetch(`https://truape.dev/apes/rebirth/${this.props.wallet}/${apeId}`,
            {
                method: 'DELETE',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Allow-Origin': '*',
                    'Authorization': `Bearer ${this.props.token}`
                },

            })
            .then(response => {
                const requested = [...this.state.requested];
                requested.splice(requestIndex, 1);
                this.setState({savedApes: this.state.savedApes, requested: requested})
            })

    }
    deleteSaved = (index) => {
        const apeId = this.state.savedApes[index][0]
        fetch(`https://truape.dev/apes/${this.props.wallet}/${apeId}`,
            {
                method: 'DELETE',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Allow-Origin': '*',
                    'Authorization': `Bearer ${this.props.token}`
                },

            })
            .then(response => {
                const newsSaved = [...this.state.savedApes];
                newsSaved.splice(index, 1);
                this.setState({savedApes: newsSaved});
            })
    }

    render() {
        return (
            <div className={"savedContainer"}>
                {

                    this.state.savedApes.map((ape, index) => {
                        return (
                            <div>
                                <div onClick={() => this.editSaved(index)}>
                                    <SavedApe
                                        chosen={ this.state.requested.indexOf(ape[0]) >= 0 }
                                        key={`saved${index}`}
                                        saved={ape}
                                    />
                                </div>
                                {
                                    (this.state.requested.indexOf(ape[0]) == -1) && <Button
                                        key={`rebirth${index}`}
                                        className={"rebirthButton"}
                                        variant={"contained"}
                                        onClick={() => this.requestRebirth(ape[0])}
                                    >
                                        Rebirth Ape
                                    </Button>
                                }
                                {
                                    (this.state.requested.indexOf(ape[0]) >= 0) &&
                                    <Button
                                        key={`cancelrebirth${index}`}
                                        className={"rebirthButton"}
                                        variant={"contained"}
                                        onClick={() => this.cancelRebirth(index)}
                                    >
                                        Cancel Rebirth
                                    </Button>
                                }
                                {
                                    (this.state.requested.indexOf(ape[0]) === -1) && <IconButton
                                        key={`delete${index}`}
                                        onClick={() => this.deleteSaved(index)}
                                        className={"deleteSaved"}
                                    >
                                        <DeleteIcon/>
                                    </IconButton>
                                }
                            </div>)
                    })
                }
            </div>
        )
    }
}

export default Saved;
