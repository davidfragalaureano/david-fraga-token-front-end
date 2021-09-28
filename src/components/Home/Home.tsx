import { NoTokensMessage } from "./NoTokenMessage";
import { TransactionHandler } from "./TransactionHandler";
import { Transfer } from "./Transfer";
import { Welcome } from "./Welcome";

export function Home({
    tokenName = 'N/A',
    tokenSymbol = 'N/A',
    selectedAddress = '',
    balance = '0',
    txBeingSent = '',
    transactionError = null,
    dismissTransactionError = () => {},
    transferTokens = (to: string, amount: string) => {} 
  }): JSX.Element {

     // If everything is loaded, we render the application.
     return (
        <div className="container p-4" >          
         <Welcome 
            tokenName={tokenName} 
            tokenSymbol={tokenSymbol} 
            selectedAddress={selectedAddress} 
            balance={balance} />
  
          <hr />

          <TransactionHandler 
            txBeingSent={txBeingSent} 
            transactionError={transactionError} 
            dismissTransactionError={() => dismissTransactionError()} />

          <div className="row">
            <div className="col-12">
              {/*
                If the user has no tokens, we don't show the Tranfer form
              */}
              {Number(balance) === 0 && (
                <NoTokensMessage selectedAddress={selectedAddress} />
              )}
  
              {/*
                This component displays a form that the user can use to send a 
                transaction and transfer some tokens.
                The component doesn't have logic, it just calls the transferTokens
                callback.
              */}
              {Number(balance) > 0 && (
                <Transfer
                  transferTokens={(to, amount) =>                    
                    transferTokens(to, amount)
                  }
                  tokenSymbol={tokenSymbol}
                />
              )}
            </div>
          </div>
        </div>
      );
}