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
            rebirthed: -1
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

                this.setState({savedApes: result.saved, rebirthed: result.ape_id})
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

                this.setState({savedApes: this.state.savedApes, rebirthed: apeId})

            })
    }

    cancelRebirth = () => {
        fetch(`https://truape.dev/apes/rebirth/${this.props.wallet}`,
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
                this.setState({savedApes: this.state.savedApes, rebirthed: -1})
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
                                        chosen={ this.state.rebirthed === ape[0] }
                                        key={`saved${index}`}
                                        saved={ape}
                                    />
                                </div>
                                {
                                    (this.state.rebirthed === -1) && <Button
                                        key={`rebirth${index}`}
                                        className={"rebirthButton"}
                                        variant={"contained"}
                                        onClick={() => this.requestRebirth(ape[0])}
                                    >
                                        Rebirth Ape
                                    </Button>
                                }
                                {
                                    (this.state.rebirthed === ape[0]) &&
                                    <Button
                                        key={`cancelrebirth${index}`}
                                        className={"rebirthButton"}
                                        variant={"contained"}
                                        onClick={() => this.cancelRebirth()}
                                    >
                                        Cancel Rebirth
                                    </Button>
                                }
                                {
                                    (this.state.rebirthed !== ape[0]) && <IconButton
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
