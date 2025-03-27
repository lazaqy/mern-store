import Axios from "./Axios";
import SummaryApi from "../common/SummaryApi";

const getUserDetails = async () => {
  try {
    const response = await Axios(SummaryApi.getUserDetails);
    return response;
  } catch (error) {
    return error;
  }
};

export default getUserDetails;