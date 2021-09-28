import React from "react";

import { MDBContainer, MDBRow, MDBCol, MDBJumbotron, MDBTypography } from 'mdbreact';

export function ConnectWallet(
  { connectWallet } : { connectWallet: () => {} }
) {
  return (
    <MDBContainer className="mt-5 text-center">
      <MDBRow>
        <MDBCol>
          <MDBJumbotron style={{ backgroundImage: `url(https://mdbcdn.b-cdn.net/img/Photos/Others/gradient1.jpg)` }}>
              <MDBTypography className="h2 display-3 text-white">Connect to your wallet</MDBTypography>
              <p className="lead">
                  Transfer some DFL token
              </p>             
              <form>
                <div className="text-center">
                  <button className="btn btn-warning" type="button"onClick={connectWallet}>Connect</button>
                </div>
              </form>          
          </MDBJumbotron>
       </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

// type OnClickEvent = React.MouseEventHandler<HTMLButtonElement>;
// export function ConnectWallet(
//   { connectWallet, networkError, dismiss } : { connectWallet: () => {}, networkError: string, dismiss: OnClickEvent }
// ) {
//   return (
//     <div className="container">
//       <div className="row justify-content-md-center">
//         <div className="col-12 text-center">
//           {/* Metamask network should be set to Localhost:8545. */}
//           {networkError && (
//             <NetworkErrorMessage 
//               message={networkError} 
//               dismiss={dismiss} 
//             />
//           )}
//         </div>
//         <div className="col-6 p-4 text-center">
//           <p>Please connect to your wallet.</p>
//           <button
//             className="btn btn-warning"
//             type="button"
//             onClick={connectWallet}
//           >
//             Connect Wallet
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
