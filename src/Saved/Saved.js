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
                                        key={`saved${index}`}
                                        saved={ape}
                                    />
                                </div>


                                {
                                    <IconButton
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
