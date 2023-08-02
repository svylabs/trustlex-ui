import MainLayout from "~/components/MainLayout/MainLayout";
//import { Mermaid, MermaidProps } from "./mermaid";
import React from "react";
import Faq from "react-faq-component";

/*
const CoreProtocol = () => {
    const mermaidProps: MermaidProps = {
        text: `sequenceDiagram
    box Trustlex Cross Chain Exchange Protocol <br/> Alice has tokens like ETH, USDT, or other coins and wants to exchange for native BTC, <br/> Bob has native BTC and wants to exchange BTC for ETH or other tokens
    actor Alice
    participant Trustlex Contract
    actor Bob
    end 
    Alice->>+Trustlex Contract: 1. I want to sell 10 ETH(or USDT/other tokens) for 1 BTC <br> and receive BTC in xyz address
    Trustlex Contract-->>+Trustlex Contract: Adds the offer to Order book
    Bob->>Trustlex Contract: 2. Show me the list of offers available for ETH-BTC pair
    Trustlex Contract-->>Bob: List of offers
    Bob->>Trustlex Contract: 3. Chooses an offer and initiates fulfillment of the <br/>selected offer.. can be fractional too
    Bob->>Alice: 4. Sends the right amount of BTC to the <br/> address registered in the offer
    Bob->>Trustlex Contract: 5. Sends merkle proof of the payment transaction
    Trustlex Contract-->>Trustlex Contract: Verifies merkle proof and output amounts
    Trustlex Contract-->>Bob: Releases ETH / token`
   };
    
      return (
        <div>
          <Mermaid {...mermaidProps} />
        </div>
      );
}

*/

const CoreProtocol = () => {
  return (
    <>
      <img src="./images/protocol.svg" />
    </>
  );
};

interface QuestionAndAnswer {
  index: number;
  question: String;
  answer: String;
}

const QA: React.FC<QuestionAndAnswer> = ({ index, question, answer }) => {
  return (
    <div style={{ margin: 20 }}>
      <h4 color="white" style={{ margin: 5 }}>
        {"Q: "} {question}
      </h4>
      <h4 color="grey" style={{ margin: 5 }}>
        {"A: "} {answer}
      </h4>
    </div>
  );
};

const FAQ = () => {
  const data = {
    title: "Frequently Asked Questions",
    rows: [
      {
        title: "How does the protocol work?",
        content: `Trustlex is an orderbook dex protocol where users holding ETH or other crypto assets / tokens can post their offers. The holders of BTC wanting to swap their BTC for other crypto assets can fulfill those offers by executing the following three steps <br/>
                &#09; a. Initiate Fulfillment <br/>
                &#09; b. Send BTC to the address <br/>
                &#09; c. Post a payment proof
                `,
      },
      {
        title:
          "Is this protocol exclusively usable for exchanging Bitcoin to Alternate Crypto assets",
        content: `Yes, this protocol is exclusive to exchange Bitcoin to other Crypto assets.
                `,
      },
      {
        title:
          "Is there a company / custodian holding the funds on behalf of users",
        content: `Trustlex is a decentralized protocol and there is no company or custodian holding your funds. Alternate crypto assets like ETH / other tokens are held by the smart contract running on the network, and any BTC you send is directly sent to the address that the counterparty has access to. 
                `,
      },
      {
        title: "What happens when I add an offer?",
        content: `Adding an offer means, offering alternate crypto assets in exchange for BTC in a trustless, non-custodial manner. You identify the asset you want to exchange, the quantity and set the offer price that is acceptable to you and add your offer. By adding an offer, you are sending your ETH / other tokens to the smart contract.
                `,
      },
      {
        title: "When does my offer get fulfilled?",
        content: `Your offer is registered in the contract and gets fulfilled when someone holding BTC wants to exchange their BTC for the tokens and find your offer price attractive.
                `,
      },
      {
        title:
          "What happens when the offer price of crypto asset in relation to BTC is less than the market price?",
        content: `Unfortunately, the smart contract is not aware of the market price. This can potentially be implemented in the future. But for the time being, you have to set a price which you are willing to exchange.
                `,
      },
      {
        title: "I hold BTC, how can I buy other crypto assets?",
        content: `First you need to select what asset you want to buy with your BTC, and make sure it's available in the network of your preference. Then you browse the list of offers and find an offer that's acceptable to you and begin the swap process.
                Swap process takes 3 steps. <br><br>
                1. <b>Initialize Fulfillment:</b> You choose how much quantity of the crypto asset you want to buy and initialize fulfillment.  <br>
                2. <b>Generate a BTC address and send funds:</b> You can generate BTC address specific to your initialized fulfillment which the counterparty has control over and send the BTC to that address. <br>
                3. <b>Submit payment proof:</b>  You have 24 hours to post payment proof after you initialized the fulfillment. Once you have sent funds and waited the required number of confirmations(usually 6), you can post the payment proof. The crypto assets are released to your ETH address if the contract is able to verify the proof. <br>
                `,
      },
      {
        title: "How do you generate the BTC address?",
        content: `At the time of creating an offer, the user can generate a wallet in browser(support for hardware wallets is coming soon) a hash of the public key will be registered along with the offer. The BTC address generated is a P2WSH address based on the hash of your public key and the orderId. OrderId  in computed in the following manner <br>
                
                orderId = keccack(orderBookContractAddress + orderId + fulfillmentId + pubkeyHash + orderTimestamp) // returns 32 bytes
                shortOrderId = first 4 bytes of orderId. 

                P2WSH address is computed from this script:
                ORDER_ID OP_DROP OP_DUP OP_HASH160 <pubkeyHash> OP_EQUAL_VERIFY OP_CHECK_SIG
                `,
      },
      {
        title: "How does the contract verify the payment transaction?",
        content: `The exchange contract depends on a contract that tracks Bitcoin Block headers. Once a proof is posted, the exchange contract checks  <br>
                1. If the transaction has the correct outputs (P2WSH address and value) <br>
                2. Verifies if the transaction is available in the specified block by checking merkleproof.
                `,
      },
      {
        title: "BTC has been received in the address, how can I spend it?",
        content: `To spend the BTC received, you can either use the UI tool provided or you can import the P2WSH script to a supported wallet and spend it. You have to make sure you download the private key and store it safely. If you lose it you will not be able to spend the bitcoins.
                `,
      },
      {
        title: "Where can I find the whitepaper for the project?",
        content: `Whitepaper can be found <a href="https://github.com/svylabs/trustlex/tree/main/docs/whitepaper.pdf">here</a>
                `,
      },
    ],
  };
  const config = {
    animate: true,
    arrowIcon: "V",
    tabFocus: true,
  };
  return (
    <Faq
      data={data}
      styles={{
        bgColor: "00FFFFFF",
        titleTextColor: "white",
        rowTitleColor: "white",
        rowTitleTextSize: "large",
        rowContentColor: "grey",
        arrowColor: "white",
      }}
      config={{ ...config, expandIcon: "+", collapseIcon: "-" }}
    />
  );
};

const ProtocolDocs = () => {
  return (
    <MainLayout title="Trustlex Protocol" description="">
      <CoreProtocol />
      <FAQ />
    </MainLayout>
  );
};

export default ProtocolDocs;
