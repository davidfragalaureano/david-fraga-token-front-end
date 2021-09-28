export function TransactionHandler({
    txBeingSent = '',
    transactionError = null,
    dismissTransactionError = () => {}
}): JSX.Element {
  return (
    <div className="row">
        <div className="col-12">
            {/* 
                Sending a transaction isn't an immidiate action. You have to wait
                for it to be mined.
                If we are waiting for one, we show a message here.
            */}
            {txBeingSent && (
                <div className="alert alert-info" role="alert">
                    Waiting for transaction <strong>{txBeingSent}</strong> to be mined
                </div>
            )}

            {/* 
                Sending a transaction can fail in multiple ways. 
                If that happened, we show a message here.
            */}
            {transactionError && (
                <div className="alert alert-danger" role="alert">
                    Error sending transaction: {
                        transactionError ? 
                            // @ts-ignore
                            transactionError.toString() : 
                            'unknown'
                    }
                    <button
                    type="button"
                    className="close"
                    data-dismiss="alert"
                    aria-label="Close"
                    onClick={() => dismissTransactionError()}
                    >
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            )}
        </div>
    </div>
  );   
}