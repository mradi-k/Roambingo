import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Top from "../components/Top";

export default function About() {
  return (
    <>
      <Header />
      <Top
        img={require("../assets/about.jpg")}
        headtext={"About us"}
        text={"Know us more"}
      />
      <p className="w-11/12 md:w-10/12 mx-auto text-black text-[18px] md:text-[22px]">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex, officia
        neque omnis velit odio ipsa eaque dignissimos accusamus nostrum natus
        voluptatibus dicta veniam quam suscipit quibusdam atque, ipsum odit!
        Corporis voluptas saepe, quibusdam dolore esse odit quo perferendis hic
        ducimus molestiae temporibus earum, nobis sint sunt sequi reprehenderit
        officia modi repudiandae non mollitia porro excepturi dolorum id
        adipisci. Aliquam voluptatum ducimus necessitatibus eius dolor facere
        expedita, rerum voluptas! Id, amet adipisci? Voluptas, dolorum. Magnam
        recusandae provident adipisci laudantium dignissimos? Consectetur,
        necessitatibus eius quibusdam nesciunt nisi porro aperiam odit amet
        pariatur hic nulla fuga enim omnis asperiores cumque earum ut?
        Temporibus aspernatur totam incidunt possimus omnis, at voluptates
        perferendis, sapiente quis, dolorum ut porro. Ad possimus nobis
        perferendis! Placeat accusamus illum temporibus expedita eaque animi
        praesentium aliquam asperiores dicta minima tenetur tempore, nesciunt
        hic debitis laborum quia fuga fugiat sed ipsa. Ut ipsam maxime labore
        culpa. Unde, officia non facilis dignissimos vero repellendus quam
        inventore qui veritatis rem quia quasi? Ipsa reiciendis ab earum nulla
        magnam inventore blanditiis exercitationem saepe nam, fuga accusamus at
        consectetur neque et impedit tenetur veritatis omnis dicta, illum,
        doloribus nemo! Officiis modi explicabo praesentium sed molestias ullam
        consequuntur laudantium corporis sunt deleniti obcaecati necessitatibus
        qui aspernatur, excepturi impedit placeat facere eaque et suscipit esse
        totam nihil ab sapiente. Deserunt officiis numquam a porro accusantium
        dignissimos, magnam animi voluptas.
      </p>

      <Footer />
    </>
  );
}
