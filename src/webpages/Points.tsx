import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Top from "../components/Top";
import { LoginContext } from "../context/Context";
import { API_BASE_URL } from "../constants/data";
import axios from "axios";

export default function Points() {
  const { user, setLoading, decrypt, setMessage, setMessageType, setShow } =
    React.useContext(LoginContext);

  const [points, setPoints] = React.useState<any>([]);
  const ApiCall = React.useRef(() => {});

  ApiCall.current = async () => {
    setLoading(true);
    let { data } = await axios.get(`${API_BASE_URL}profile/point/history`, {
      headers: {
        Authorization: "Bearer " + user.token,
      },
    });
    data = decrypt(data.result);
    if (!data.isError) {
      setPoints(data.modal);
      setLoading(false);
      console.log(data);
    } else {
      setLoading(false);
      setMessageType("error");
      setMessage(data.message);
      setShow(true);
    }
  };

  React.useEffect(() => {
    ApiCall.current();
  }, []);

  return (
    <>
      <Header />
      <Top
        img={
          "https://img.freepik.com/free-vector/grades-concept-illustration_114360-628.jpg?size=626&ext=jpg&ga=GA1.2.1798755424.1682915885&semt=ais"
        }
        headtext={
          user.total_point
            ? "Your Points - " + user.total_point
            : "Login to see your points"
        }
      />
      <p className="text-red-500 text-[24px] md:text-[30px] my-2 text-center underline">
        Your Points history
      </p>

      <div className="w-11/12 md:w-10/12 mx-auto my-6 flex justify-between items-center md:flex-row flex-col">
        <div className="w-full overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left text-black">Date</th>
                <th className="text-left text-black">Description</th>
                <th className="text-left text-black">Destination</th>
                <th className="text-left text-black">Game</th>
                <th className="text-left text-black">Type</th>
                <th className="text-left text-black">Points</th>
              </tr>
            </thead>
            <tbody>
              {points.map((el: any) => (
                <tr key={el.id}>
                  <td
                    className={`text-left my-2 ${
                      el.point_type === "+" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {new Date(el.created_at).toDateString()}
                  </td>
                  <td
                    className={`text-left my-2 ${
                      el.point_type === "+" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {el.type}
                  </td>
                  <td
                    className={`text-left my-2 ${
                      el.point_type === "+" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {el.destination_detail  ? el.destination_detail.name : "None"}
                  </td>
                  <td
                    className={`text-left my-2 ${
                      el.point_type === "+" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {el.game_detail ? el.game_detail.name : "None"}
                  </td>
                  <td
                    className={`text-left my-2 ${
                      el.point_type === "+" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {el.point_type}
                  </td>
                  <td
                    className={`text-left my-2 ${
                      el.point_type === "+" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {el.point}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </>
  );
}
