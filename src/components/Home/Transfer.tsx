import { MDBInput, MDBJumbotron } from "mdbreact";

export function Transfer({ tokenSymbol = 'N/A', transferTokens = (to: string, amount: string) => {} }) {
  return (
    <MDBJumbotron>
      <h4>Transfer</h4>
      <form
        onSubmit={(event) => {
          // This function just calls the transferTokens callback with the
          // form's data.
          event.preventDefault();
          // @ts-ignore
          const formData = new FormData(event.target);
          const to = formData.get("to");
          const amount = formData.get("amount");

          if (to && amount) {
            transferTokens(to.toString(), amount.toString());
          }
        }}
      >
        <div className="form-group">
          <label>Amount of {tokenSymbol}</label>
          <div className="grey-text">
              <MDBInput label="Amount" icon="dollar-sign" name="amount"  type="number" placeholder="1 (DFL)" required />
          </div>
        </div>
        <div className="form-group">
          <div className="grey-text">
              <MDBInput label="Recipient Address" icon="key" name="to" placeholder="0x0cc7db2fbfc2b0c61e77047fbb2b8bfb93e43e67" required />
          </div>
        </div>

        <div className="form-group">
          <input className="btn btn-primary" type="submit" value="Transfer" />
        </div>
      </form>
      </MDBJumbotron>
  );
}