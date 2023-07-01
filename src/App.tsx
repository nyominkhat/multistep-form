import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";

import { useToast } from "./components/ui/use-toast";

const schema = yup
  .object({
    name: yup.string().required(),
    password: yup
      .string()
      .required("No password provided.")
      .min(8, "Password is too short - should be 8 chars minimum.")
      .matches(/[a-zA-Z]/, "Password can only contain Latin letters."),
    address: yup.string().required(),
  })
  .required();

function App() {
  const [step, setStep] = useState<number>(0);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    trigger,

    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const onSubmit = handleSubmit((data) => {
    toast({
      title: "Success!",
      description: <pre>{JSON.stringify(data, null, 2)}</pre>,
    });
  });

  const prev = () => {
    setStep((prevState) => (prevState === 0 ? 0 : prevState - 1));
  };

  const next = async () => {
    if (step === 0) {
      const isValidName = await trigger("name");
      if (!isValidName) {
        return;
      }
    }

    if (step === 1) {
      const isValidPassword = await trigger("password");
      if (!isValidPassword) {
        return;
      }
    }

    setStep((prevState) => (prevState === 2 ? 2 : prevState + 1));
  };

  const getWidth = () => {
    return `${(step + 1) * 33.33}%`;
  };

  return (
    <>
      <div className="fixed left-0 w-screen px-1 select-none top-10">
        <p className="mx-5 mb-2 text-base font-semibold text-red-600">
          {step + 1} of 3
        </p>
        <div className=" bg-[#D6CBC1] rounded-full">
          <div
            style={{ width: getWidth() }}
            className="h-1.5 transition-all duration-500 bg-red-300 border border-red-300 rounded-md"
          ></div>
        </div>
      </div>
      <form
        onSubmit={onSubmit}
        className="w-screen h-screen overflow-hidden select-none bg-[#EEE2D7]"
      >
        <div
          className="flex w-full h-full transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${step * 100}%)` }}
        >
          <section className="flex flex-col items-center justify-center flex-shrink-0 w-full h-full gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-sm font-semibold">
                Username
              </label>
              <input
                className="px-3 py-2 rounded-md outline-none"
                id="name"
                type="text"
                {...register("name")}
              />
            </div>
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </section>

          <section className="flex flex-col items-center justify-center flex-shrink-0 w-full h-full gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm font-semibold">
                Type password
              </label>
              <input
                className="px-3 py-2 rounded-md outline-none"
                id="password"
                type="password"
                {...register("password")}
              />
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </section>

          <section className="flex flex-col items-center justify-center flex-shrink-0 w-full h-full gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="address" className="text-sm font-semibold">
                Type an address
              </label>
              <input
                className="px-3 py-2 rounded-md outline-none"
                id="address"
                type="text"
                {...register("address")}
              />
            </div>
            {errors.address && (
              <p className="text-sm text-red-500">{errors.address.message}</p>
            )}

            <button
              className="px-4 py-2 font-semibold text-white transition bg-black border border-white rounded-md hover:bg-black/80"
              type="submit"
            >
              Save
            </button>
          </section>
        </div>

        <div className="fixed gap-4 top-[50%] -translate-y-1/2 flex right-60">
          <button
            onClick={prev}
            type="button"
            className={`px-4 py-2 font-semibold text-white transition  border duration-300 border-white rounded-md ${
              step > 0
                ? "bg-black hover:bg-black/80"
                : "bg-[#c1b7ad] cursor-auto  text-gray-500"
            }`}
          >
            prev
          </button>
          <button
            onClick={next}
            type="button"
            className={`px-4 py-2 font-semibold text-white transition  border duration-300 border-white rounded-md ${
              step < 2
                ? "hover:bg-black/80 bg-black"
                : "bg-[#c1b7ad] cursor-auto text-gray-500"
            }`}
          >
            next
          </button>
        </div>
      </form>
    </>
  );
}

export default App;
