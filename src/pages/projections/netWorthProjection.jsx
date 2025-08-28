/* eslint-disable no-unused-vars */
import Header from "../../components/common/Header";
import Sidebar from "../../components/layout/Sidebar";
import InfoIcon from "../../assets/info.png";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useState, useEffect } from "react";
import AssetInput from "../../components/addAssets/assetInput";
import AssetButton from "../../components/addAssets/assetButton";
import AutoSubmitToken from "../../components/auth/AutoSubmitToken";
import CountrySelect from "../../components/addAssets/countrySelect";
import LoadingButton from "../../components/auth/LoadingButton";
import ProjectionInput from "../../components/addAssets/projectionInput";
import ProjectionSelect from "../../components/addAssets/projectionSelect";
import ProjectionChart from "./netWorthProjectionChart";
import { baseUrl } from "../../utils/baseUrl";
import axios from "axios";
import { TailSpin } from "react-loader-spinner";
import Breadcrumbs from "../../components/common/BreadCrumbs";

const items = [{ label: "Financials > Projection", link: "./" }];

const NetWorthProjectionPage = () => {
  const [formValue, setFormValue] = useState();
  const [timePeriod, setTimePeriod] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [isChartLoading, setChartLoading] = useState(false);
  const [apiCalled, setApiCalled] = useState(false);

  // const options = [
  //     { id: 1, option: "1" },
  //     { id: 2, option: "2" },
  //     { id: 3, option: "3" },
  //   ];
  useEffect(() => {
    setApiCalled(false); // Reset apiCalled state when any form value changes
  }, [
    timePeriod,
    formValue?.currNetWorth,
    formValue?.expSavings,
    formValue?.interest,
  ]);

  const options = [];
  for (let i = 1; i <= 50; i++) {
    options.push({ id: i, option: i.toString() });
  }

  const initialValues = {
    currNetWorth: "",
    expSavings: "",
    interest: "",
  };

  const projectionSchema = Yup.object({
    currNetWorth: Yup.string().required("Current netwoth is required"),
    expSavings: Yup.string().required("Expected savings is required"),
    interest: Yup.string().required("Interest is required"),
  });

  const handleSubmit = async (values) => {
    const token = localStorage.getItem("token");
    setLoading(true);
    setChartLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}user-assets/netWorth/projection`,
        {
          time_period: timePeriod,
          current_net_worth: values?.currNetWorth,
          expected_savings: values?.expSavings,
          anticipated_rate_of_interest: values?.interest,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setChartData(response?.data?.data);
      const successMessage =
        typeof response?.data?.message === "string"
          ? response?.data?.message
          : "Successfully added Stocks details";
      // toast.success(successMessage);
      setLoading(false);
      setChartLoading(false);
      setShowChart(true);
      setApiCalled(true);
    } catch (error) {
      console.log(error?.response?.data?.message);
      setLoading(false);
      setChartLoading(false);
      // toast.error(
      //   error?.response?.data?.message
      //     ? error?.response?.data?.message
      //     : "Please try again"
      // );
    }
  };

  const chartLoading = () => {
    return (
      <div className="w-[100%] h-[403px] flex justify-center items-center">
        <TailSpin
          height="40"
          width="40"
          color="white"
          ariaLabel="tail-spin-loading"
          radius="1"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
      </div>
    );
  };

  return (
    <div className="h-full w-full flex flex-col  items-center text-4xl text-roboto font-[600] text-white bg-black">
      <Header items={items} />
      <div className="self-start ml-6 -mb-5 mt-3">
        <Breadcrumbs items={items} />
      </div>
      <div className="w-[100%] flex items-center justify-between  mt-[32px] px-[5px] md:pl-[24px] md:pr-[28px] pb-[82px] flex-wrap gap-5">
        <div className=" w-[100%] xl:w-[73%] h-[465px] rounded-[2px] bg-[#191919] p-[24px]">
          <h1 className="ml-2 text-[16px] text-[#F6F8FB] text-roboto font-[500] mb-3">
            Net Worth Projection
          </h1>
          {!isChartLoading ? (
            <div>
              {!showChart ? (
                <div className="flex flex-col w-[100%] rounded-[2px] bg-[#191919]">
                  {/* <h1 className="ml-2 text-[16px] text-[#F6F8FB] text-roboto font-[500]">
              Net Worth Projection
            </h1> */}
                  <div className="self-center sm:w-[350px] h-[260px] w-[260px] sm:h-[350px] rounded-[50%] bg-[#3D3D3D] bg-opacity-30 flex flex-col items-center justify-center gap-[20px] mt-[14px]">
                    <img src={InfoIcon} alt="info" />
                    <p className="w-[244px] text-center leading-[20px] text-[#F6F8FB] text-[16px] font-[400] text-roboto">
                      No projection to show!!
                      <br /> Please enter projection value for evaluation.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="w-[100%]">
                  <ProjectionChart data={chartData} />
                </div>
              )}
            </div>
          ) : (
            chartLoading()
          )}
        </div>
        <div className="min-w-[267px] bg-[#191919] w-full md:w-[25%] h-[465px] rounded-[2px] px-[24px] py-[27px] ">
          <p className="text-[16px] font-[500] text-roboto text-[#ffffff] mb-[23px]">
            Calculate
          </p>
          <Formik
            initialValues={initialValues}
            validationSchema={projectionSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form className="flex flex-col">
                <div className="flex flex-row justify-between flex-wrap">
                  <div className=" mb-0 w-[100%]">
                    <ProjectionSelect
                      data={options}
                      placeholder={"Time period (Years)"}
                      setId={setTimePeriod}
                    />
                  </div>
                  <div className="mt-[20px] mb-0 w-[100%]">
                    <ProjectionInput
                      labelText="Current net worth"
                      idText=""
                      name="currNetWorth"
                      htmlForText="currNetWorth"
                      typeText="number"
                      placeHolderText=""
                      errText={errors?.currNetWorth}
                      validation={errors?.currNetWorth && touched?.currNetWorth}
                      password={false}
                      shouldPreventKeys={true}
                      // profileSettings={true}
                    />
                  </div>
                  <div className="mt-[24px] mb-0 w-[100%]">
                    <ProjectionInput
                      labelText="Expected savings"
                      idText="expSavings"
                      name="expSavings"
                      htmlForText="expSavings"
                      typeText="number"
                      placeHolderText=""
                      errText={errors?.expSavings}
                      validation={errors?.expSavings && touched?.expSavings}
                      password={false}
                      shouldPreventKeys={true}
                      // profileSettings={true}
                    />
                  </div>
                  <div className="mt-[24px] mb-0 w-[100%]">
                    <ProjectionInput
                      labelText="Anticipated rate of interest(%)"
                      idText="interest"
                      name="interest"
                      htmlForText="interest"
                      typeText="number"
                      placeHolderText=""
                      errText={errors?.interest}
                      validation={errors?.interest && touched?.interest}
                      password={false}
                      shouldPreventKeys={true}
                      // profileSettings={true}
                    />
                  </div>

                  <AutoSubmitToken setFormValue={setFormValue} />
                </div>
                <div className="mt-[32px] self-end">
                  {loading ? (
                    <div className="mt-1">
                      <LoadingButton />
                    </div>
                  ) : (
                    <AssetButton
                      typeText={"submit"}
                      disabled={
                        errors?.currNetWorth ||
                        errors?.expSavings ||
                        formValue?.currNetWorth?.length < 1 ||
                        formValue?.expSavings?.length < 1 ||
                        errors?.interest ||
                        formValue?.interest?.length < 1 ||
                        timePeriod === null ||
                        apiCalled
                      }
                    >
                      GENERATE
                    </AssetButton>
                  )}
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

const NetWorthProjection = () => {
  return <Sidebar layout={<NetWorthProjectionPage />} />;
};
export default NetWorthProjection;
