import MainLayout from "~/components/MainLayout/MainLayout"
import { Mermaid, MermaidProps } from "./mermaid";
import React from "react";
import Faq from 'react-faq-component';


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

interface QuestionAndAnswer {
    index: number;
    question: String;
    answer: String;
}

const QA: React.FC<QuestionAndAnswer> = ({index, question, answer}) => {
    return (
        <div style={{margin: 20}}>
            <h4 color="white" style={{margin: 5}}>
                {"Q: "} {question}
            </h4> 
            <h4 color="grey" style={{margin: 5}}>
                {"A: "} {answer}
            </h4>
        </div>
    );
}

const FAQ = () => {
    const data = {
        title: "Frequently Asked Questions",
        rows: [
            {
                title: "How does the protocol work?",
                content: "Trustlex is an orderbook dex protocol, different from other AMM protocols. Users post "
            },
            {
                title: "I have BTC, how do I exchange for other tokens",
                content: `Find what tokens are available in the platform, and once you have found the token you want\n and an offer that's acceptable to you, 
                you can complete the 3 step process \n
                    \ta. Initiate Fulfillment, \n
                    \tb. Send BTC to the address, \n 
                    \tc. Post a payment proof
                `
            }
        ]
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
                bgColor: '00FFFFFF',
                titleTextColor: "white",
                rowTitleColor: "white",
                rowTitleTextSize: "large",
                rowContentColor: "grey",
                arrowColor: "white",
            }}
            config={{ ...config, expandIcon: "+", collapseIcon: "-" }}
        
        />
    );
}

const ProtocolDocs = () => {
    return (
        <MainLayout
            title="Protocol FAQ"
            description="How the trustlex protocol works"
        >
            <CoreProtocol/>
            <FAQ/>
    </MainLayout>);
}

export default ProtocolDocs