import BeanstackProfile from "./BeanstackProfile";
import { PrototypeNav } from "../PrototypeNav";

export default function App() {
  return (
    <>
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 48, overflow: "hidden" }}>
        <BeanstackProfile />
      </div>
      <PrototypeNav currentHref="/bs-prototypes/student-profile/" />
    </>
  );
}
