import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Top from "../components/Top";
import { LoginContext } from "../context/Context";

export default function Contact() {
  const { user } = React.useContext(LoginContext);
  return (
    <>
      <Header />
      <Top
        img={
          "https://img.freepik.com/free-vector/flat-design-illustration-customer-support_23-2148887720.jpg?size=626&ext=jpg&ga=GA1.2.1798755424.1682915885&semt=ais"
        }
        headtext={"Contact us"}
        text={"Get in touch with us"}
      />
      <div className="mx-auto w-11/12 md:w-1/2 my-2 py-3">
        <p className="text-[20px] text-red-500">
          We are here to help and answer any question you might have. We look
          forward to hearing from you.
        </p>
        <input
          className="w-full my-2 py-2 px-4 border-2 border-blue-700 rounded-md focus:outline-none bg-white"
          type="text"
          name="name"
          placeholder="Name"
          required
        />
        <input
          className="w-full my-2 py-2 px-4 border-2 border-blue-700 rounded-md focus:outline-none bg-white"
          type="text"
          name="email"
          placeholder="Email"
          required
        />
        <p className="text-[16px]  my-2 py-2 px-4 border-2 border-blue-700 font-[700] text-[#23262F]  rounded-md ">
          +{user.mobile_number}
        </p>
        <textarea
          className="w-full my-2 py-2 px-4 border-2 border-blue-700 rounded-md focus:outline-none bg-white"
          name="message"
          placeholder="Message"
          required
        ></textarea>
        <p className="my-2 px-3 py-2 bg-blue-700 cursor-pointer text-white w-full text-center mx-auto" onClick={()=>{window.location.reload()}}>Submit</p>
      </div>
      <Footer />
    </>
  );
}
