import Container from "@/components/layout/Container";
import { Mail } from "lucide-react";
import React from "react";

const ContactPage = () => {
  return <div>
    <Container>
      <div className="flex flex-col">
        <h4 className="">Contact Us</h4>
        <p className="">Choose what you need help with and we'll point you in the right direction</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="flex flex-col">
          <div className="">
            <h6 className="">Get in touch </h6>
            <p className="">Prefer direct contact? Use of any of the options below.</p>
          </div>

          <div className="space-y-8 flex flex-col">
            {/* email */}
            <div className="flex items-center">
              <div className="bg-primary/20 p-2 flex items-center justify-center">
                <Mail className="size-4" />
              </div>

              <div className="flex flex-col ">
                <p className="uppercase">email</p>
                <a href="mailto:" target="_blank" className="text-muted-foreground hover:text-primary">hello@listup.co.ke</a>
              </div>

            </div>

            {/* phone number */}
            <div className="flex items-center">
              <div className="bg-primary/20 p-2 flex items-center justify-center">
                <Mail className="size-4" />
              </div>

              <div className="flex flex-col ">
                <p className="uppercase">email</p>
                <a href="mailto:" target="_blank" className="text-muted-foreground hover:text-primary">hello@listup.co.ke</a>
              </div>

            </div>

            {/* location */}
            <div className="flex items-center">
              <div className="bg-primary/20 p-2 flex items-center justify-center">
                <Mail className="size-4" />
              </div>

              <div className="flex flex-col ">
                <p className="uppercase">email</p>
                <a href="mailto:" target="_blank" className="text-muted-foreground hover:text-primary">hello@listup.co.ke</a>
              </div>

            </div>

            {/* hours */}
            <div className="flex items-center">
              <div className="bg-primary/20 p-2 flex items-center justify-center">
                <Mail className="size-4" />
              </div>

              <div className="flex flex-col gap-4">
                <p className="uppercase">email</p>
                <a href="mailto:" target="_blank" className="text-muted-foreground hover:text-primary">hello@listup.co.ke</a>
              </div>

            </div>



          </div>

        </div>


      </div>


    </Container>

  </div>;
};

export default ContactPage;
