import './App.css';
import Frame from "./Frame/Frame";
import * as React from "react";
import PropTypes from 'prop-types';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import MyAlgoConnect from "@randlabs/myalgo-connect";
import {AppBar, Box, IconButton, MenuItem, Toolbar, Typography} from "@mui/material";
import {PeraWalletConnect} from "@perawallet/connect";
import {WalletHelper} from "./WalletHelper";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuIcon from '@mui/icons-material/Menu'
import Saved from "./Saved/Saved";

const wallets = ['PeraWallet', 'MyAlgoWallet']
const myAlgoConnect = new MyAlgoConnect();
const peraWallet = new PeraWalletConnect();

function connectWallet(walletType, onWalletConnectedListener, onWalletDisconnectedListener) {
    if (walletType === 'MyAlgoWallet'){
        myAlgoConnect.connect({shouldSelectOneAccount: true})
            .then(accounts => {
                onWalletConnectedListener(accounts[0].address, walletType);
            });

    }else{
        peraWallet.connect()
            .then(newAccounts => {
                peraWallet.connector.on("disconnect", onWalletDisconnectedListener);
                onWalletConnectedListener(newAccounts[0]);
            })
            .catch(error => {
                peraWallet.reconnectSession()
                    .then(accounts => {
                        peraWallet.connector.on("disconnect", onWalletDisconnectedListener);
                        onWalletConnectedListener(accounts[0]);
                    })
            })

    }


}



function ButtonAppBar(props) {
    const [open, setOpen] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState('');
    const [anchorEl, setAnchorEl] = React.useState(null);

    const menuOpen = Boolean(anchorEl);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        props.viewSavedDesigns()
        setAnchorEl(null);
    };
    const handleMenuCloseSaved = () => {
        props.viewSavedDesigns()
        setAnchorEl(null);
    };

    const handleMenuCloseBuild = () => {
        props.buildApes()
        setAnchorEl(null);
    };

    const handleClickOpen = () => {
        if (!props.wallet){
            setOpen(true);
        }

    };

    const handleClose = (value) => {
        setOpen(false);
        setSelectedValue(value);
        connectWallet(value, props.onSelectWalletListener, props.onWalletDisconnectListener)
    };
    return (
        <div>
            <Box sx={{flexGrow: 1}} className={"header"}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            id="basic-button"
                            aria-controls={menuOpen ? 'basic-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={menuOpen ? 'true' : undefined}
                            onClick={handleMenuClick}
                            sx={{mr: 2}}
                        >
                            <MenuIcon />
                        </IconButton>

                        <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={menuOpen}
                            onClose={handleMenuClose}
                            MenuListProps={{
                                'aria-labelledby': 'basic-button',
                            }}
                        >
                            <MenuItem onClick={handleMenuCloseSaved}>View Saved Apes</MenuItem>
                            <MenuItem onClick={handleMenuCloseBuild} >Build Apes</MenuItem>
                        </Menu>
                        <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                            APEs Rebirth
                        </Typography>
                        <Button onClick={handleClickOpen} color="inherit">
                            {props.wallet ? props.wallet.substring(0, 4) + '...' + props.wallet.substring(props.wallet.length-4, props.wallet.length) : 'Connect Wallet'}
                        </Button>
                    </Toolbar>
                </AppBar>
            </Box>
            <SimpleDialog onClose={handleClose} open={open} selectedValue={selectedValue}/>
        </div>
    );
}



function SimpleDialog(props) {
    const {onClose, selectedValue, open} = props;

    const handleClose = () => {
        onClose(selectedValue);
    };

    const handleListItemClick = (value) => {
        onClose(value);
    };

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>Set backup account</DialogTitle>
            <List sx={{pt: 0}}>
                {wallets.map((wallet) => (
                    <ListItem button onClick={() => handleListItemClick(wallet)} key={wallet}>
                        <ListItemText primary={wallet}/>
                    </ListItem>
                ))}

            </List>
        </Dialog>
    );
}

SimpleDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    selectedValue: PropTypes.string.isRequired,
};


export class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            wallet: '',
            view: 'Frame',
            assets: {},
            token: ''
        }


    }

    editSaved =  (assets) => {
        const newState = {...this.state};
        newState.assets = assets;
        newState.view = 'Frame';
        this.setState(newState)
    }

    viewSavedDesigns = () => {
        const newState = {...this.state};
        newState['view'] = 'Saved';
        this.setState(newState)
    }

    buildApes = () => {
        const newState = {...this.state};
        newState['view'] = 'Frame';
        newState['assets'] = {};
        this.setState(newState)
    }

    onWalletSelected = (wallet) => {
        fetch(`https://truape.dev/apes/token/${wallet}`)
            .then(response => response.text())
            .then(token => {
                this.setState({wallet: wallet, token: token});

            });

    }

    onWalletDisconnected = () => {
        this.setState({wallet: '', apes: null})
    }

    render() {


        return (
            <div>
                <ButtonAppBar
                    wallet={this.state.wallet}
                    onSelectWalletListener={this.onWalletSelected}
                    onWalletDisconnectListener={this.onWalletDisconnected}
                    viewSavedDesigns={this.viewSavedDesigns}
                    buildApes={this.buildApes}

                />
                {
                    this.state.wallet &&  this.state.view === 'Frame' &&
                    <Frame token={this.state.token}
                           start={this.state.assets}
                           wallet={this.state.wallet}
                    />
                }
                {
                    this.state.wallet &&  this.state.view === 'Saved' &&
                        <Saved token={this.state.token}
                               editSaved={this.editSaved}
                               wallet={this.state.wallet}
                        />
                }
            </div>);

    }
}

export default App;
