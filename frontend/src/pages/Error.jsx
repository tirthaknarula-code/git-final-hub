import img from "../assets/404.png";

export default function Error() {
  return (
    <>
      <div className=" text-center w-75 m-auto">
        <img src={img} alt="" width={100} className="ms-21" />
        <h2 className="text-4xl p-4">404 Page Not Found</h2>
      </div>
    </>
  );
}
