"use client";

import Image from "next/image";
import Gwen from "@/public/images/IMG_8296.JPG.jpeg";
import {
  WhatsappLogoIcon,
  InstagramLogoIcon,
  TiktokLogoIcon,
  SnapchatLogoIcon,
} from "@phosphor-icons/react";
import Link from "next/link";

export default function AboutUs() {
  return (
    <div>
      <div>
        <Image src={Gwen} alt="" />
      </div>
      <div>
        <div className="mb-5">
          <Link href="https://wa.link/tbabtd" target="_blank" rel="noopener noreferrer">
            <WhatsappLogoIcon size={32} />
            <span> Whatsapp </span>
          </Link>
        </div>

        <div className="mb-5" >
          <Link href="https://www.instagram.com/cabanaweargh?dlrf=MWUzdmo0NDJuY25uNg==" target="_blank" rel="noopener noreferrer">
            <InstagramLogoIcon size={32} />
            <span> Instagram </span>
          </Link>
        </div>

        <div className="mb-5">
          <Link href="https://www.tiktok.com/@g.wenyyy?_r=1&_t=ZP-9AwfwJXPuM3" target="_blank" rel="noopener noreferrer">
            <TiktokLogoIcon size={32} />
            <span> TikTok </span>
          </Link>
        </div>

        <div className="mb-5">
          <Link href="https://story.snapchat.com/u/gwendolin.enyam?share_id=CGphQSW2T5mowJor94NWrQ&locale=en_US" target="_blank" rel="noopener noreferrer">
            <SnapchatLogoIcon size={32} />
            <span> Snapchat </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
