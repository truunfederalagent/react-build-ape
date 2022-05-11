import './App.css';
import Frame from "./Frame/Frame";
import * as React from "react";
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import MyAlgoConnect from "@randlabs/myalgo-connect";
import {AppBar, Box, IconButton, Toolbar} from "@mui/material";
import {PeraWalletConnect} from "@perawallet/connect";
import {useEffect} from "react";

const wallets = ['PeraWallet', 'MyAlgoWallet']
const myAlgoConnect = new MyAlgoConnect();
const peraWallet = new PeraWalletConnect();
function connectWallet(walletType, onWalletConnectedListener, onWalletDisconnectedListener) {
    if (walletType === 'MyAlgoWallet'){
        myAlgoConnect.connect({shouldSelectOneAccount: true})
            .then(accounts => {
                console.log(accounts[0].address)
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


function ButtonAppBar(props) {
    const [open, setOpen] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState('');

    const handleClickOpen = () => {
        setOpen(true);
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
                            sx={{mr: 2}}
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                            APEs Rebirth
                        </Typography>
                        <Button onClick={handleClickOpen} color="inherit">Connect
                            Wallet</Button>
                    </Toolbar>
                </AppBar>
            </Box>
            <SimpleDialog onClose={handleClose} open={open} selectedValue={selectedValue}/>
        </div>
    );
}




export class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            wallet: '',
        }


    }



    onWalletSelected = (wallet, walletType) => {
        this.setState({wallet: wallet});
    }

    onWalletDisconnected = () => {
        peraWallet.disconnect();
        this.setState({wallet: '', walletType: ''})
    }

    render() {


        return (
            <div>
                <ButtonAppBar
                    onSelectWalletListener={this.onWalletSelected}
                    onWalletDisconnectListener={this.onWalletDisconnected}
                />
                {
                    this.state.wallet &&
                    <Frame/>
                }
            </div>);

    }
}

export default App;
