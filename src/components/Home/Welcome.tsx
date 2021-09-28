
export function Welcome({
    tokenName = '-',
    tokenSymbol = 'N/A',
    selectedAddress = '',
    balance = '0'
}): JSX.Element {
    return (
        <div className="row">
          <div className="col-12">
            <h1>
              {tokenName} ({tokenSymbol})
            </h1>
            <p>
              <i className="fas fa-key"></i> {" "}
               Address: <b>{selectedAddress}</b>
               <br></br>
               <i className="fas fa-hand-holding-usd"></i>  Balance:{" "}
              <b>
                {balance.toString()} {tokenSymbol}
              </b>
              .
            </p>
          </div>
        </div>
    );
}