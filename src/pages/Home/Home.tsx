import React from "react";
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
import { AddOfferWithEth, AddOfferWithToken } from "~/service/AppService";

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

  const { userInputData, setUserInputData } = context;
  const { width } = useWindowDimensions();
  const settings = {
    dots: false,
    arrow: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    rows: 1,
    initialSlide: 1,
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setUserInputData((prev) => {
      return { ...prev, limit: e.target.value };
    });

  const handleConfirmClick = async () => {
    console.log("Offer confirmed");
    if (userInputData.activeExchange[0].currency === "eth") {
      const data = {
        satoshis: 1,
        bitcoinAddress: `0x5078d53e9347ca2Ee42b6cFfC01C04b69ff9420A`,
        offerValidTill: 1,
      };
      const addedOffer = await AddOfferWithEth(data);
      if (addedOffer.hash !== "") {
        navigate("/exchange");
        console.log(addedOffer.hash);
      }
    } else {
      const data = {
        value: 1,
        satoshis: 1,
        bitcoinAddress: `0x5078d53e9347ca2Ee42b6cFfC01C04b69ff9420A`,
        offerValidTill: 1,
      };
      const addedOffer = await AddOfferWithToken(data);
      if (addedOffer.hash !== "") {
        console.log(addedOffer.hash);
        navigate("/exchange");
      }
    }
  };

  return (
    <div className={styles.root}>
      <h1 className={styles.pageTitle}>Home</h1>
      <p className={styles.pageDesc}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </p>

      <div className={styles.mainContent}>
        {width !== null && width < 1360 ? (
          <div className={styles.slider}>
            <Slider {...settings}>
              <HomepageCard
                color="#fd90d1b3"
                icon="/icons/Activity.png"
                title="Supported networks / assets"
                value="5 networks, 25 pairs"
              />
              <HomepageCard
                color="#67D558b3"
                icon="/icons/Lock.png"
                title="Total Value Locked"
                value="$ 1.6 Billion"
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
              value="5 networks, 25 pairs"
            />
            <HomepageCard
              color="#67D558b3"
              icon="/icons/Lock.png"
              title="Total Value Locked"
              value="$ 1.6 Billion"
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
      </div>
    </div>
  );
};

export default Home;
