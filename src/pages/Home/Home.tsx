import React from "react";
import { useState, useEffect } from "react";
import Button from "~/components/Button/Button";
import ExchangeSwapGroup from "~/components/ExchangeSwapGroup/ExchangeSwapGroup";
import GradientBackgroundContainer from "~/components/GradientBackgroundContainer/GradientBackgroundContainer";
import HomepageCard from "~/components/HomepageCard/HomepageCard";
import ImageIcon from "~/components/ImageIcon/ImageIcon";
import { InputWithSelect } from "~/components/InputWithSelect/InputWithSelect";
import SpanFullGridWidth from "~/components/SpanFullGridWidth/SpanFullGridWidth";
import { VariantsEnum } from "~/enums/VariantsEnum";
import styles from "./Home.module.scss";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import useWindowDimensions from "~/hooks/useWindowDimesnsion";
import { AppContext } from "~/Context/AppContext";
import { useNavigate } from "react-router-dom";
import MainLayout from "~/components/MainLayout/MainLayout";
import { networks } from "~/Context/Constants";
import { activeExchange, currencyObjects } from "~/Context/Constants";
import {
  getBalance,
  getERC20TokenBalance,
  getEventData,
} from "~/service/AppService";
import { ConvertCrytoToFiat } from "~/helpers/commonHelper";

type Props = {};

const data1 = [
  {
    value: "btc",
    label: "BTC",
    icon: <ImageIcon image={"/icons/bitcoin.svg"} />,
  },
];

const data2 = [
  {
    label: "Limit",
    value: "limit",
  },
  {
    label: "No Limit",
    value: "no-limit",
  },
];

const data3 = [
  {
    value: "eth",
    label: "ETH",
    icon: <ImageIcon image={"/icons/ethereum-2.svg"} />,
  },
  {
    value: "solana",
    label: "SOL",
    icon: <ImageIcon image={"/icons/bitcoin.svg"} />,
  },
];

const Home = (props: Props) => {
  const navigate = useNavigate();
  const context = React.useContext(AppContext);
  if (context === null) {
    return <>Loading...</>;
  }

  const {
    userInputData,
    setUserInputData,
    selectedNetwork,
    selectedToken,
    getSelectedTokenContractInstance,
  } = context;
  const { width } = useWindowDimensions();
  const settings = {
    dots: false,
    arrows: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    rows: 1,
    initialSlide: 1,
  };
  const [totalNetworks, setTotalNetworks] = useState(networks.length);
  const [totalPairs, setTotalPairs] = useState(0);
  const [totalLockedAmount, setTotalLockedAmount] = useState<string>("0");

  const handleLimitChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setUserInputData((prev) => {
      return { ...prev, limit: e.target.value };
    });

  const handleConfirmClick = () => navigate("/exchange");

  const filteredActiveExchange = (includeNonEthereumToken = false) => {
    let filteredActiveExchange: any = activeExchange.filter((value: any) => {
      return includeNonEthereumToken == false
        ? value.isEthereumCahin == true
          ? true
          : false
        : true;
    });
    return filteredActiveExchange;
  };

  async function total_locked_amount() {
    let contractAddress = currencyObjects[selectedNetwork][
      selectedToken.toLowerCase()
    ].orderBookContractAddreess as string;
    let contract_balance = await getBalance(contractAddress);
    return contract_balance;
  }

  async function total_locked_amount_token() {
    let contractAddress = currencyObjects[selectedNetwork][
      selectedToken.toLowerCase()
    ].orderBookContractAddreess as string;

    let ERC20Address = currencyObjects[selectedNetwork][
      selectedToken.toLowerCase()
    ].ERC20Address as string;

    let ERC20ABI =
      currencyObjects[selectedNetwork][selectedToken.toLowerCase()].ERC20ABI;
    console.log(ERC20Address, ERC20ABI);
    let contract_balance = await getERC20TokenBalance(
      contractAddress,
      ERC20Address,
      ERC20ABI
    );
    return contract_balance;
  }
  useEffect(() => {
    let total_pairs = filteredActiveExchange().length;
    setTotalPairs(total_pairs);
    (async () => {
      let isNativeToken =
        currencyObjects[selectedNetwork][selectedToken.toLowerCase()]
          .isNativeToken;
      let label =
        currencyObjects[selectedNetwork][selectedToken.toLowerCase()].label;
      let total_locked_amounts: any = "0";
      if (isNativeToken == true) {
        total_locked_amounts = await total_locked_amount();
      } else if (isNativeToken == false) {
        total_locked_amounts = await total_locked_amount_token();
      }
      total_locked_amounts = await ConvertCrytoToFiat(
        total_locked_amounts,
        label
      );
      // console.log(total_locked_amounts);

      setTotalLockedAmount(total_locked_amounts);
      let contractInstance = await getSelectedTokenContractInstance();
      // console.log(contractInstance);
      if (contractInstance != false) {
        await getEventData(contractInstance);
      }
    })();
  }, [selectedToken]);

  return (
    <MainLayout
      title="Home"
      description="Lorem ipsum dolor sit amet consectetur adipisicing elit."
    >
      {/* <div className={styles.mainContent}> */}
      {width !== null && width < 1360 ? (
        <div className={styles.slider}>
          <Slider {...settings}>
            <HomepageCard
              color="#fd90d1b3"
              icon="/icons/Activity.png"
              title="Supported networks / assets"
              value={`${totalNetworks} Networks, ${totalPairs} Pairs`}
            />
            <HomepageCard
              color="#67D558b3"
              icon="/icons/Lock.png"
              title="Total Value Locked"
              value={`$ ${totalLockedAmount}`}
            />
            <HomepageCard
              color="#78CEF9b3"
              icon="/icons/Chart.png"
              title="Total Transaction Volume (last 24h)"
              value="$ 25 Million"
            />
          </Slider>
        </div>
      ) : (
        <div className={styles.cards}>
          <HomepageCard
            color="#fd90d1b3"
            icon="/icons/Activity.png"
            title="Supported networks / assets"
            value={`${totalNetworks} Networks, ${totalPairs} Pairs`}
          />
          <HomepageCard
            color="#67D558b3"
            icon="/icons/Lock.png"
            title="Total Value Locked"
            value={`$ ${totalLockedAmount}`}
          />
          <HomepageCard
            color="#78CEF9b3"
            icon="/icons/Chart.png"
            title="Total Transaction Volume (last 24h)"
            value="$ 25 Million"
          />
        </div>
      )}

      <div className={styles.bottomSection}>
        <GradientBackgroundContainer
          colorRight="#FEBD38b3"
          colorLeft="#FEBD3833"
        >
          <div className={styles.bottomSectionContent}>
            <SpanFullGridWidth>
              <ExchangeSwapGroup />
            </SpanFullGridWidth>

            <div>
              <div className={styles.homeIndicator}>
                <span></span>
              </div>
              <InputWithSelect
                options={data2}
                type="number"
                placeholder={"Limit price BTC/ETC"}
                value={userInputData.limit}
                onChange={handleLimitChange}
                disabled={userInputData.setLimit ? false : true}
              />
            </div>
            <div className={styles.temporary}></div>
            <div className={styles.temporary}></div>
            <Button
              variant={VariantsEnum.primary}
              radius="md"
              fullWidth
              onClick={handleConfirmClick}
            >
              Confirm
            </Button>
          </div>
        </GradientBackgroundContainer>
      </div>
      {/* </div> */}
    </MainLayout>
  );
};

export default Home;
