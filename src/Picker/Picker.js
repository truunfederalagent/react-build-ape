import React from "react";
import Selector from "../Selector/Selector";
import {AssetService} from "../AssetService";
import "./Picker.css"
import {Button, MobileStepper} from "@mui/material";
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';


class Picker extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            activeStep: 0
        }

    }

    handleNext = () => {
        const newStep = (this.state.activeStep + 1) % 15;
        this.setState({activeStep: newStep})
    }

    handleBack = () => {
        const newStep = (this.state.activeStep - 1 + 15) % 15;
        this.setState({activeStep: newStep})
    }

    render() {

        return (
            <div className="pickerContainer">
                {
                    (this.props.assets['background'] &&
                        this.props.assets['fur'] &&
                        this.props.assets['skin'] &&
                        this.props.assets['line']) ?
                        (<div className={"saveContainer"}>
                            <Button
                                variant={"contained"}
                                onClick={this.props.saveApe}
                            >
                                Save Ape
                            </Button>
                        </div>): ""
                }
                <div className={"stepper"}>
                    <div className={"stepperContainer"}>
                    <MobileStepper
                        variant="dots"
                        steps={15}
                        activeStep={this.state.activeStep}
                        position={"relative"}
                        sx={{maxWidth: 450, flexGrow: 1, margin: "0 auto"}}
                        nextButton={
                            <Button size="small" onClick={this.handleNext}>
                                Next<KeyboardArrowRight/>
                            </Button>
                        }
                        backButton={
                            <Button size="small" onClick={this.handleBack}>
                                <KeyboardArrowLeft/>Back
                            </Button>
                        }
                    />
                    </div>
                    <div>
                        <p>{AssetService.assets[this.state.activeStep]}</p>
                    </div>

                </div>
                <Selector
                    assets={AssetService.getFilesByAssetGroup(AssetService.assets[this.state.activeStep])}
                    category={AssetService.assets[this.state.activeStep]}
                    onAssetSelected={this.props.onAssetAdd}
                />
            </div>

        )
    }
}

export default Picker;
