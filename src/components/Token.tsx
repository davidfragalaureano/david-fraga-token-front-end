import React, { ReactNode } from 'react';

// We'll use ethers to interact with the Ethereum network and our contract
import { ethers, Contract, providers } from "ethers";

// We import the contract's artifacts and address here, as we are going to be
// using them with ethers
import TokenArtifact from "../contracts/Token.sol/Token.json";
import { ConnectWallet } from './ConnectWallet';
import { NoWalletDetected } from './NoWalletDetected';
import { Loading } from './Loading';
import { Home } from './Home/Home';

declare let window: any;
// This is an error code that indicates that the user canceled a transaction
const ERROR_CODE_TX_REJECTED_BY_USER = 4001;

interface ContractProps {
  contractAddress: string;
};

interface ContractState {
    tokenName: string;
    tokenSymbol: string;
    // The user's address and balance
    selectedAddress: string;
    balance: string;
    // The ID about transactions being sent, and any possible error with them
    txBeingSent: string,
    transactionError: Error | null,
    networkError: string,
}

export class Token extends React.Component<ContractProps, ContractState> {

    initialState: ContractState;
    token!: Contract;
    provider!: providers.Web3Provider;
    pollDataInterval!: NodeJS.Timeout;
    contractAddress: string;

    constructor(props: ContractProps) {
        super(props);

        // We store multiple things in Dapp's state.
        // You don't need to follow this pattern, but it's an useful example.
        this.initialState = {
            // contract info
            tokenName: '',
            tokenSymbol: '',
             // The user's address and balance
            selectedAddress: '',
            balance: '',
            // The ID about transactions being sent, and any possible error with them
            txBeingSent: '',
            transactionError: null,
            networkError: '',
        };
        this.contractAddress = props.contractAddress;
        this.state = this.initialState;
        this.intializeEthers();
    }

    render(): ReactNode {    
        // Ethereum wallets inject the window.ethereum object. If it hasn't been
        // injected, we instruct the user to install MetaMask.
        if (window.ethereum === undefined) {
          return <NoWalletDetected />;
        }
        // Ask the user to connect their wallet.
        if (!this.state.selectedAddress) {
            return (                
             <ConnectWallet 
                connectWallet={() => this.connectWallet()}
             />
            );
        }
        // If the token data or the user's balance hasn't loaded yet, we show
        // a loading component.
        if (!this.state.tokenName || !this.state.balance) {
            return <Loading />;
        }
        
        return (
            <Home
                tokenName={this.state.tokenName}
                tokenSymbol={this.state.tokenSymbol}
                selectedAddress={this.state.selectedAddress}
                balance={this.state.balance}
                txBeingSent={this.state.txBeingSent}
                // @ts-ignore
                transactionError={this.state.transactionError}
                dismissTransactionError={() => this.dismissTransactionError()}
                transferTokens={(to: string, amount: string) => this.transferTokens(to, amount)}
                />
        );
    }

    async connectWallet() {
        // This method is run when the user clicks the Connect. It connects the
        // dapp to the user's wallet, and initializes it.
    
        // To connect to the user's wallet, we have to run this method.
        // It returns a promise that will resolve to the user's address.
        const [selectedAddress] = await window.ethereum.request({ method: 'eth_requestAccounts' })
    
        // Once we have the address, we can initialize the application.
      
        this.initialize(selectedAddress);
    
        // We reinitialize it whenever the user changes their account.
        window.ethereum.on("accountsChanged", ([newAddress]: string[]) => {
          this.stopPollingData();
          // `accountsChanged` event can be triggered with an undefined newAddress.
          // This happens when the user removes the Dapp from the "Connected
          // list of sites allowed access to your addresses" (Metamask > Settings > Connections)
          // To avoid errors, we reset the dapp state 
          if (newAddress === undefined) {
            return this.resetState();
          }
          
          this.initialize(newAddress);
        });
        
        // We reset the dapp state if the network is changed
        window.ethereum.on("chainChanged", ([networkId]: string[]) => {
          console.log(`Network changed to ${networkId}`);
          this.stopPollingData();
          this.resetState();
        });
      }

    componentWillUnmount() {
        // We poll the user's balance, so we have to stop doing that when Dapp
        // gets unmounted
        this.stopPollingData();
    }

     // This method sends an ethereum transaction to transfer tokens.
    // While this action is specific to this application, it illustrates how to
    // send a transaction.
    async transferTokens(to: string, amount: string) {
        console.log('transfer called! ' + 'to: ' + to +', amount: ' + amount)
        // Sending a transaction is a complex operation:
        //   - The user can reject it
        //   - It can fail before reaching the ethereum network (i.e. if the user
        //     doesn't have ETH for paying for the tx's gas)
        //   - It has to be mined, so it isn't immediately confirmed.
        //     Note that some testing networks, like Hardhat Network, do mine
        //     transactions immediately, but your dapp should be prepared for
        //     other networks.
        //   - It can fail once mined.
        //
        // This method handles all of those things, so keep reading to learn how to
        // do it.
        try {
            // If a transaction fails, we save that error in the component's state.
            // We only save one such error, so before sending a second transaction, we
            // clear it.
            this.dismissTransactionError();

            // We send the transaction, and save its hash in the Dapp's state. This
            // way we can indicate that we are waiting for it to be mined.
            const tx = await this.token.transfer(to, amount);
            this.setState({ txBeingSent: tx.hash });

            // We use .wait() to wait for the transaction to be mined. This method
            // returns the transaction's receipt.
            const receipt = await tx.wait();

            // The receipt, contains a status flag, which is 0 to indicate an error.
            if (receipt.status === 0) {
                // We can't know the exact error that made the transaction fail when it
                // was mined, so we throw this generic one.
                throw new Error("Transaction failed");
            }

            // If we got here, the transaction was successful, so you may want to
            // update your state. Here, we update the user's balance.
            await this.updateBalance();
        } catch (error: any) {
            // We check the error code to see if this error was produced because the
            // user rejected a tx. If that's the case, we do nothing.
            if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
                return;
            }

            // Other errors are logged and stored in the Dapp's state. This is used to
            // show them to the user, and for debugging.
            console.error(error);
            this.setState({ transactionError: error });
        } finally {
            // If we leave the try/catch, we aren't sending a tx anymore, so we clear
            // this part of the state.
            this.setState({ txBeingSent: '' });
        }
    }


    // The next two methods just read from the contract and store the results
    // in the component state.
    private async getTokenData() {
        const name = await this.token.name();
        const symbol = await this.token.symbol();

        this.setState({ tokenName: name, tokenSymbol: symbol });
    }

    private async updateBalance() {
        const balance = await this.token.balanceOf(this.state.selectedAddress);
        this.setState({ balance });
    }

    private initialize(userAddress: string) {
        // This method initializes the dapp
    
        // We first store the user's address in the component's state
        this.setState({
          selectedAddress: userAddress,
        });
    
        // Then, we initialize ethers, fetch the token's data, and start polling
        // for the user's balance.
    
        // Fetching the token data and the user's balance are specific to this
        // sample project, but you can reuse the same initialization pattern.
        this.intializeEthers();
        this.getTokenData();
        this.startPollingData();
      }
    

    private async intializeEthers() {
        // We first initialize ethers by creating a provider using window.ethereum
        this.provider = new ethers.providers.Web3Provider(window.ethereum);

        // When, we initialize the contract using that provider and the token's
        // artifact. You can do this same thing with your contracts.
        this.token = new ethers.Contract(
            this.contractAddress,
            TokenArtifact.abi,
            this.provider.getSigner(0)
        );
    }

    // The next two methods are needed to start and stop polling data. While
    // the data being polled here is specific to this example, you can use this
    // pattern to read any data from your contracts.
    //
    // Note that if you don't need it to update in near real time, you probably
    // don't need to poll it. If that's the case, you can just fetch it when you
    // initialize the app, as we do with the token data.
    private startPollingData() {
        this.pollDataInterval = setInterval(() => this.updateBalance(), 1000);

        // We run it once immediately so we don't have to wait for it
        this.updateBalance();
    }

    private stopPollingData() {
        clearInterval(this.pollDataInterval);
    }

    // This method just clears part of the state.
    private dismissTransactionError() {
        this.setState({ transactionError: null });
    }

    // This method resets the state
    private resetState() {
        this.setState(this.initialState);
    }

}